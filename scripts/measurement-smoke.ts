import { spawn } from 'node:child_process';
import process from 'node:process';
import { runMeasurementPreflight } from './measurement-preflight';

const runStep = (label: string, args: string[]) =>
  new Promise<boolean>((resolve) => {
    console.log(`\n=== ${label} ===`);
    const child = spawn(process.execPath, args, {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: process.env,
    });

    child.on('close', (code) => resolve(code === 0));
    child.on('error', () => resolve(false));
  });

const main = async () => {
  const preflightReady = runMeasurementPreflight();
  if (!preflightReady) {
    console.log('\nMeasurement smoke run stopped at preflight.');
    process.exit(1);
  }

  const results = [
    await runStep('PageSpeed CLI verification', ['run', 'scripts/pagespeed-audit.ts']),
    await runStep('Rank tracking smoke snapshot (writes one keyword snapshot batch)', [
      'run',
      'scripts/rank-audit.ts',
      '--limit=1',
    ]),
  ];

  const failed = results.includes(false);

  console.log('\nMeasurement smoke summary');
  console.log('-------------------------');
  console.log(`PageSpeed CLI verification: ${results[0] ? 'passed' : 'failed'}`);
  console.log(`Rank tracking smoke snapshot: ${results[1] ? 'passed' : 'failed'}`);
  console.log('Optional next step: bun run audit:gsc:sync --days=7');

  process.exit(failed ? 1 : 0);
};

void main();
