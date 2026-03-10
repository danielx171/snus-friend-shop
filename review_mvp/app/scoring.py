from __future__ import annotations

from .schemas import Effort, Finding, Impact, Severity, Urgency


def _impact_to_float(value: Impact) -> float:
    return {Impact.LOW: 0.3, Impact.MEDIUM: 0.6, Impact.HIGH: 0.9}[value]


def _urgency_to_float(value: Urgency) -> float:
    return {Urgency.LOW: 0.3, Urgency.MEDIUM: 0.6, Urgency.HIGH: 0.9}[value]


def _effort_to_float(value: Effort) -> float:
    return {Effort.LOW: 0.2, Effort.MEDIUM: 0.5, Effort.HIGH: 0.8}[value]


def _severity_multiplier(value: Severity) -> float:
    return {
        Severity.LOW: 0.9,
        Severity.MEDIUM: 1.0,
        Severity.HIGH: 1.1,
        Severity.CRITICAL: 1.25,
    }[value]


def priority_score(finding: Finding, evidence_strength: float) -> float:
    raw = (
        (0.30 * evidence_strength)
        + (0.20 * _impact_to_float(finding.business_impact))
        + (0.20 * _impact_to_float(finding.risk_if_ignored))
        + (0.15 * _urgency_to_float(finding.urgency))
        + (0.10 * finding.confidence)
        - (0.05 * _effort_to_float(finding.implementation_effort))
    )
    score = raw * _severity_multiplier(finding.severity)
    return round(max(0.0, min(1.0, score)), 4)
