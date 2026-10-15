import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import * as THREE from 'three';

test('attachment rings thread the slots and reach the shared pin depth', () => {
  const source = readFileSync(new URL('../components/Lanyard.jsx', import.meta.url), 'utf8');
  const helpers = source.slice(source.indexOf('const CARD_SIZES'), source.indexOf('const Lanyard ='));
  const setup = source.slice(source.indexOf('        ring.position.set(0, layout.ringY, 0);'),
    source.indexOf('        secondRing.scale.y = ring.scale.y;') + '        secondRing.scale.y = ring.scale.y;'.length);
  for (const secondCard of [false, true]) {
    const rings = vm.runInNewContext(helpers + `
      const layout = cardLayout('portrait', .5), s = { secondCard: ${secondCard} };
      const ring = new THREE.Object3D(), secondRing = new THREE.Object3D();
      ring.rotation.y = secondRing.rotation.y = Math.PI / 2 - .7;
      ${setup}
      [ring, secondRing].slice(0, s.secondCard ? 2 : 1).map((item, index) => {
        item.updateMatrix();
        const bottom = new THREE.Vector3(0, -RING_RADIUS, 0).applyMatrix4(item.matrix);
        const top = new THREE.Vector3(0, RING_RADIUS, 0).applyMatrix4(item.matrix);
        return { bottomError: Math.hypot(bottom.y - layout.slot.y, bottom.z),
          topError: Math.hypot(top.y - layout.hangY, top.z) };
      });
    `, { THREE });
    for (const ring of rings) {
      assert(ring.bottomError < 1e-10);
      assert(ring.topError < 1e-10);
    }
  }
});

test('clicking either card flips both together and a second click returns both', () => {
  const source = readFileSync(new URL('../components/Lanyard.jsx', import.meta.url), 'utf8');
  const createCard = () => ({ turn: 0, body: { position: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(), angular: new THREE.Vector3() } });
  const sim = createCard(), companion = createCard();
  const context = vm.createContext({ THREE, sim, companion, FLIP_SPIN: 3,
    settingsRef: { current: { secondCard: true } },
    camera: { position: new THREE.Vector3(0, 0, 10) },
    scratch: { a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3() } });
  const flipSource = source.slice(source.indexOf('    const flip ='), source.indexOf('    const onPointerDown ='));
  vm.runInContext(flipSource + '\nflip(new THREE.Vector3(1, 0, 0), companion);', context);
  assert.equal(Math.abs(sim.turn), Math.PI);
  assert.equal(sim.turn, companion.turn);
  assert(sim.body.angular.length() > 0);
  assert(sim.body.angular.equals(companion.body.angular));
  vm.runInContext('flip(new THREE.Vector3(1, 0, 0), sim);', context);
  assert.equal(sim.turn, 0);
  assert.equal(companion.turn, 0);
});

for (const dragHeight of [.4, 1, 3]) test(`shared-strap cards settle after dragging either card upward by ${dragHeight}`, () => {
  const source = readFileSync(new URL('../components/Lanyard.jsx', import.meta.url), 'utf8');
  const context = vm.createContext({ THREE });
  const helpers = source.slice(source.indexOf('const CARD_SIZES'), source.indexOf('const Lanyard ='));
  const result = vm.runInContext(helpers + `
    (() => {
      const layout = cardLayout('portrait', .5);
      const first = createSimulation(), second = createSimulation();
      for (const card of [first, second]) {
        card.anchor.set(0, 2.6, 0);
        configureSimulation(card, layout, 1.5);
        placeHanging(card, layout, false);
      }
      second.freeCard = true;
      first.body.hang.set(CARD_POSES[0].ringX, layout.hangY, 0);
      second.body.hang.set(CARD_POSES[1].ringX, layout.hangY, 0);
      const attachment = first.nodes[JOINTS].clone();
      first.clip.set(CLIP_HALF, CLIP_DROP, CLIP_DEPTH);
      [first, second].forEach((card, index) => { card.restTurn = CARD_POSES[index].yaw; });
      for (const [card, side] of [[first, 1], [second, -1]]) {
        card.body.position.copy(attachment).addScaledVector(first.clip, side)
          .sub(card.body.hang.clone().applyQuaternion(card.body.quaternion));
      }
      const physics = { gravity:48, hold:140, stiffness:1920, spring:40, bandDamping:45,
        linearDrag:1.3, angularDrag:2.2, air:.15, broadside:.5, spinAir:.03,
        nodeDrag:2, nodeAir:.2, twist:30, twistDamping:3, grip:40, gripDamping:6, breeze:0 };
      let stable = true, maxPenetration = 0;
      for (let frame = 0; frame < 1200; frame++) {
        if (frame === 120 || frame === 300) {
          const card = frame === 120 ? second : first;
          card.grab = { local:new THREE.Vector3(), rotation:card.body.quaternion.clone(),
            from:card.body.position.clone(), target:card.body.position.clone().add(new THREE.Vector3(frame === 120 ? 1 : -1, ${dragHeight}, 0)) };
        }
        if (frame === 180) second.grab = null;
        if (frame === 360) first.grab = null;
        stepSimulation(first, 1/60, physics, frame/60, second);
        maxPenetration = Math.max(maxPenetration, cardPenetration(first.body, second.body));
        for (const card of [first, second]) {
          stable &&= card.body.position.toArray().every(Number.isFinite) && card.body.position.length() < 20;
        }
      }
      const pin = card => card.body.hang.clone().applyQuaternion(card.body.quaternion).add(card.body.position);
      const clip = clipOffset(first.body, second.body, new THREE.Vector3());
      return { stable, attachmentError:pin(first).sub(pin(second)).sub(clip.multiplyScalar(2)).length(),
        clipTilt:Math.abs(clip.y),
        maxPenetration,
        speed:Math.max(first.body.velocity.length(), second.body.velocity.length()) };
    })()
  `, context);
  assert(result.stable);
  assert(result.attachmentError < .05, JSON.stringify(result));
  assert(result.maxPenetration < 1e-6, JSON.stringify(result));
  assert(result.speed < .2, JSON.stringify(result));
});
