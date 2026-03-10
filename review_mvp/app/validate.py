from __future__ import annotations

from collections import defaultdict

from .schemas import EvidencePacket, Finding, ReviewOutput, Severity


def validate_finding_citations(finding: Finding, packet: EvidencePacket) -> tuple[bool, str | None]:
    valid_ids = {item.id for item in packet.items}
    missing = [e_id for e_id in finding.evidence_ids if e_id not in valid_ids]
    if missing:
        return False, f"Missing evidence IDs: {', '.join(missing)}"
    return True, None


def enforce_severity_floor(finding: Finding, packet: EvidencePacket) -> Finding:
    evidence_by_id = {item.id: item for item in packet.items}
    sources = [evidence_by_id[e_id].source.lower() for e_id in finding.evidence_ids if e_id in evidence_by_id]
    if any("webhook" in s for s in sources) and finding.severity == Severity.LOW:
        finding.severity = Severity.MEDIUM
    if any("failed" in finding.claim.lower() for _ in [0]) and finding.severity == Severity.LOW:
        finding.severity = Severity.MEDIUM
    return finding


def evidence_strength(finding: Finding, packet: EvidencePacket) -> float:
    evidence_by_id = {item.id: item for item in packet.items}
    scores: list[float] = []
    for e_id in finding.evidence_ids:
        item = evidence_by_id.get(e_id)
        if not item:
            continue
        scores.append((item.trust_score * 0.6) + (item.freshness_score * 0.4))
    if not scores:
        return 0.0
    return round(sum(scores) / len(scores), 4)


def validate_review_output(review: ReviewOutput, packet: EvidencePacket) -> tuple[ReviewOutput, list[str]]:
    errors: list[str] = []
    validated: list[Finding] = []

    for idx, finding in enumerate(review.findings, start=1):
        ok, message = validate_finding_citations(finding, packet)
        if not ok:
            errors.append(f"{review.reviewer_id} finding {idx}: {message}")
            continue
        finding = enforce_severity_floor(finding, packet)
        finding.reviewer_id = review.reviewer_id
        finding.finding_id = finding.finding_id or f"{review.reviewer_id}-{idx}"
        validated.append(finding)

    review.findings = validated
    return review, errors


def dedupe_findings(findings: list[Finding]) -> list[Finding]:
    grouped: dict[tuple[str, str], list[Finding]] = defaultdict(list)
    for finding in findings:
        key = (finding.claim.strip().lower(), "|".join(sorted(finding.evidence_ids)))
        grouped[key].append(finding)
    deduped: list[Finding] = []
    for candidates in grouped.values():
        deduped.append(sorted(candidates, key=lambda f: f.confidence, reverse=True)[0])
    return deduped
