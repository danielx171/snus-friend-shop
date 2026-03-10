# Review MVP Index

Marker: `REVIEW_MVP_ANCHOR_V1`

Use this file as the single control point for finding, updating, or removing the review MVP.

## What this module is

- A local Python pipeline for evidence-first multi-model review.
- Scope: ingest evidence -> specialist reviews -> judge validation -> deterministic ranking -> reports.
- It is intentionally isolated under `review_mvp/`.

## Primary files and folders

- CLI entry: `review_mvp/app/main.py`
- Config/env loader: `review_mvp/app/config.py`
- Schemas: `review_mvp/app/schemas.py`
- Ingestion: `review_mvp/app/ingest.py`
- Validation rules: `review_mvp/app/validate.py`
- Deterministic scoring: `review_mvp/app/scoring.py`
- Reviewers:
  - `review_mvp/app/reviewers/ops_reviewer.py`
  - `review_mvp/app/reviewers/incident_reviewer.py`
  - `review_mvp/app/reviewers/base.py`
- Judge: `review_mvp/app/judge/judge.py`
- LLM adapter: `review_mvp/app/llm/openai_compatible.py`
- Reporting: `review_mvp/app/reporting.py`
- Tests: `review_mvp/tests/`
- Input samples: `review_mvp/data/raw/`
- Run outputs: `review_mvp/data/runs/`
- Setup docs: `review_mvp/README.md`
- Env template: `review_mvp/.env.example`

## How to find all related changes quickly

- Show only this module in git:
  - `git status -- review_mvp`
  - `git diff -- review_mvp`
- List tracked files in this module:
  - `git ls-files review_mvp`

## How to update safely

1. Keep changes scoped to `review_mvp/` unless absolutely required.
2. Run tests from `review_mvp/`:
   - `pytest -q`
3. Run a full pipeline check:
   - `python -m app.main run-all --input data/raw --runs-dir data/runs`
4. Confirm outputs under `review_mvp/data/runs/<run_id>/`.

## How to disable or remove quickly

- Temporary disable: set `REVIEW_USE_MOCK_LLM=true` in `review_mvp/.env`.
- Remove generated run artifacts only:
  - delete contents of `review_mvp/data/runs/`
- Remove the entire MVP code:
  - delete `review_mvp/`
- Remove root pointer too:
  - delete `REVIEW_MVP.md`

## Change ownership notes

- This module is optional and standalone.
- It does not gate storefront runtime behavior.
- If you need to archive it, keep `review_mvp/README.md` and this index in your commit for traceability.

## Suggested next upgrades (saved backlog)

Marker: `REVIEW_MVP_BACKLOG_V1`

1. Add deterministic rule reviewer (non-LLM baseline)
   - Implement `rule_reviewer` that flags high-signal operational patterns via hard rules.
   - Purpose: provide a baseline and detect when LLM reviewers add real value.

2. Add judge-output citation validation gate
   - Validate `judge_output.supported_findings` against packet evidence IDs before ranking.
   - Drop/mark unsupported findings deterministically.

3. Add reviewer reliability scorecard
   - Persist per-run reviewer stats (`submitted`, `supported`, `weak`, `contradicted`, average priority).
   - Add CLI summary command for trend/leaderboard view.

4. Add one-click daily run script
   - Add script to run the full pipeline and print report artifact paths.
   - Keep execution local and inspectable.

5. Add golden dataset evaluation pack
   - Create fixed sample scenarios with expected high-priority findings.
   - Use in tests to catch regressions in prompts/scoring/validation logic.
