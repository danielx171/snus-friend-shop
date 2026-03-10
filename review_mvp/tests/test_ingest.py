from __future__ import annotations

from pathlib import Path

from app.ingest import build_evidence_packet


def test_build_evidence_packet() -> None:
    packet = build_evidence_packet(Path("data/raw"), "test-run")
    assert packet.packet_id == "evidence-test-run"
    assert len(packet.items) >= 5
    assert len({item.id for item in packet.items}) == len(packet.items)
