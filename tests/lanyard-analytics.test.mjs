import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../components/Lanyard.jsx', import.meta.url), 'utf8');
const handler = source.slice(source.indexOf('    const onPointerUp ='), source.indexOf('    const onTouchStart ='));

for (const badgeId of [1, 2]) {
  for (const scenario of ['drag', 'flip', 'hold', 'pointercancel', 'lostpointercapture']) {
    test(`badge ${badgeId}: ${scenario} counts only completed actions, once`, () => {
      const events = [], flips = [];
      const sim = { grab: {} }, companion = { grab: {} };
      const context = vm.createContext({
        activeSim: badgeId === 1 ? sim : companion, sim, companion,
        press: scenario === 'drag' ? null : { time: scenario === 'hold' ? 0 : 900, point: {} },
        performance: { now: () => 1000 },
        settingsRef: { current: { secondCard: true, onInteraction: e => events.push(e) } },
        flip: (...args) => flips.push(args), canvas: { releasePointerCapture() {} },
        hovering: false, setCursor() {}, start() {},
        event: { type: ['pointercancel', 'lostpointercapture'].includes(scenario) ? scenario : 'pointerup', pointerType: 'touch', pointerId: 1 }
      });
      vm.runInContext(handler + '\nonPointerUp(event); onPointerUp({...event, type:"lostpointercapture"});', context);
      const expected = ['drag', 'flip'].includes(scenario);
      assert.equal(events.length, expected ? 1 : 0);
      assert.equal(flips.length, scenario === 'flip' ? 1 : 0);
      if (expected) {
        assert.equal(events[0].action, scenario);
        assert.equal(events[0].badge_id, badgeId);
        assert.equal(events[0].badge_count, scenario === 'flip' ? 2 : 1);
        assert.equal(events[0].input_type, 'touch');
      }
    });
  }
}
