from __future__ import annotations

from app.schemas import Effort, Finding, Impact, Severity, Urgency
from app.scoring import priority_score


def test_priority_score_is_bounded() -> None:
    finding = Finding(
        claim="Critical sync failure",
        evidence_ids=["e1"],
        severity=Severity.CRITICAL,
        confidence=1.0,
        business_impact=Impact.HIGH,
        recommended_action="Fix immediately",
        urgency=Urgency.HIGH,
        risk_if_ignored=Impact.HIGH,
        implementation_effort=Effort.LOW,
    )
    score = priority_score(finding, evidence_strength=1.0)
    assert 0.0 <= score <= 1.0
    assert score > 0.8
