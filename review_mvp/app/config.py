from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass(frozen=True)
class AppConfig:
    model_provider: str
    model_base_url: str
    model_api_key: str
    reviewer_model: str
    judge_model: str
    timeout_seconds: int
    use_mock_llm: bool


def load_config() -> AppConfig:
    load_dotenv()
    provider = os.getenv("REVIEW_MODEL_PROVIDER", "openai_compatible")
    base_url = os.getenv("REVIEW_MODEL_BASE_URL", "https://api.openai.com/v1")
    api_key = os.getenv("REVIEW_MODEL_API_KEY", "")
    reviewer_model = os.getenv("REVIEW_REVIEWER_MODEL", "gpt-4o-mini")
    judge_model = os.getenv("REVIEW_JUDGE_MODEL", "gpt-4.1")
    timeout_seconds = int(os.getenv("REVIEW_TIMEOUT_SECONDS", "60"))
    use_mock_llm = os.getenv("REVIEW_USE_MOCK_LLM", "false").lower() == "true"

    if not use_mock_llm and not api_key:
        raise RuntimeError("REVIEW_MODEL_API_KEY is required unless REVIEW_USE_MOCK_LLM=true")

    return AppConfig(
        model_provider=provider,
        model_base_url=base_url,
        model_api_key=api_key,
        reviewer_model=reviewer_model,
        judge_model=judge_model,
        timeout_seconds=timeout_seconds,
        use_mock_llm=use_mock_llm,
    )
