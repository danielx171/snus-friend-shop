from __future__ import annotations

import json

from app.llm.base import LLMProvider
from app.schemas import EvidencePacket, JudgeOutput, ReviewOutput


class JudgeRunner:
    def __init__(self, provider: LLMProvider, model: str, judge_id: str = "judge") -> None:
        self.provider = provider
        self.model = model
        self.judge_id = judge_id

    def system_prompt(self) -> str:
        return (
            "You are a strict evidence judge. "
            "Use only supplied evidence and reviewer outputs. "
            "Reject unsupported claims and highlight contradictions. "
            "Do not invent facts or perform external fact checking."
        )

    def run(self, packet: EvidencePacket, reviews: list[ReviewOutput]) -> JudgeOutput:
        user_prompt = (
            "Validate reviewer findings against evidence packet.\n"
            "Tasks: remove duplicates, reject unsupported claims, flag contradictions, and list unresolved questions.\n"
            "Output JSON keys: judge_id, supported_findings, weak_findings, contradicted_findings, "
            "unresolved_questions, needs_more_research.\n\n"
            f"Evidence packet:\n{json.dumps(packet.model_dump(mode='json'), ensure_ascii=True)}\n\n"
            f"Reviewer outputs:\n{json.dumps([r.model_dump(mode='json') for r in reviews], ensure_ascii=True)}"
        )
        raw = self.provider.generate_json(
            model=self.model,
            system_prompt=self.system_prompt(),
            user_prompt=user_prompt,
        )
        raw["judge_id"] = self.judge_id
        return JudgeOutput.model_validate(raw)
