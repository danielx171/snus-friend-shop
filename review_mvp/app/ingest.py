from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .schemas import EvidenceItem, EvidencePacket, SourceType


def _infer_source_type(filename: str) -> SourceType:
    lower = filename.lower()
    if "webhook" in lower:
        return SourceType.WEBHOOK_EVENT
    if "retry" in lower:
        return SourceType.RETRY_EVENT
    if "metric" in lower or "summary" in lower:
        return SourceType.METRIC_SUMMARY
    if "order" in lower:
        return SourceType.ORDER_RECORD
    if "error" in lower or "log" in lower:
        return SourceType.INTERNAL_LOG
    return SourceType.OTHER


def _default_trust(source_type: SourceType) -> float:
    if source_type in {SourceType.ORDER_RECORD, SourceType.WEBHOOK_EVENT, SourceType.RETRY_EVENT}:
        return 0.9
    if source_type in {SourceType.INTERNAL_LOG, SourceType.METRIC_SUMMARY}:
        return 0.8
    if source_type == SourceType.EXTERNAL_RESEARCH:
        return 0.6
    return 0.7


def _parse_collected_at(record: dict[str, Any]) -> datetime:
    value = record.get("collected_at") or record.get("timestamp") or record.get("created_at")
    if isinstance(value, str):
        try:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
            if parsed.tzinfo is None:
                return parsed.replace(tzinfo=timezone.utc)
            return parsed
        except ValueError:
            pass
    return datetime.now(timezone.utc)


def _freshness_score(collected_at: datetime) -> float:
    age_hours = (datetime.now(timezone.utc) - collected_at).total_seconds() / 3600.0
    if age_hours <= 1:
        return 1.0
    if age_hours <= 6:
        return 0.9
    if age_hours <= 24:
        return 0.7
    if age_hours <= 72:
        return 0.5
    return 0.3


def _normalize_records(raw: Any) -> list[dict[str, Any]]:
    if isinstance(raw, list):
        return [r for r in raw if isinstance(r, dict)]
    if isinstance(raw, dict):
        if "records" in raw and isinstance(raw["records"], list):
            return [r for r in raw["records"] if isinstance(r, dict)]
        return [raw]
    raise ValueError("Input JSON must be object or array of objects")


def build_evidence_packet(input_dir: Path, run_id: str) -> EvidencePacket:
    if not input_dir.exists() or not input_dir.is_dir():
        raise FileNotFoundError(f"Input directory does not exist: {input_dir}")

    items: list[EvidenceItem] = []
    for file_path in sorted(input_dir.glob("*.json")):
        with file_path.open("r", encoding="utf-8") as handle:
            raw = json.load(handle)
        records = _normalize_records(raw)
        source_type = _infer_source_type(file_path.name)

        for idx, record in enumerate(records, start=1):
            collected_at = _parse_collected_at(record)
            item_id = record.get("id")
            if not isinstance(item_id, str) or not item_id.strip():
                item_id = f"{file_path.stem}:{idx}"
            title = str(record.get("title") or record.get("message") or f"{file_path.stem} record {idx}")
            tags = record.get("tags") if isinstance(record.get("tags"), list) else []

            items.append(
                EvidenceItem(
                    id=item_id,
                    title=title,
                    source=file_path.name,
                    source_type=source_type,
                    collected_at=collected_at,
                    content=record,
                    tags=[str(tag) for tag in tags],
                    trust_score=_default_trust(source_type),
                    freshness_score=_freshness_score(collected_at),
                )
            )

    if not items:
        raise ValueError(f"No JSON evidence files found in {input_dir}")

    return EvidencePacket(
        packet_id=f"evidence-{run_id}",
        created_at=datetime.now(timezone.utc),
        items=items,
    )
