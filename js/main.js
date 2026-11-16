/* =========================================================
   Aura SpecialFX — page logic
   ========================================================= */
(function () {
  const WHATSAPP = '918078899332';

  /* ---------- EFFECTS (stage list + enquiry chips) ---------- */
  const FX = [
    { id: 'pyro', name: 'Cold pyro', sub: 'Spark fountains', desc: 'Tall, cool-to-touch spark fountains that are safe for indoor halls. The signature backdrop for an entry or the first kiss.', best: ['Entries', 'First dance', 'Stage reveals'] },
    { id: 'dryice', name: 'Dry ice', sub: 'Low cloud', desc: 'A dense, low-lying cloud that rolls across the floor so you walk in on air. Stays low and clean, so it never blocks the camera.', best: ['Couple entry', 'First dance', 'Photoshoots'] },
    { id: 'petals', name: 'Rose petals', sub: 'Petal shower', desc: 'A soft shower of real rose petals released over the couple. Works beautifully at open-air and beach venues.', best: ['Beach receptions', 'Varmala', 'Exit moments'] },
    { id: 'handpyro', name: 'Hand pyro', sub: 'Handheld sparks', desc: "Handheld spark sticks carried by our crew to trace the couple's walk, guided right next to the action.", best: ['Walkways', 'Baraat', 'Night shoots'] },
    { id: 'glitter', name: 'Glitter shower', sub: 'Confetti burst', desc: 'A shimmering burst of glitter and sparkle timed to the beat drop. Picks up every stage light in the room.', best: ['Receptions', 'Cake cutting', 'Birthdays'] },
    { id: 'bubbles', name: 'Bubbles', sub: 'Bubble machines', desc: 'Clouds of floating bubbles that drift over guests. Gentle, playful and loved by kids and photographers alike.', best: ['Haldi', "Kids' parties", 'Garden events'] },
    { id: 'foam', name: 'Foam party', sub: 'With DJ & lights', desc: 'Foam cannons with DJ, lights and sound. Turns a haldi or pool party into the highlight of the wedding week.', best: ['Haldi', 'Pool parties', 'College fests'] },
    { id: 'booth', name: '360° booth', sub: 'Video booth', desc: 'Guests step on the platform while the camera orbits them, then walk away with a slow-motion clip ready to post.', best: ['Weddings', 'Birthdays', 'Corporate events'] }
  ];

  /* ---------- GALLERY ----------
     img:   file in assets/images/
     video: optional file in assets/videos/ (plays in the viewer if present)
     cat:   must match a FILTERS key                                        */
  const FILTERS = { all: 'All', entries: 'Entries', pyro: 'Pyro & sparkle', dryice: 'Dry ice', petals: 'Rose petals', foam: 'Foam party', booth: '360° booth' };
  const GALLERY = [
    { img: 'grand-entry.jpg',            video: 'grand-entry.mp4',            cat: 'entries', cap: 'A grand entry wrapped in magic' },
    { img: 'dry-ice-clouds.jpg',         video: 'dry-ice-clouds.mp4',         cat: 'dryice',  cap: 'Walking on clouds' },
    { img: 'beach-rose-shower.jpg',      video: 'beach-rose-shower.mp4',      cat: 'petals',  cap: 'Rose shower at a beach reception' },
    { img: 'cold-pyro.jpg',                                                   cat: 'pyro',    cap: 'Love with a spark' },
    { img: 'booth-360.jpg',              video: 'booth-360.mp4',              cat: 'booth',   cap: 'The 360° video booth' },
    { img: 'foam-party-kerala.jpg',      video: 'foam-party-kerala.mp4',      cat: 'foam',    cap: 'Foam party, anywhere in Kerala' },
    { img: 'glitter-shower.jpg',         video: 'glitter-shower.mp4',         cat: 'pyro',    cap: 'A beginning under a glittering shower' },
    { img: 'rose-petals-couple.jpg',                                          cat: 'petals',  cap: 'Showered in love and rose petals' },
    { img: 'bubbles-dryice-glitter.jpg', video: 'bubbles-dryice-glitter.mp4', cat: 'dryice',  cap: 'Smoke, sparkle and bubbles together' },
    { img: 'wedding-entry-magical.jpg',  video: 'wedding-entry-magical.mp4',  cat: 'entries', cap: 'A magical walk-in' },
    { img: 'foam-dj-lights.jpg',         video: 'foam-dj-lights.mp4',         cat: 'foam',    cap: 'Foam with DJ, lights and sound' },
    { img: 'dry-ice-entry.jpg',          video: 'dry-ice-entry.mp4',          cat: 'dryice',  cap: 'Dry ice reception entry' },
    { img: 'petal-shower.jpg',           video: 'petal-shower.mp4',           cat: 'petals',  cap: 'Turning up the vibe with petals' },
    { img: 'foam-haldi.jpg',             video: 'foam-haldi.mp4',             cat: 'foam',    cap: 'Haldi vibes' },
    { img: 'wedding-entry-1.jpg',        video: 'wedding-entry-1.mp4',        cat: 'entries', cap: 'Wedding entry' },
    { img: 'dry-ice-effect.jpg',                                              cat: 'dryice',  cap: 'Dry ice effect' },
    { img: 'aura-magic.jpg',             video: 'aura-magic.mp4',             cat: 'entries', cap: 'Bringing magic to every moment' },
    { img: 'foam-madhuramvepp.jpg',      video: 'foam-madhuramvepp.mp4',      cat: 'foam',    cap: 'Madhuramvepp foam party' }
  ];

  /* ---------- hero ---------- */
  const heroC = document.getElementById('heroCanvas');
  const hero = AuraFX.Engine(heroC);
  hero.set('hero');
  heroC.addEventListener('pointerdown', e => { const r = heroC.getBoundingClientRect(); hero.burst(e.clientX - r.left, e.clientY - r.top); });
  // hide hero video element if the file isn't there yet (poster still shows via CSS fallback)

  /* ---------- effects stage ---------- */
  const list = document.getElementById('fxList');
  const stageC = document.getElementById('stageCanvas');
  const stage = AuraFX.Engine(stageC);
  const tEl = document.getElementById('fxTitle'), dEl = document.getElementById('fxDesc'), bEl = document.getElementById('fxBest');

  function select(i, focus) {
    const f = FX[i];
    [...list.querySelectorAll('button')].forEach((b, j) => { b.setAttribute('aria-selected', j === i); b.tabIndex = j === i ? 0 : -1; });
    if (focus) list.querySelectorAll('button')[i].focus();
    stage.set(f.id);
    tEl.textContent = f.name; dEl.textContent = f.desc;
    bEl.innerHTML = ''; f.best.forEach(x => { const s = document.createElement('span'); s.textContent = x; bEl.appendChild(s); });
  }
  FX.forEach((f, i) => {
    const li = document.createElement('li'), b = document.createElement('button');
    b.setAttribute('role', 'tab'); b.innerHTML = `${f.name}<small>${f.sub}</small>`;
    b.addEventListener('click', () => select(i));
    b.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % FX.length, true); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + FX.length) % FX.length, true); }
    });
    li.appendChild(b); list.appendChild(li);
  });
  select(0);
  document.getElementById('stage').addEventListener('pointerdown', e => { const r = stageC.getBoundingClientRect(); stage.burst(e.clientX - r.left, e.clientY - r.top); });

  // pause canvases while off-screen
  const io = new IntersectionObserver(es => es.forEach(en => { const eng = en.target === heroC ? hero : stage; en.isIntersecting ? eng.play() : eng.pause(); }));
  io.observe(heroC); io.observe(stageC);

  /* ---------- gallery ---------- */
  const grid = document.getElementById('grid'), filters = document.getElementById('filters');
  let visible = [];

  Object.entries(FILTERS).forEach(([key, label], i) => {
    const b = document.createElement('button');
    b.textContent = label; b.setAttribute('aria-pressed', i === 0);
    b.addEventListener('click', () => {
      filters.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
      grid.querySelectorAll('.tile').forEach(t => { t.hidden = key !== 'all' && t.dataset.cat !== key; });
    });
    filters.appendChild(b);
  });

  GALLERY.forEach((g, i) => {
    const tile = document.createElement('button');
    tile.className = 'tile'; tile.dataset.cat = g.cat; tile.dataset.i = i;
    tile.setAttribute('aria-label', g.cap + (g.video ? ' (video)' : ''));
    tile.innerHTML = `<figure><img src="assets/images/${g.img}" alt="${g.cap}" loading="lazy"><figcaption>${g.cap}</figcaption></figure>${g.video ? '<span class="play" aria-hidden="true"></span>' : ''}`;
    tile.querySelector('img').addEventListener('error', () => tile.classList.add('missing'));
    tile.addEventListener('click', () => openLb(i));
    grid.appendChild(tile);
  });

  /* ---------- lightbox ---------- */
  const lb = document.getElementById('lightbox'), lbMedia = document.getElementById('lbMedia'), lbCap = document.getElementById('lbCap');
  let cur = 0, lastFocus = null;

  function show(i) {
    visible = [...grid.querySelectorAll('.tile:not([hidden])')].map(t => +t.dataset.i);
    cur = i; const g = GALLERY[i];
    lbMedia.innerHTML = ''; lbCap.textContent = g.cap;
    const img = () => { lbMedia.innerHTML = `<img src="assets/images/${g.img}" alt="${g.cap}">`; };
    if (g.video) {
      const v = document.createElement('video');
      v.src = 'assets/videos/' + g.video; v.controls = true; v.autoplay = true; v.playsInline = true; v.poster = 'assets/images/' + g.img;
      v.addEventListener('error', img); // no video file yet -> show photo
      lbMedia.appendChild(v);
    } else img();
  }
  function openLb(i) { lastFocus = document.activeElement; show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; document.getElementById('lbClose').focus(); }
  function closeLb() { lb.classList.remove('open'); lbMedia.innerHTML = ''; document.body.style.overflow = ''; lastFocus && lastFocus.focus(); }
  function step(d) { const k = visible.indexOf(cur); show(visible[(k + d + visible.length) % visible.length]); }
  document.getElementById('lbClose').onclick = closeLb;
  document.getElementById('lbPrev').onclick = () => step(-1);
  document.getElementById('lbNext').onclick = () => step(1);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });


  /* ---------- showreel ---------- */
  const reel = document.getElementById('reel'), soundBtn = document.getElementById('soundBtn');
  // muted preview plays only while on screen
  new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) reel.play().catch(() => {}); else reel.pause(); }), { threshold: .35 }).observe(reel);
  soundBtn.addEventListener('click', () => {
    if (reel.muted) { reel.muted = false; reel.currentTime = 0; reel.play(); soundBtn.textContent = 'Mute'; }
    else { reel.muted = true; soundBtn.textContent = 'Play with sound'; }
  });

  /* ---------- marquee ---------- */
  const mq = document.getElementById('marquee');
  const words = ['Cold pyro', 'Dry ice', 'Rose petals', 'Foam party', '360° booth', 'Hand pyro', 'Glitter shower', 'Bubbles'];
  const run = words.map(w => `<span>${w}</span><img src="assets/brand/aura-mark-gold.png" alt="">`).join('');
  mq.innerHTML = run + run;

  /* ---------- nav ---------- */
  const nav = document.getElementById('nav'), burger = document.getElementById('burger');
  addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40), { passive: true });
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

  /* ---------- enquiry form -> WhatsApp ---------- */
  const chips = document.getElementById('chips');
  FX.forEach((f, i) => chips.insertAdjacentHTML('beforeend', `<input type="checkbox" id="c${i}" value="${f.name}"><label for="c${i}">${f.name}</label>`));
  document.querySelectorAll('[data-pkg]').forEach(a => a.addEventListener('click', () => { document.getElementById('pkg').value = a.dataset.pkg; }));

  document.getElementById('enqForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    const note = document.getElementById('formNote');
    if (!v('name') || !v('date')) {
      note.textContent = 'Add your name and event date so we can check availability.';
      note.style.color = 'var(--rose-gold)';
      document.getElementById(v('name') ? 'date' : 'name').focus();
      return;
    }
    const fx = [...chips.querySelectorAll('input:checked')].map(c => c.value).join(', ') || 'Not sure yet';
    const msg = `Hi Aura SpecialFX! ✨\n\nName: ${v('name')}\nDate: ${v('date')}\nOccasion: ${v('type')}\nVenue: ${v('venue') || '-'}\nEffects: ${fx}\nPackage: ${v('pkg')}${v('notes') ? '\n\nNotes: ' + v('notes') : ''}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    note.style.color = ''; note.textContent = 'WhatsApp opened with your details. Press send there to reach us.';
  });

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
