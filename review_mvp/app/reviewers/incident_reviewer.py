from __future__ import annotations

from .base import BaseReviewer


class IncidentReviewer(BaseReviewer):
    reviewer_id = "incident_reviewer"

    def system_prompt(self) -> str:
        return (
            "You are an incident triage reviewer. "
            "You focus on business impact, urgency, customer risk, and practical remediation sequencing. "
            "You must only use evidence in the packet."
        )

    def reviewer_focus(self) -> str:
        return "Business and customer impact prioritization for operational incidents."
