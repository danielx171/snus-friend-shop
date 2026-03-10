from __future__ import annotations

from .base import BaseReviewer


class OpsReviewer(BaseReviewer):
    reviewer_id = "ops_reviewer"

    def system_prompt(self) -> str:
        return (
            "You are an operations reliability reviewer. "
            "You focus on pipeline failures, retries, webhook stability, and data integrity. "
            "You must only use evidence in the packet."
        )

    def reviewer_focus(self) -> str:
        return "Order pipeline incidents, webhook failures, retries, delays, and technical root cause hypotheses."
