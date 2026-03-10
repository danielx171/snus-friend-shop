from __future__ import annotations

from abc import ABC, abstractmethod


class LLMProvider(ABC):
    @abstractmethod
    def generate_json(self, *, model: str, system_prompt: str, user_prompt: str) -> dict:
        raise NotImplementedError
