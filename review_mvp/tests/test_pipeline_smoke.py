from __future__ import annotations

from pathlib import Path

from app.ingest import build_evidence_packet
from app.schemas import JudgeOutput
from app.scoring import priority_score
from app.validate import evidence_strength


def test_packet_can_feed_scoring() -> None:
    packet = build_evidence_packet(Path("data/raw"), "smoke")
    assert packet.items

    finding = JudgeOutput.model_validate(
        {
            "judge_id": "judge",
            "supported_findings": [
                {
                    "claim": "Webhook auth failures are increasing",
                    "evidence_ids": [packet.items[0].id],
                    "severity": "high",
                    "confidence": 0.8,
                    "business_impact": "high",
                    "recommended_action": "Verify webhook secret rotation and domain allowlist",
                    "urgency": "high",
                    "risk_if_ignored": "high",
                    "implementation_effort": "medium",
                }
            ],
            "weak_findings": [],
            "contradicted_findings": [],
            "unresolved_questions": [],
            "needs_more_research": False,
        }
    ).supported_findings[0]

    score = priority_score(finding, evidence_strength(finding, packet))
    assert score > 0.0
