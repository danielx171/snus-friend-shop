from __future__ import annotations

import json
from abc import ABC, abstractmethod

from app.llm.base import LLMProvider
from app.schemas import EvidencePacket, ReviewOutput


class BaseReviewer(ABC):
    reviewer_id: str

    def __init__(self, provider: LLMProvider, model: str) -> None:
        self.provider = provider
        self.model = model

    @abstractmethod
    def system_prompt(self) -> str:
        raise NotImplementedError

    @abstractmethod
    def reviewer_focus(self) -> str:
        raise NotImplementedError

    def run(self, packet: EvidencePacket) -> ReviewOutput:
        evidence_payload = packet.model_dump(mode="json")
        user_prompt = (
            "You must analyze only the provided evidence packet and produce JSON output.\n"
            "Every finding must include evidence_ids that exist in the packet.\n"
            "Do not include claims without evidence support.\n"
            f"Reviewer focus: {self.reviewer_focus()}\n"
            "Required output schema keys: reviewer_id, findings, notes.\n"
            "Each finding must include: claim, evidence_ids, severity, confidence, business_impact, "
            "recommended_action, urgency, risk_if_ignored, implementation_effort.\n\n"
            f"Evidence packet JSON:\n{json.dumps(evidence_payload, ensure_ascii=True)}"
        )

        raw = self.provider.generate_json(
            model=self.model,
            system_prompt=self.system_prompt(),
            user_prompt=user_prompt,
        )
        raw["reviewer_id"] = self.reviewer_id
        return ReviewOutput.model_validate(raw)
