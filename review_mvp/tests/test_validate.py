from __future__ import annotations

from datetime import datetime, timezone

from app.schemas import (
    Effort,
    EvidenceItem,
    EvidencePacket,
    Finding,
    Impact,
    ReviewOutput,
    Severity,
    SourceType,
    Urgency,
)
from app.validate import validate_review_output


def test_validate_review_drops_missing_citations() -> None:
    packet = EvidencePacket(
        packet_id="p1",
        created_at=datetime.now(timezone.utc),
        items=[
            EvidenceItem(
                id="e1",
                title="x",
                source="a.json",
                source_type=SourceType.INTERNAL_LOG,
                collected_at=datetime.now(timezone.utc),
                content={"message": "x"},
                trust_score=0.8,
                freshness_score=0.7,
            )
        ],
    )
    review = ReviewOutput(
        reviewer_id="ops",
        findings=[
            Finding(
                claim="Valid",
                evidence_ids=["e1"],
                severity=Severity.MEDIUM,
                confidence=0.8,
                business_impact=Impact.MEDIUM,
                recommended_action="Do x",
                urgency=Urgency.MEDIUM,
                risk_if_ignored=Impact.HIGH,
                implementation_effort=Effort.LOW,
            ),
            Finding(
                claim="Invalid",
                evidence_ids=["missing"],
                severity=Severity.LOW,
                confidence=0.4,
                business_impact=Impact.LOW,
                recommended_action="Do y",
                urgency=Urgency.LOW,
                risk_if_ignored=Impact.LOW,
                implementation_effort=Effort.LOW,
            ),
        ],
    )
    validated, errors = validate_review_output(review, packet)
    assert len(validated.findings) == 1
    assert len(errors) == 1
