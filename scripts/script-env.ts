import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const SCRIPT_ENV_FILES = ['.env', '.env.local'] as const;

let loaded = false;

const normalizeValue = (rawValue: string) => {
  const trimmed = rawValue.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const quote = trimmed[0];
    const inner = trimmed.slice(1, -1);

    if (quote === "'") {
      return inner;
    }

    return inner
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }

  return trimmed.replace(/\s+#.*$/, '').trim();
};

const parseEnvFile = (contents: string) => {
  const parsed: Record<string, string> = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const withoutExport = line.startsWith('export ') ? line.slice(7).trim() : line;
    const separatorIndex = withoutExport.indexOf('=');
    if (separatorIndex <= 0) continue;

    const key = withoutExport.slice(0, separatorIndex).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;

    const value = withoutExport.slice(separatorIndex + 1);
    parsed[key] = normalizeValue(value);
  }

  return parsed;
};

export const loadScriptEnv = () => {
  if (loaded) return;
  loaded = true;

  const cwd = process.cwd();

  for (const filename of SCRIPT_ENV_FILES) {
    const filePath = path.resolve(cwd, filename);
    if (!existsSync(filePath)) continue;

    const parsed = parseEnvFile(readFileSync(filePath, 'utf8'));
    for (const [key, value] of Object.entries(parsed)) {
      process.env[key] = value;
    }
  }
};

export const SCRIPT_ENV_PRECEDENCE =
  '.env.local overrides .env, and both override inherited shell exports for keys they define.';

loadScriptEnv();
