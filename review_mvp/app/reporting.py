from __future__ import annotations

import json
from pathlib import Path

from .schemas import FinalReport


def save_json_report(report: FinalReport, output_path: Path) -> None:
    output_path.write_text(report.model_dump_json(indent=2), encoding="utf-8")


def save_markdown_report(report: FinalReport, output_path: Path) -> None:
    lines: list[str] = []
    lines.append(f"# Multi-Model Review Report ({report.run_id})")
    lines.append("")
    lines.append(f"- Packet: `{report.packet_id}`")
    lines.append(f"- Evidence items: **{report.total_evidence_items}**")
    lines.append(f"- Raw findings: **{report.total_raw_findings}**")
    lines.append(f"- Supported findings: **{report.total_supported_findings}**")
    lines.append("")
    lines.append("## Prioritized Actions")
    lines.append("")
    for action in report.actions:
        finding = action.finding
        lines.append(f"### {action.rank}. {finding.claim}")
        lines.append(f"- Priority score: **{action.priority_score:.3f}**")
        lines.append(f"- Severity: `{finding.severity.value}` | Confidence: `{finding.confidence:.2f}`")
        lines.append(f"- Business impact: `{finding.business_impact.value}` | Risk if ignored: `{finding.risk_if_ignored.value}`")
        lines.append(f"- Urgency: `{finding.urgency.value}` | Effort: `{finding.implementation_effort.value}`")
        lines.append(f"- Recommended action: {finding.recommended_action}")
        lines.append(f"- Evidence IDs: {', '.join(finding.evidence_ids)}")
        lines.append(f"- Rationale: {action.rationale}")
        lines.append("")

    if report.weak_findings:
        lines.append("## Weak Findings")
        lines.append("")
        for finding in report.weak_findings:
            lines.append(f"- {finding.claim} (evidence: {', '.join(finding.evidence_ids)})")
        lines.append("")

    if report.contradicted_findings:
        lines.append("## Contradicted Findings")
        lines.append("")
        for finding in report.contradicted_findings:
            lines.append(f"- {finding.claim} (evidence: {', '.join(finding.evidence_ids)})")
        lines.append("")

    if report.unresolved_questions:
        lines.append("## Unresolved Questions")
        lines.append("")
        for question in report.unresolved_questions:
            lines.append(f"- {question}")
        lines.append("")

    output_path.write_text("\n".join(lines), encoding="utf-8")


def save_json(data: dict, output_path: Path) -> None:
    output_path.write_text(json.dumps(data, indent=2), encoding="utf-8")
