# Evidence-Based Multi-Model Review MVP

This is a local Python MVP for evidence-first multi-model operational review.

## What it does

1. Builds a structured evidence packet from local JSON data.
2. Sends the same packet to two specialist reviewers.
3. Validates reviewer claims deterministically (evidence ID checks + gating).
4. Sends packet + reviewer outputs to a judge model.
5. Produces deterministic prioritized actions and JSON/Markdown reports.
6. Saves intermediate run artifacts for auditability.

## Architecture

- `app/ingest.py`: builds normalized `EvidencePacket`
- `app/reviewers/`: specialist reviewer prompts and execution
- `app/validate.py`: deterministic validation and dedupe helpers
- `app/judge/judge.py`: judge runner
- `app/scoring.py`: deterministic ranking formula
- `app/reporting.py`: JSON + Markdown report generation
- `app/main.py`: CLI orchestration

## Setup

```bash
cd review_mvp
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Update `.env` with your API settings.

## Environment variables

- `REVIEW_MODEL_PROVIDER` (`openai_compatible`)
- `REVIEW_MODEL_BASE_URL` (e.g. `https://api.openai.com/v1`)
- `REVIEW_MODEL_API_KEY`
- `REVIEW_REVIEWER_MODEL` (review model name)
- `REVIEW_JUDGE_MODEL` (judge model name)
- `REVIEW_TIMEOUT_SECONDS`
- `REVIEW_USE_MOCK_LLM` (`true`/`false`)

Use `REVIEW_USE_MOCK_LLM=true` for local dry-runs without API calls.

## CLI usage

### Run full pipeline

```bash
python -m app.main run-all --input data/raw --runs-dir data/runs
```

Outputs are created under `data/runs/<run_id>/`:

- `evidence_packet.json`
- `review_ops.json`
- `review_incident.json`
- `validation_errors.json`
- `judge_output.json`
- `final_report.json`
- `final_report.md`

### Step-by-step

```bash
python -m app.main build-evidence --input data/raw --runs-dir data/runs
python -m app.main review --reviewer ops --evidence <packet.json> --output review_ops.json
python -m app.main review --reviewer incident --evidence <packet.json> --output review_incident.json
python -m app.main judge --evidence <packet.json> --reviews review_ops.json review_incident.json --output-json final_report.json --output-md final_report.md
```

## Deterministic controls in this MVP

- Pydantic schema validation at every stage.
- Evidence ID referential integrity checks.
- Severity floor enforcement for some failure patterns.
- Deterministic priority scoring in code.
- Strict JSON parse expectations for LLM outputs.

## Scoring formula

`score = 0.30*evidence_strength + 0.20*business_impact + 0.20*risk_if_ignored + 0.15*urgency + 0.10*confidence - 0.05*implementation_effort`

Then multiplied by severity multiplier and clamped to `[0,1]`.

## Tests

```bash
pytest -q
```

Tests cover ingestion, citation validation, scoring bounds, and a smoke pipeline path.

## Current limitations (intentional for V1)

- No persistent outcome tracking DB yet.
- No external web research ingestion yet.
- Minimal contradiction logic (mostly delegated to judge model).
- Reviewer quality depends on model quality and prompt adherence.

## Next phase ideas

- Add deterministic rule-engine reviewer (non-LLM baseline).
- Add evaluation harness with labeled expected findings.
- Add outcome tracking and reviewer reliability analytics.
- Add provider adapters beyond OpenAI-compatible APIs.
