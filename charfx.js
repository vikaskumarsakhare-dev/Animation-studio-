/* Character effects for Pixy Motion (load AFTER editor.js).
   Folder "Character" in the Effect Browser:
   1. Walk / Run (Skeleton)  2. Head Yes / No  3. Expression (Blink / Talk / Smile / Surprise)
   Works on any image layer. Every setting can be keyframed with curves like the other effects. */
(function () {
  'use strict';
  if (typeof fxAdd !== 'function' || typeof FXFOLD === 'undefined') { try { console.warn('charfx: editor.js is not loaded'); } catch (e) {} return; }
  if (FXFOLD.indexOf('Character') < 0) FXFOLD.push('Character');
  const TAU = Math.PI * 2, PI = Math.PI;
  const c01 = x => Math.max(0, Math.min(1, x));

  /* step phase: keeps running smoothly even when Step speed is keyframed */
  function phaseOf(ev) {
    const o = ev.o, t0 = (o && o.t0) || 0, dt = 1 / 20, n = Math.max(0, Math.min(2400, Math.ceil((ev.t - t0) / dt)));
    let p = 0; for (let i = 0; i < n; i++) p += efvN(ev.e, 'speed', t0 + i * dt) * dt;
    return p * TAU;
  }

  /* ---------- 1. Walk / Run ---------- */
  fxAdd('Character', 'cwalk', 'Walk / Run (Skeleton)', [
    nN('amt', 'Walk amount (0 = stand)', 0, 100, 1, 70, '%'),
    nN('speed', 'Step speed', 0.2, 4, 0.05, 1.2),
    nM('view', 'Figure seen from', ['Side', 'Front / Back'], 0),
    nN('swing', 'Leg swing', 5, 45, 1, 24, '°'),
    nN('bob', 'Body bounce', 0, 6, 0.1, 1.2, '%'),
    nN('lean', 'Forward lean', -15, 25, 0.5, 3, '°'),
    nT('flip', 'Figure faces left', 0),
    nN('skirt', 'Cloth sway', 0, 15, 0.5, 3, '°'),
    nN('neck', 'Neck line', 0, 60, 1, 21, '%'),
    nN('hip', 'Hip line', 20, 80, 1, 47, '%'),
    nN('hem', 'Cloth bottom line', 30, 95, 1, 76, '%'),
    nN('mid', 'Legs split at', 20, 80, 1, 50, '%')
  ], (A, v, ev) => {
    const b = fxBox(A, ev); if (b.bw < 4 || b.bh < 4) return;
    const amt = v('amt') / 100; if (amt <= 0.001) return;
    const ph = phaseOf(ev), side = Math.round(v('view')) === 0, T = fxCopy(A, 'fxt'); fxClear(A);
    const L = b.bx, R = b.bx + b.bw, Tp = b.by, Bt = b.by + b.bh, cx = b.cx;
    const yN = Tp + b.bh * v('neck') / 100, yH = Tp + b.bh * v('hip') / 100, yM = Math.max(yH + 1, Tp + b.bh * v('hem') / 100);
    const lean = v('lean') * (v('flip') ? -1 : 1) * D2R * amt, bob = Math.abs(Math.sin(ph)) * v('bob') / 100 * b.bh * amt;
    const seg = (x, y, w, h) => { if (w > 0 && h > 0) A.drawImage(T.canvas, x, y, w, h, x, y, w, h); };
    A.save(); A.translate(cx, Bt); A.rotate(lean); A.translate(-cx, -Bt - bob);
    const mx = L + b.bw * v('mid') / 100;
    [[L, mx, 1], [mx, R, -1]].forEach(([x0, x1, s]) => {
      A.save();
      const th = s * Math.sin(ph) * (side ? v('swing') : v('swing') * 0.12) * D2R * amt;
      const lift = Math.max(0, Math.sin(ph + (s > 0 ? PI : 0))) * b.bh * (side ? 0.012 : 0.03) * amt;
      A.translate(cx, yH - lift); A.rotate(th); A.translate(-cx, -yH); seg(x0, yM, x1 - x0, Bt - yM); A.restore();
    });
    A.save(); A.translate(cx, yH); A.rotate(Math.sin(ph) * v('skirt') * D2R * amt); A.translate(-cx, -yH); seg(L, yH, b.bw, yM - yH); A.restore();
    seg(L, Tp, b.bw, yH - Tp);
    A.restore();
  });

  /* ---------- 2. Head Yes / No ---------- */
  fxAdd('Character', 'cyesno', 'Head Yes / No', [
    nM('mode', 'Gesture', ['Yes (nod)', 'No (shake)'], 0),
    nN('amt', 'Amount', 0, 100, 1, 70, '%'),
    nN('reps', 'Repeats', 1, 10, 1, 3),
    nN('delay', 'Delay (s)', 0, 120, 0.1, 0),
    nN('dur', 'Duration (s)', 0.2, 10, 0.05, 1.2),
    nT('loop', 'Repeat forever', 0),
    nN('neck', 'Neck line', 5, 60, 1, 25, '%')
  ], (A, v, ev) => {
    const b = fxBox(A, ev); if (b.bw < 4 || b.bh < 4) return;
    let u = (ev.t - ((ev.o && ev.o.t0) || 0) - v('delay')) / Math.max(0.05, v('dur'));
    if (u < 0) return; if (v('loop')) u = u % 1; else if (u > 1) return;
    const w = Math.sin(TAU * v('reps') * u) * Math.sin(PI * u) * v('amt') / 100;
    const T = fxCopy(A, 'fxt'); fxClear(A);
    const yN = b.by + b.bh * v('neck') / 100, bh = b.by + b.bh - yN;
    A.drawImage(T.canvas, b.bx, yN, b.bw, bh, b.bx, yN, b.bw, bh);
    A.save(); A.translate(b.cx, yN);
    if (Math.round(v('mode')) === 0) { A.translate(0, w * b.bh * 0.02); A.scale(1, 1 - 0.07 * Math.max(0, w)); }
    else { A.translate(w * b.bw * 0.015, 0); A.rotate(w * 9 * D2R); A.scale(1 - 0.1 * Math.abs(w), 1); }
    A.drawImage(T.canvas, b.bx, b.by, b.bw, yN - b.by, b.bx - b.cx, b.by - yN, b.bw, yN - b.by);
    A.restore();
  });

  /* ---------- 3. Expression ---------- */
  fxAdd('Character', 'cexpr', 'Expression (Blink / Talk / Smile / Surprise)', [
    nM('type', 'Expression', ['Blink', 'Talk', 'Smile', 'Surprise'], 0),
    nN('amt', 'Amount', 0, 100, 1, 100, '%'),
    nN('speed', 'Speed', 0.2, 10, 0.1, 3),
    nN('ex', 'Eyes X', 0, 100, 0.5, 50, '%'), nN('ey', 'Eyes Y', 0, 100, 0.5, 38, '%'),
    nN('eg', 'Gap between eyes', 2, 80, 0.5, 24, '%'), nN('ew', 'Eye width', 1, 40, 0.5, 12, '%'), nN('eh', 'Eye height', 0.5, 20, 0.25, 5, '%'),
    nN('mx', 'Mouth X', 0, 100, 0.5, 50, '%'), nN('my', 'Mouth Y', 0, 100, 0.5, 58, '%'),
    nN('mw', 'Mouth width', 1, 60, 0.5, 16, '%'), nN('mh', 'Mouth height', 0.5, 30, 0.25, 6, '%'),
    nC('lip', 'Mouth colour', '#7a1f2b'),
    nT('auto', 'Take skin colour from image', 1), nC('skin', 'Skin colour (if not automatic)', '#c88c61')
  ], (A, v, ev) => {
    const b = fxBox(A, ev); if (b.bw < 4 || b.bh < 4) return;
    const amt = v('amt') / 100; if (amt <= 0.001) return;
    const X = p => b.bx + b.bw * p / 100, Y = p => b.by + b.bh * p / 100, W = p => b.bw * p / 100, Hh = p => b.bh * p / 100;
    const ty = Math.round(v('type')), t = ev.t, sp = v('speed');
    const ex = X(v('ex')), ey = Y(v('ey')), eg = W(v('eg')), ew = W(v('ew')), eh = Hh(v('eh')), mx = X(v('mx')), my = Y(v('my')), mw = W(v('mw')), mh = Hh(v('mh'));
    let skin = v('skin');
    if (v('auto')) { try { const px = A.getImageData(Math.max(0, Math.min(A.canvas.width - 1, Math.round(ex))), Math.max(0, Math.min(A.canvas.height - 1, Math.round(ey))), 1, 1).data; if (px[3] > 40) skin = 'rgb(' + px[0] + ',' + px[1] + ',' + px[2] + ')'; } catch (er) { } }
    const lip = v('lip'), dark = '#2b0a10';
    const cover = (cx, cy, rx, ry) => { A.fillStyle = skin; A.beginPath(); A.ellipse(cx, cy, rx, ry, 0, 0, TAU); A.fill(); };
    A.save();
    if (ty === 0) { // Blink
      const per = 3 / sp, ph = (t % per) / per, c = (ph < 0.09 ? Math.sin(PI * ph / 0.09) : 0) * amt;
      if (c > 0.02) [-1, 1].forEach(s => {
        const x = ex + s * eg / 2; A.fillStyle = skin; A.fillRect(x - ew / 2, ey - eh / 2, ew, eh * c * 1.05);
        A.strokeStyle = dark; A.lineWidth = Math.max(1, eh * 0.18); A.lineCap = 'round'; A.beginPath(); A.moveTo(x - ew / 2, ey - eh / 2 + eh * c); A.lineTo(x + ew / 2, ey - eh / 2 + eh * c); A.stroke();
      });
    } else if (ty === 1) { // Talk
      const o = c01((0.5 + 0.5 * Math.sin(t * sp * TAU)) * (0.65 + 0.35 * Math.sin(t * sp * TAU * 2.3 + 1))) * amt;
      cover(mx, my, mw * 0.58, mh * 0.62);
      const ry = Math.max(mh * 0.08, mh * 0.5 * o * 1.6), rx = mw * (0.34 + 0.16 * o);
      A.fillStyle = dark; A.beginPath(); A.ellipse(mx, my + ry * 0.3, rx, ry, 0, 0, TAU); A.fill();
      A.fillStyle = lip; A.beginPath(); A.ellipse(mx, my + ry * 0.75, rx * 0.62, ry * 0.45, 0, 0, TAU); A.fill();
    } else if (ty === 2) { // Smile
      cover(mx, my, mw * 0.62, mh * 0.8);
      const d = mh * (0.4 + 1.2 * amt);
      A.fillStyle = lip; A.beginPath(); A.moveTo(mx - mw / 2, my - mh * 0.15); A.quadraticCurveTo(mx, my + d * 1.6, mx + mw / 2, my - mh * 0.15); A.quadraticCurveTo(mx, my + mh * 0.05, mx - mw / 2, my - mh * 0.15); A.fill();
      A.fillStyle = '#fff'; A.beginPath(); A.moveTo(mx - mw * 0.38, my - mh * 0.05); A.quadraticCurveTo(mx, my + d * 0.9, mx + mw * 0.38, my - mh * 0.05); A.quadraticCurveTo(mx, my + mh * 0.02, mx - mw * 0.38, my - mh * 0.05); A.fill();
    } else { // Surprise
      const T = fxCopy(A, 'fxt'), z = 1 + 0.35 * amt;
      [-1, 1].forEach(s => {
        const x = ex + s * eg / 2, w2 = ew * 1.5, h2 = eh * 1.7;
        A.save(); A.beginPath(); A.ellipse(x, ey, w2 * z / 2, h2 * z / 2, 0, 0, TAU); A.clip(); A.translate(x, ey); A.scale(z, z); A.translate(-x, -ey);
        A.drawImage(T.canvas, x - w2 / 2, ey - h2 / 2, w2, h2, x - w2 / 2, ey - h2 / 2, w2, h2); A.restore();
      });
      cover(mx, my, mw * 0.58, mh * 0.62);
      A.fillStyle = dark; A.beginPath(); A.ellipse(mx, my + mh * 0.2, mw * 0.2, mh * 0.55 * amt + mh * 0.1, 0, 0, TAU); A.fill();
    }
    A.restore();
  });
})();
