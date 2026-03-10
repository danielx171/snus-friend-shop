from __future__ import annotations

import json

import requests

from .base import LLMProvider


def _extract_json(text: str) -> dict:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:].strip()
    return json.loads(cleaned)


class OpenAICompatibleProvider(LLMProvider):
    def __init__(self, *, base_url: str, api_key: str, timeout_seconds: int) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.timeout_seconds = timeout_seconds

    def generate_json(self, *, model: str, system_prompt: str, user_prompt: str) -> dict:
        url = f"{self.base_url}/chat/completions"
        payload = {
            "model": model,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0,
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        response = requests.post(url, json=payload, headers=headers, timeout=self.timeout_seconds)
        response.raise_for_status()
        body = response.json()
        content = body["choices"][0]["message"]["content"]
        if isinstance(content, list):
            parts = [part.get("text", "") for part in content if isinstance(part, dict)]
            content_text = "\n".join(parts)
        else:
            content_text = str(content)
        return _extract_json(content_text)


class MockProvider(LLMProvider):
    def generate_json(self, *, model: str, system_prompt: str, user_prompt: str) -> dict:
        if "judge" in system_prompt.lower():
            return {
                "judge_id": "judge",
                "supported_findings": [],
                "weak_findings": [],
                "contradicted_findings": [],
                "unresolved_questions": ["Mock mode enabled; no real judge analysis executed."],
                "needs_more_research": True,
            }
        return {
            "reviewer_id": "mock",
            "findings": [],
            "notes": "Mock mode enabled; no real reviewer analysis executed.",
        }
