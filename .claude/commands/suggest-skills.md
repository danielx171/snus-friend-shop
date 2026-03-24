# Suggest New Skills

Review recent work patterns and suggest new or updated skills.

## Steps

1. **Read recent commits** — `git log --oneline -30` to see what work was done
2. **Identify repetitive patterns** — Look for tasks that were done 3+ times:
   - Same sequence of tools/commands
   - Same files edited in a pattern
   - Same verification steps
3. **Check existing skills** — Read all files in `.claude/commands/` to see what's covered
4. **Identify gaps** — What patterns are NOT covered by existing skills?
5. **Check for stale skills** — Are any existing skills outdated?
   - Do file paths still exist?
   - Are version numbers current?
   - Are project IDs correct?

## Report Format

### New Skills Suggested
| Skill | Trigger | What it automates |
|-------|---------|-------------------|
| ... | ... | ... |

### Existing Skills to Update
| Skill | What changed |
|-------|-------------|
| ... | ... |

### No Action Needed
Skills that are still accurate and relevant.

## When to Run
- At the end of a work session
- After completing a major feature
- Weekly maintenance
