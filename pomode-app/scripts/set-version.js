#!/usr/bin/env node
/**
 * set-version.js
 * Lê a versão de package.json e sincroniza para:
 *  - src/environments/environment.ts
 *  - src/environments/environment.development.ts
 *  - src/assets/i18n/en.json
 *  - src/assets/i18n/pt.json
 *  - src/assets/i18n/es.json
 *
 * Executado automaticamente via "prebuild" antes de qualquer `ng build`.
 */

const fs   = require('fs');
const path = require('path');

const pkg     = require('../package.json');
const version = pkg.version;

// ── Environment files ─────────────────────────────────────────────────────────

const envFiles = [
  path.resolve(__dirname, '../src/environments/environment.ts'),
  path.resolve(__dirname, '../src/environments/environment.development.ts'),
];

envFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replace(/version:\s*'[^']*'/, `version: '${version}'`);
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`[set-version] ${path.basename(filePath)} → version: '${version}'`);
});

// ── i18n files ────────────────────────────────────────────────────────────────

const i18nFiles = [
  path.resolve(__dirname, '../src/assets/i18n/en.json'),
  path.resolve(__dirname, '../src/assets/i18n/pt.json'),
  path.resolve(__dirname, '../src/assets/i18n/es.json'),
];

i18nFiles.forEach(filePath => {
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (json.APP?.VERSION !== undefined) {
    json.APP.VERSION = `v${version}`;
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log(`[set-version] ${path.basename(filePath)} → APP.VERSION: v${version}`);
  }
});
