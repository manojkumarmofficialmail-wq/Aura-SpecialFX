/* =========================================================
   Aura SpecialFX — canvas particle engine
   Used by the hero (sparks + fog) and the "Pick an effect" stage.
   Modes: hero, pyro, dryice, petals, handpyro, glitter, bubbles, foam, booth
   ========================================================= */
window.AuraFX = (function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const GOLD = '#E6C27A', WHITE_GOLD = '#FFF4DA';

  function Engine(canvas) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, parts = [], mode = null, t = 0, running = true, booth = 0;

    function size() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    size(); new ResizeObserver(size).observe(canvas);

    const spawn = {
      spark(x, y, o = {}) {
        const sp = o.speed || rand(7, 12), ang = o.ang ?? (-Math.PI / 2 + rand(-.12, .12));
        parts.push({ k: 'spark', x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: rand(40, 70), age: 0, c: Math.random() < .2 ? WHITE_GOLD : GOLD, s: rand(1, 2.2) });
      },
      fog(x, y) { parts.push({ k: 'fog', x, y, vx: rand(-.5, .5), vy: rand(-.15, -.02), life: rand(260, 420), age: 0, r: rand(50, 120) }); },
      petal(x, y) { parts.push({ k: 'petal', x, y, vx: rand(-.6, .6), vy: rand(.6, 1.5), life: 999, age: 0, rot: rand(0, 6.28), vr: rand(-.06, .06), s: rand(5, 9), c: ['#C9374B', '#E25A6B', '#E59AA5', '#B0263B'][Math.random() * 4 | 0], ph: rand(0, 6.28) }); },
      bubble(x, y) { parts.push({ k: 'bubble', x, y, vx: rand(-.4, .4), vy: rand(-1.6, -.6), life: rand(200, 380), age: 0, r: rand(6, 20), ph: rand(0, 6.28) }); },
      foam(x, y) { const a = rand(-Math.PI * .85, -Math.PI * .15), s = rand(4, 9); parts.push({ k: 'foam', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(160, 260), age: 0, r: rand(8, 22) }); },
      glitter(x, y) { parts.push({ k: 'glitter', x, y, vx: rand(-.5, .5), vy: rand(.8, 2), life: 999, age: 0, rot: rand(0, 6), vr: rand(-.2, .2), s: rand(2, 4), c: [GOLD, '#fff', '#D8A28F', '#FFF9E1'][Math.random() * 4 | 0] }); },
    };

    const modes = {
      hero() {
        const xs = W < 900 ? [W * .3, W * .75] : [W * .6, W * .75, W * .9];
        for (const x of xs) for (let j = 0; j < (W < 600 ? 2 : 3); j++) spawn.spark(x + rand(-4, 4), H, { speed: rand(H / 90, H / 60) });
        if (t % 5 === 0) spawn.fog(rand(0, W), H + 20);
      },
      pyro() { for (const x of [W * .28, W * .72]) for (let j = 0; j < 4; j++) spawn.spark(x + rand(-3, 3), H * .88, { speed: rand(H / 70, H / 48) }); },
      dryice() { if (t % 2 === 0) { spawn.fog(rand(-40, W * .15), H * .8 + rand(0, 40)); spawn.fog(rand(W * .85, W + 40), H * .8 + rand(0, 40)); } if (t % 4 === 0) spawn.fog(rand(0, W), H * .92); },
      petals() { if (t % 3 === 0) spawn.petal(rand(0, W), -10); },
      bubbles() { if (t % 4 === 0) spawn.bubble(rand(W * .1, W * .9), H + 20); },
      foam() { for (let i = 0; i < 2; i++) spawn.foam(W * .5 + rand(-6, 6), H * .72); },
      glitter() { for (let i = 0; i < 3; i++) spawn.glitter(rand(W * .15, W * .85), -6); },
      handpyro() { const x = W * .5 + Math.sin(t / 30) * W * .25, y = H * .55 + Math.cos(t / 22) * H * .12; for (let i = 0; i < 4; i++) spawn.spark(x, y, { speed: rand(1, 4), ang: rand(0, 6.28) }); },
      booth() { booth += .035; }
    };

    function burst(x, y) {
      if (mode === 'petals') { for (let i = 0; i < 30; i++) spawn.petal(x + rand(-40, 40), y + rand(-40, 40)); return; }
      if (mode === 'bubbles') { for (let i = 0; i < 14; i++) spawn.bubble(x + rand(-30, 30), y + rand(-30, 30)); return; }
      if (mode === 'dryice') { for (let i = 0; i < 10; i++) spawn.fog(x + rand(-60, 60), y); return; }
      if (mode === 'foam') { for (let i = 0; i < 30; i++) spawn.foam(x, y); return; }
      if (mode === 'glitter') { for (let i = 0; i < 60; i++) { spawn.glitter(x, y); const p = parts[parts.length - 1]; p.vx = rand(-4, 4); p.vy = rand(-5, 1); } return; }
      for (let i = 0; i < 70; i++) spawn.spark(x, y, { speed: rand(1.5, 7), ang: rand(0, 6.28) });
    }

    function drawBooth() {
      const cx = W / 2, cy = H * .62, rx = Math.min(W * .32, 220), ry = rx * .28;
      ctx.save();
      ctx.strokeStyle = 'rgba(230,194,122,.35)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(cx, cy + 40, rx, ry, 0, 0, 6.28); ctx.stroke();
      const g = ctx.createRadialGradient(cx, cy + 40, 4, cx, cy + 40, rx);
      g.addColorStop(0, 'rgba(230,194,122,.3)'); g.addColorStop(1, 'rgba(230,194,122,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy + 40, rx, ry, 0, 0, 6.28); ctx.fill();
      ctx.fillStyle = '#0A0D06';
      ctx.beginPath(); ctx.ellipse(cx - 18, cy - 30, 13, 46, 0, 0, 6.28); ctx.ellipse(cx + 18, cy - 26, 13, 42, 0, 0, 6.28); ctx.fill();
      ctx.beginPath(); ctx.arc(cx - 18, cy - 88, 12, 0, 6.28); ctx.arc(cx + 18, cy - 80, 11, 0, 6.28); ctx.fill();
      for (let i = 0; i < 40; i++) {
        const a = booth - i * .04, x = cx + Math.cos(a) * rx, y = cy + 40 + Math.sin(a) * ry - 60;
        ctx.fillStyle = `rgba(230,194,122,${(1 - i / 40) * .8})`;
        ctx.beginPath(); ctx.arc(x, y, 4 * (1 - i / 40) + 1, 0, 6.28); ctx.fill();
      }
      const ax = cx + Math.cos(booth) * rx, ay = cy + 40 + Math.sin(booth) * ry - 60;
      ctx.shadowColor = '#fff'; ctx.shadowBlur = 20; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(ax, ay, 6, 0, 6.28); ctx.fill();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      if (mode === 'booth') drawBooth();
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]; p.age++;
        switch (p.k) {
          case 'spark': { p.vy += .22; p.vx *= .99; p.x += p.vx; p.y += p.vy; ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = p.c; ctx.globalAlpha = Math.max(1 - p.age / p.life, 0); ctx.lineWidth = p.s; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2); ctx.stroke(); break; }
          case 'fog': { p.x += p.vx; p.y += p.vy; p.r += .25; const a = Math.sin(Math.PI * p.age / p.life) * .16; const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r); g.addColorStop(0, `rgba(244,240,226,${a})`); g.addColorStop(1, 'rgba(244,240,226,0)'); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); break; }
          case 'petal': { p.ph += .03; p.x += p.vx + Math.sin(p.ph) * .8; p.y += p.vy; p.rot += p.vr; if (p.y > H + 20) p.age = p.life; ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = .95; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.abs(Math.sin(p.ph * 1.5)) * .6 + .4); ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * .65, 0, 0, 6.28); ctx.fill(); ctx.restore(); break; }
          case 'bubble': { p.ph += .04; p.x += p.vx + Math.sin(p.ph) * .5; p.y += p.vy; ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = Math.min(1, (p.life - p.age) / 30) * .8; ctx.strokeStyle = `hsl(${(p.ph * 40) % 360},80%,85%)`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(p.x - p.r * .35, p.y - p.r * .35, p.r * .18, 0, 6.28); ctx.fill(); break; }
          case 'foam': { p.vy += .12; p.vx *= .98; p.x += p.vx; p.y += p.vy; if (p.y > H * .95) { p.y = H * .95; p.vy = 0; p.vx *= .8; } ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = Math.min(1, (p.life - p.age) / 40) * .85; ctx.fillStyle = '#F7F8FF'; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill(); break; }
          case 'glitter': { p.vy = Math.min(p.vy + .05, 2.2); p.vx *= .97; p.x += p.vx; p.y += p.vy; p.rot += p.vr; if (p.y > H + 10) p.age = p.life; ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .5 + .5 * Math.abs(Math.sin(p.rot * 3)); ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore(); break; }
        }
        if (p.age >= p.life) parts.splice(i, 1);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }

    function loop() {
      if (running) { t++; if (mode && modes[mode] && parts.length < 1600) modes[mode](); draw(); }
      requestAnimationFrame(loop);
    }

    if (reduce) {
      // Reduced motion: render one settled still frame per mode.
      return {
        set(m) { mode = m; parts = []; t = 0; for (let i = 0; i < 90; i++) { t++; modes[m] && modes[m](); parts.forEach(p => p.age++); } for (let i = 0; i < 40; i++) draw(); },
        burst() {}, pause() {}, play() {}
      };
    }
    requestAnimationFrame(loop);
    return {
      set(m) { mode = m; parts = parts.filter(p => p.k === 'fog' && m === 'dryice'); },
      burst, pause() { running = false; }, play() { running = true; }
    };
  }

  return { Engine };
})();
