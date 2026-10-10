import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { isTearaStatusQuestion, loadTearaStatus, tearaReleaseAnswer } from '../lib/teara-status.ts';

test('guide release answer uses the exact project status, not an old version', () => {
  const status = JSON.parse(readFileSync(new URL('../public/teara-status.json', import.meta.url)));
  const answer = tearaReleaseAnswer(status);
  assert(answer.includes(`version ${status.version}`));
  assert(answer.includes(status.status));
  assert(!answer.includes('version 1.1'));
  assert(!answer.includes('build 32'));
  assert(answer.includes('No pending update'));
});

test('pending updates are derived from the same status data', () => {
  const answer = tearaReleaseAnswer({ version: '2.0', build: null, status: 'Live on the App Store',
    nextUpdate: {version:'2.1',build:'99',status:'Waiting for App Review'} });
  assert.match(answer, /version 2.0/);
  assert.match(answer, /Pending update: version 2.1 · build 99 · Waiting for App Review/);
});

test('both guides recognize release questions and contextual follow-ups', () => {
  assert(isTearaStatusQuestion("What's happening with Teara?", [], 'portfolio'));
  assert(isTearaStatusQuestion("isn't it already in v1.3 in the app store?", [{content:'Tell me about Teara'}], 'portfolio'));
  assert(isTearaStatusQuestion('What is the current development progress?', [], 'jarvis'));
  assert(!isTearaStatusQuestion('What is the development status?', [], 'portfolio'));
});

test('failed status fetch never returns stale release facts', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('', {status:503}));
  await assert.rejects(loadTearaStatus(), /unavailable/);
});
