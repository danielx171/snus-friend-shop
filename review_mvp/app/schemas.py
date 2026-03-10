from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, field_validator


class SourceType(str, Enum):
    INTERNAL_LOG = "internal_log"
    METRIC_SUMMARY = "metric_summary"
    ORDER_RECORD = "order_record"
    WEBHOOK_EVENT = "webhook_event"
    RETRY_EVENT = "retry_event"
    EXTERNAL_RESEARCH = "external_research"
    OTHER = "other"


class Severity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Impact(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Urgency(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Effort(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class EvidenceItem(BaseModel):
    id: str
    title: str
    source: str
    source_type: SourceType
    collected_at: datetime
    content: dict[str, Any] | str
    tags: list[str] = Field(default_factory=list)
    trust_score: float = Field(ge=0.0, le=1.0)
    freshness_score: float = Field(ge=0.0, le=1.0)


class EvidencePacket(BaseModel):
    packet_id: str
    created_at: datetime
    items: list[EvidenceItem]

    @field_validator("items")
    @classmethod
    def unique_ids(cls, items: list[EvidenceItem]) -> list[EvidenceItem]:
        ids = [item.id for item in items]
        if len(ids) != len(set(ids)):
            raise ValueError("Evidence item IDs must be unique")
        return items


class Finding(BaseModel):
    finding_id: str | None = None
    claim: str
    evidence_ids: list[str] = Field(min_length=1)
    severity: Severity
    confidence: float = Field(ge=0.0, le=1.0)
    business_impact: Impact
    recommended_action: str
    urgency: Urgency
    risk_if_ignored: Impact
    implementation_effort: Effort
    reviewer_id: str | None = None


class ReviewOutput(BaseModel):
    reviewer_id: str
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    findings: list[Finding] = Field(default_factory=list)
    notes: str | None = None


class JudgeOutput(BaseModel):
    judge_id: str
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    supported_findings: list[Finding] = Field(default_factory=list)
    weak_findings: list[Finding] = Field(default_factory=list)
    contradicted_findings: list[Finding] = Field(default_factory=list)
    unresolved_questions: list[str] = Field(default_factory=list)
    needs_more_research: bool = False


class PrioritizedAction(BaseModel):
    rank: int
    priority_score: float
    finding: Finding
    evidence_strength: float = Field(ge=0.0, le=1.0)
    rationale: str


class FinalReport(BaseModel):
    run_id: str
    created_at: datetime
    packet_id: str
    total_evidence_items: int
    total_raw_findings: int
    total_supported_findings: int
    actions: list[PrioritizedAction]
    weak_findings: list[Finding]
    contradicted_findings: list[Finding]
    unresolved_questions: list[str]
