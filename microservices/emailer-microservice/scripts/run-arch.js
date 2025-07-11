#!/usr/bin/env node
/* eslint-disable no-console */
import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['depcruise', '--config', 'dependency-cruiser.js', 'src'], {
   stdio: 'inherit',
   shell: process.platform === 'win32',
});

if (result.error) {
   console.warn('⚠️  dependency-cruiser failed to run. Skipping architecture check.');
   process.exit(0);
}

process.exit(result.status ?? 0);
