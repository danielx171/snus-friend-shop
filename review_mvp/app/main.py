from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

from app.config import AppConfig, load_config
from app.ingest import build_evidence_packet
from app.judge.judge import JudgeRunner
from app.llm.base import LLMProvider
from app.llm.openai_compatible import MockProvider, OpenAICompatibleProvider
from app.reporting import save_json_report, save_markdown_report
from app.run_manager import make_run_id, prepare_run_dirs
from app.schemas import (
    EvidencePacket,
    FinalReport,
    JudgeOutput,
    PrioritizedAction,
    ReviewOutput,
)
from app.scoring import priority_score
from app.validate import dedupe_findings, evidence_strength, validate_review_output
from app.reviewers.incident_reviewer import IncidentReviewer
from app.reviewers.ops_reviewer import OpsReviewer


def _provider_from_config(config: AppConfig) -> LLMProvider:
    if config.use_mock_llm:
        return MockProvider()
    if config.model_provider != "openai_compatible":
        raise ValueError(f"Unsupported provider: {config.model_provider}")
    return OpenAICompatibleProvider(
        base_url=config.model_base_url,
        api_key=config.model_api_key,
        timeout_seconds=config.timeout_seconds,
    )


def _load_packet(path: Path) -> EvidencePacket:
    return EvidencePacket.model_validate_json(path.read_text(encoding="utf-8"))


def _load_review(path: Path) -> ReviewOutput:
    return ReviewOutput.model_validate_json(path.read_text(encoding="utf-8"))


def _load_reviews(paths: list[Path]) -> list[ReviewOutput]:
    return [_load_review(path) for path in paths]


def cmd_build_evidence(args: argparse.Namespace) -> None:
    run_id = make_run_id()
    run_dir = prepare_run_dirs(Path(args.runs_dir), run_id)
    packet = build_evidence_packet(Path(args.input), run_id)
    path = run_dir / "evidence_packet.json"
    path.write_text(packet.model_dump_json(indent=2), encoding="utf-8")
    print(path)


def _run_reviewer(args: argparse.Namespace, reviewer_name: str) -> Path:
    config = load_config()
    provider = _provider_from_config(config)
    packet = _load_packet(Path(args.evidence))

    reviewer = OpsReviewer(provider, config.reviewer_model) if reviewer_name == "ops" else IncidentReviewer(provider, config.reviewer_model)
    review = reviewer.run(packet)
    review, errors = validate_review_output(review, packet)
    if errors:
        print("\n".join(errors))

    output = Path(args.output)
    output.write_text(review.model_dump_json(indent=2), encoding="utf-8")
    return output


def cmd_review(args: argparse.Namespace) -> None:
    path = _run_reviewer(args, args.reviewer)
    print(path)


def _rank_actions(judge_output: JudgeOutput, packet: EvidencePacket) -> list[PrioritizedAction]:
    candidates = dedupe_findings(judge_output.supported_findings)
    scored: list[PrioritizedAction] = []
    for finding in candidates:
        strength = evidence_strength(finding, packet)
        score = priority_score(finding, strength)
        scored.append(
            PrioritizedAction(
                rank=0,
                priority_score=score,
                finding=finding,
                evidence_strength=strength,
                rationale="Deterministic weighted score using evidence strength, impact, urgency, confidence, and effort.",
            )
        )

    scored.sort(key=lambda x: (x.priority_score, x.evidence_strength), reverse=True)
    for idx, action in enumerate(scored, start=1):
        action.rank = idx
    return scored


def cmd_judge(args: argparse.Namespace) -> None:
    config = load_config()
    provider = _provider_from_config(config)
    packet = _load_packet(Path(args.evidence))
    reviews = _load_reviews([Path(path) for path in args.reviews])

    judge = JudgeRunner(provider, config.judge_model)
    judge_output = judge.run(packet, reviews)
    actions = _rank_actions(judge_output, packet)

    report = FinalReport(
        run_id=args.run_id or make_run_id(),
        created_at=datetime.now(timezone.utc),
        packet_id=packet.packet_id,
        total_evidence_items=len(packet.items),
        total_raw_findings=sum(len(r.findings) for r in reviews),
        total_supported_findings=len(judge_output.supported_findings),
        actions=actions,
        weak_findings=judge_output.weak_findings,
        contradicted_findings=judge_output.contradicted_findings,
        unresolved_questions=judge_output.unresolved_questions,
    )

    output_json = Path(args.output_json)
    output_md = Path(args.output_md)
    save_json_report(report, output_json)
    save_markdown_report(report, output_md)
    print(output_json)
    print(output_md)


def cmd_run_all(args: argparse.Namespace) -> None:
    run_id = make_run_id()
    run_dir = prepare_run_dirs(Path(args.runs_dir), run_id)
    packet = build_evidence_packet(Path(args.input), run_id)
    evidence_path = run_dir / "evidence_packet.json"
    evidence_path.write_text(packet.model_dump_json(indent=2), encoding="utf-8")

    config = load_config()
    provider = _provider_from_config(config)

    ops_review = OpsReviewer(provider, config.reviewer_model).run(packet)
    ops_review, ops_errors = validate_review_output(ops_review, packet)
    ops_path = run_dir / "review_ops.json"
    ops_path.write_text(ops_review.model_dump_json(indent=2), encoding="utf-8")

    incident_review = IncidentReviewer(provider, config.reviewer_model).run(packet)
    incident_review, incident_errors = validate_review_output(incident_review, packet)
    incident_path = run_dir / "review_incident.json"
    incident_path.write_text(incident_review.model_dump_json(indent=2), encoding="utf-8")

    validation_errors = {"ops": ops_errors, "incident": incident_errors}
    (run_dir / "validation_errors.json").write_text(json.dumps(validation_errors, indent=2), encoding="utf-8")

    judge_output = JudgeRunner(provider, config.judge_model).run(packet, [ops_review, incident_review])
    (run_dir / "judge_output.json").write_text(judge_output.model_dump_json(indent=2), encoding="utf-8")

    actions = _rank_actions(judge_output, packet)
    report = FinalReport(
        run_id=run_id,
        created_at=datetime.now(timezone.utc),
        packet_id=packet.packet_id,
        total_evidence_items=len(packet.items),
        total_raw_findings=len(ops_review.findings) + len(incident_review.findings),
        total_supported_findings=len(judge_output.supported_findings),
        actions=actions,
        weak_findings=judge_output.weak_findings,
        contradicted_findings=judge_output.contradicted_findings,
        unresolved_questions=judge_output.unresolved_questions,
    )
    save_json_report(report, run_dir / "final_report.json")
    save_markdown_report(report, run_dir / "final_report.md")
    print(run_dir)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Evidence-based multi-model review MVP")
    sub = parser.add_subparsers(dest="command", required=True)

    build = sub.add_parser("build-evidence")
    build.add_argument("--input", required=True)
    build.add_argument("--runs-dir", default="data/runs")
    build.set_defaults(func=cmd_build_evidence)

    review = sub.add_parser("review")
    review.add_argument("--reviewer", choices=["ops", "incident"], required=True)
    review.add_argument("--evidence", required=True)
    review.add_argument("--output", required=True)
    review.set_defaults(func=cmd_review)

    judge = sub.add_parser("judge")
    judge.add_argument("--evidence", required=True)
    judge.add_argument("--reviews", nargs="+", required=True)
    judge.add_argument("--output-json", required=True)
    judge.add_argument("--output-md", required=True)
    judge.add_argument("--run-id", required=False)
    judge.set_defaults(func=cmd_judge)

    run_all = sub.add_parser("run-all")
    run_all.add_argument("--input", required=True)
    run_all.add_argument("--runs-dir", default="data/runs")
    run_all.set_defaults(func=cmd_run_all)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
