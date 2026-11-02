/* ================================================================
   ORF 309 · Midterm Studio — animated figures
   A tiny scene engine on SVG (shapes) + HTML overlay (KaTeX labels).
   Each figure = { scenes: [{caption, run}], params?, reset }.
   Figures autoplay once when scrolled into view; Play / Next / Replay.
   ================================================================ */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const C = { blue: '#58c4dd', yellow: '#f0d35c', red: '#fc6255', green: '#83c167', grey: '#8a919c', white: '#ececec', dim: '#2b303a', dim2: '#3a4050', teal: '#5cd0b3', purple: '#b08ad0', orange: '#f5a25d' };
  const reg = {};

  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function setA(n, attrs) { for (const k in attrs) n.setAttribute(k, attrs[k]); }
  const easeIO = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const lerp = (a, b, t) => a + (b - a) * t;
  const fmt = (x, d = 3) => (Math.round(x * 10 ** d) / 10 ** d).toString();
  const rnd = () => Math.random();

  function makeCtx(stage, W, H) {
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' }, stage);
    const labels = document.createElement('div'); labels.className = 'fig-labels'; stage.appendChild(labels);
    const ctx = { svg, labels, W, H, gen: 0, speed: 1, rate: 1, paused: false, clock: 0, labelMap: {} };
    ctx.alive = g => stage.isConnected && g === ctx.gen;
    /* Virtual clock: advances with real time while playing, stands still while paused,
       and can be nudged forward by ctx.step(ms) for frame-by-frame viewing. */
    let last = performance.now();
    (function tick(now) {
      const dt = Math.min(50, now - last); last = now;
      if (!ctx.paused) ctx.clock += dt * ctx.rate;
      if (stage.isConnected || ctx.gen === 0) requestAnimationFrame(tick);
    })(last);
    ctx.step = ms => { ctx.clock += ms; };
    ctx.tween = (dur, fn) => new Promise(res => {
      const g = ctx.gen; const d = Math.max(1, dur * ctx.speed); const t0 = ctx.clock;
      function frame() {
        if (!ctx.alive(g)) return res(false);
        const t = Math.min(1, (ctx.clock - t0) / d); fn(easeIO(t), t);
        if (t < 1) requestAnimationFrame(frame); else res(true);
      }
      frame();
    });
    ctx.wait = ms => new Promise(res => {
      const g = ctx.gen; const t0 = ctx.clock; const d = ms * ctx.speed;
      function frame() { if (!ctx.alive(g)) return res(false); if (ctx.clock - t0 >= d) return res(true); requestAnimationFrame(frame); }
      frame();
    });
    ctx.anim = (node, from, to, dur) => ctx.tween(dur, t => { const a = {}; for (const k in to) a[k] = lerp(from[k], to[k], t); setA(node, a); });
    ctx.fade = (node, from, to, dur) => ctx.tween(dur, t => node.setAttribute('opacity', lerp(from, to, t)));
    ctx.clear = () => { svg.innerHTML = ''; labels.innerHTML = ''; ctx.labelMap = {}; };
    ctx.label = (id, html, x, y, o = {}) => {
      let d = ctx.labelMap[id];
      if (!d) { d = document.createElement('div'); d.className = 'lbl'; labels.appendChild(d); ctx.labelMap[id] = d; }
      d.className = 'lbl ' + (o.align || '') + (o.show === false ? '' : ' show');
      d.innerHTML = html;
      d.style.left = (x / W * 100) + '%'; d.style.top = (y / H * 100) + '%';
      d.style.color = o.color || C.white; d.style.fontSize = (o.size || 14) + 'em';
      if (ORF309.renderMath) ORF309.renderMath(d);
      return d;
    };
    ctx.show = (id, on = true) => { const d = ctx.labelMap[id]; if (d) d.classList.toggle('show', on); };
    ctx.moveLabel = (id, x, y) => { const d = ctx.labelMap[id]; if (d) { d.style.left = (x / W * 100) + '%'; d.style.top = (y / H * 100) + '%'; } };
    ctx.text = (id, html) => { const d = ctx.labelMap[id]; if (d) { d.innerHTML = html; if (ORF309.renderMath) ORF309.renderMath(d); } };
    return ctx;
  }

  /* ---------------- mounting & playback ---------------- */
  function mount(host, name, opts) {
    const factory = reg[name];
    if (!factory) { host.innerHTML = `<div class="fig-caption">Figure “${name}” not found.</div>`; return; }
    host.innerHTML = `<div class="fig-stage"></div>
      <div class="fig-bar">
        <button data-a="play" title="Play all scenes / pause">Play</button>
        <button data-a="frame" title="Advance a fraction of a second while paused">Frame ›</button>
        <button data-a="next" title="Play the next scene, then stop">Scene ›</button>
        <button data-a="replay" title="Start over">Replay</button>
        <select data-a="rate" title="Playback speed"><option value="1">1×</option><option value="0.5">½×</option><option value="0.25">¼×</option></select>
        <span class="fig-step"></span>
        <div class="fig-caption"></div>
      </div>
      <div class="fig-params"></div>`;
    const stage = host.querySelector('.fig-stage');
    const W = opts.W || 640, H = opts.H || 360;
    const ctx = makeCtx(stage, W, H);
    const setScale = () => stage.style.setProperty('--figscale', (stage.clientWidth / W).toFixed(4));
    setScale();
    if ('ResizeObserver' in window) new ResizeObserver(setScale).observe(stage);
    const fig = factory(ctx, opts);
    const cap = host.querySelector('.fig-caption'); const stepLbl = host.querySelector('.fig-step');
    const btn = a => host.querySelector(`[data-a="${a}"]`);
    let i = 0, busy = false, played = false;
    const total = fig.scenes.length;

    function setCaption(s) { cap.innerHTML = s || ''; if (ORF309.renderMath) ORF309.renderMath(cap); }
    function updateUI() {
      stepLbl.textContent = `scene ${Math.min(i + (busy ? 1 : 0), total)} / ${total}`;
      const atEnd = !busy && i >= total;
      btn('play').textContent = busy ? (ctx.paused ? 'Resume' : 'Pause') : 'Play';
      btn('play').disabled = atEnd;
      btn('next').disabled = busy || atEnd;
      btn('frame').disabled = atEnd;
    }
    async function runScene(k) {
      const sc = fig.scenes[k]; setCaption(sc.caption);
      await sc.run();
    }
    async function playFrom(k, all) {
      if (busy) return; busy = true; updateUI();
      const g = ctx.gen;
      for (; i < total; ) {
        await runScene(i); if (!ctx.alive(g)) break;
        i++; updateUI();
        if (!all) break;
        if (!(await ctx.wait(900))) break;
      }
      busy = false; ctx.paused = false; updateUI();
    }
    function reset() { ctx.gen++; busy = false; ctx.paused = false; i = 0; ctx.clear(); fig.reset(); setCaption(''); updateUI(); }
    btn('play').addEventListener('click', () => {
      if (busy) { ctx.paused = !ctx.paused; updateUI(); }
      else { ctx.paused = false; playFrom(i, true); }
    });
    btn('next').addEventListener('click', () => { ctx.paused = false; playFrom(i, false); });
    btn('frame').addEventListener('click', () => {
      // Frame-by-frame: freeze the clock and nudge it forward a little on every click.
      if (!busy) { ctx.paused = true; playFrom(i, true); }
      ctx.paused = true; ctx.step(90); updateUI();
    });
    btn('replay').addEventListener('click', () => { reset(); setTimeout(() => playFrom(0, true), 30); });
    host.querySelector('[data-a="rate"]').addEventListener('change', e => { ctx.rate = parseFloat(e.target.value); });

    if (fig.params && fig.params.length) {
      const pbox = host.querySelector('.fig-params');
      fig.params.forEach(p => {
        const wrap = document.createElement('label'); wrap.innerHTML = `<span>${p.label}</span> <input type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.value}"> <span class="val">${fmt(p.value, 2)}</span>`;
        pbox.appendChild(wrap);
        if (ORF309.renderMath) ORF309.renderMath(wrap);
        const inp = wrap.querySelector('input'); const val = wrap.querySelector('.val');
        inp.addEventListener('input', async () => {
          const v = parseFloat(inp.value); val.textContent = fmt(v, 2); p.onChange(v);
          // re-run everything instantly to the current scene
          ctx.gen++; busy = false; ctx.clear(); fig.reset(); ctx.speed = 0.001;
          const target = i; i = 0; const g = ctx.gen;
          for (let k = 0; k < target && ctx.alive(g); k++) { await runScene(k); i = k + 1; }
          ctx.speed = 1; updateUI();
        });
      });
    }
    reset();
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting && !played) { played = true; io.disconnect(); playFrom(0, true); } }); }, { threshold: 0.45 });
      io.observe(host);
    } else playFrom(0, true);
  }

  /* ================================================================
     FIGURE: area — law of total probability / Bayes as areas
     opts: cases [{name, prob, cond, label, condLabel}], event, eventName, bayes (index|undefined), slider {label,min,max,value,apply}
     ================================================================ */
  reg.area = function (ctx, o) {
    const cases = o.cases.map(c => ({ ...c }));
    const ev = o.eventName || 'H_1';
    const X0 = 70, Y0 = 34, SW = 330, SH = 250, BX = 500, BW = 70;
    let cols = [], shades = [], bar = [], frame;
    const ynum = h => Y0 + SH - h * SH;
    function totals() { return cases.reduce((s, c) => s + c.prob * c.cond, 0); }
    function reset() {
      frame = el('rect', { x: X0, y: Y0, width: SW, height: SH, fill: 'none', stroke: C.grey, 'stroke-width': 1, opacity: 0 }, ctx.svg);
      cols = []; shades = []; bar = [];
      let x = X0;
      cases.forEach((c, i) => {
        const w = c.prob * SW;
        cols.push(el('rect', { x, y: Y0, width: 0, height: SH, fill: C.dim, stroke: C.grey, 'stroke-width': 1 }, ctx.svg));
        shades.push(el('rect', { x, y: Y0 + SH, width: w, height: 0, fill: C.blue, opacity: 0.85 }, ctx.svg));
        c._x = x; c._w = w; x += w;
      });
    }
    const scenes = [
      {
        caption: o.cap1 || R`Split the sample space by the case we know things about. Column widths are the case probabilities.`,
        run: async () => {
          await ctx.fade(frame, 0, 1, 300);
          for (let i = 0; i < cases.length; i++) {
            const c = cases[i];
            await ctx.anim(cols[i], { width: 0 }, { width: c._w }, 450);
            ctx.label('c' + i, `\\(${c.name}\\)`, c._x + c._w / 2, Y0 - 16, { color: C.white, size: 15 });
            ctx.label('p' + i, `\\(\\P\\{${c.name}\\} = ${c.label}\\)`, c._x + c._w / 2, Y0 + SH + 18, { color: C.grey, size: 13 });
          }
        }
      },
      {
        caption: o.cap2 || R`Within each case, the event has a known conditional probability: shade that fraction of each column. Shaded area \(=\P\{${ev}\cap\text{case}\}\).`,
        run: async () => {
          for (let i = 0; i < cases.length; i++) {
            const c = cases[i]; const h = c.cond * SH;
            await ctx.anim(shades[i], { y: Y0 + SH, height: 0 }, { y: Y0 + SH - h, height: h }, 500);
            ctx.label('q' + i, `\\(\\P\\{${ev}\\given ${c.name}\\} = ${c.condLabel}\\)`, c._x + c._w / 2, Y0 + SH - h - 12, { color: C.blue, size: 13 });
          }
        }
      },
      {
        caption: o.cap3 || R`The law of total probability is just “add up the shaded areas”: \(\P\{${ev}\} = \sum_i \P\{${ev}\given \text{case}_i\}\,\P\{\text{case}_i\}\).`,
        run: async () => {
          // copy shades to a stacked bar on the right
          let yTop = ynum(0);
          bar = cases.map((c, i) => {
            const areaH = c.prob * c.cond * SH; // area in units of full square = prob*cond, bar height ∝ that
            const r = el('rect', { x: c._x, y: Y0 + SH - c.cond * SH, width: c._w, height: c.cond * SH, fill: C.blue, opacity: 0.85 }, ctx.svg);
            const from = { x: c._x, y: Y0 + SH - c.cond * SH, width: c._w, height: c.cond * SH };
            const to = { x: BX, y: yTop - areaH, width: BW, height: areaH };
            yTop -= areaH;
            return { r, from, to };
          });
          el('rect', { x: BX, y: Y0, width: BW, height: SH, fill: 'none', stroke: C.grey, 'stroke-dasharray': '3 3', opacity: 0.6 }, ctx.svg);
          ctx.label('one', '1', BX + BW + 12, Y0, { color: C.grey, size: 12, align: 'left' });
          ctx.label('zero', '0', BX + BW + 12, Y0 + SH, { color: C.grey, size: 12, align: 'left' });
          await ctx.tween(900, t => bar.forEach(b => { const a = {}; for (const k in b.to) a[k] = lerp(b.from[k], b.to[k], t); setA(b.r, a); }));
          const T = totals();
          ctx.label('tot', `\\(\\P\\{${ev}\\} = ${o.totalLabel || fmt(T)}\\)`, BX + BW / 2, Y0 + SH - T * SH - 16, { color: C.yellow, size: 14 });
          ctx.label('totnum', `\\(= ${fmt(T)}\\)`, BX + BW / 2, Y0 + SH + 18, { color: C.grey, size: 13, show: !!o.totalLabel });
        }
      }
    ];
    if (typeof o.bayes === 'number') {
      const b = o.bayes;
      scenes.push({
        caption: o.cap4 || R`Bayes: condition on \(${ev}\) by keeping only the shaded area. The answer \(\P\{${cases[b].name}\given ${ev}\}\) is the fraction of it that comes from the \(${cases[b].name}\) column.`,
        run: async () => {
          await ctx.tween(500, t => { cols.forEach(c => c.setAttribute('opacity', 1 - 0.7 * t)); frame.setAttribute('opacity', 1 - 0.6 * t); });
          bar.forEach((x, i) => x.r.setAttribute('fill', i === b ? C.yellow : C.blue));
          shades.forEach((s, i) => s.setAttribute('fill', i === b ? C.yellow : C.blue));
          const T = totals(); const part = cases[b].prob * cases[b].cond;
          await ctx.tween(500, t => bar.forEach((x, i) => x.r.setAttribute('opacity', i === b ? 1 : 0.85 - 0.5 * t)));
          ctx.label('bay', `\\(\\P\\{${cases[b].name}\\given ${ev}\\} = \\dfrac{${fmt(part)}}{${fmt(T)}} = ${fmt(part / T)}\\)`, BX + BW / 2, Y0 + SH + 40, { color: C.yellow, size: 14 });
          ctx.show('totnum', false);
        }
      });
    }
    const params = [];
    if (o.slider) {
      params.push({ label: o.slider.label, min: o.slider.min, max: o.slider.max, step: o.slider.step || 0.01, value: o.slider.value,
        onChange: v => {
          const sets = o.slider.sets || [];
          sets.forEach(([i, field]) => { cases[i][field] = v; });
          if (sets.some(([, f]) => f === 'prob')) {   // keep the case probabilities summing to 1
            const fixed = new Set(sets.filter(([, f]) => f === 'prob').map(([i]) => i));
            const rest = cases.map((c, i) => i).filter(i => !fixed.has(i));
            const left = 1 - [...fixed].reduce((s, i) => s + cases[i].prob, 0);
            const restTot = rest.reduce((s, i) => s + cases[i].prob, 0) || 1;
            rest.forEach(i => { cases[i].prob = left * cases[i].prob / restTot; });
            cases.forEach((c, i) => { if (!fixed.has(i)) c.label = fmt(c.prob, 2); else c.label = fmt(v, 2); });
          }
        } });
    }
    return { scenes, params, reset };
  };

  /* ================================================================
     FIGURE: timeline — Bernoulli process, conditioning on T1 = 4
     opts: n, p, fixed (array of 0/1 for the first days), caption overrides
     ================================================================ */
  reg.timeline = function (ctx, o) {
    const n = o.n || 10, p = o.p || 0.35, fixed = o.fixed || [0, 0, 0, 1];
    const X0 = 60, DX = (ctx.W - 120) / (n - 1), Y = 140, RAD = 16;
    let dots = [], vals = [];
    function colorOf(v) { return v ? C.red : C.green; }
    function reset() { dots = []; vals = []; }
    function sample(i) { return rnd() < p ? 1 : 0; }
    function setDot(i, v, instant) { vals[i] = v; dots[i].setAttribute('fill', colorOf(v)); ctx.text('d' + i, v ? 'late' : 'on time'); const l = ctx.labelMap['d' + i]; if (l) l.style.color = colorOf(v); }
    function countFrom(k) { let s = 0; for (let i = k; i < n; i++) s += vals[i]; return s; }
    const scenes = [
      {
        caption: R`Each day is an independent trial: late with probability \(p\), on time with probability \(q = 1 - p\).`,
        run: async () => {
          for (let i = 0; i < n; i++) {
            const d = el('circle', { cx: X0 + i * DX, cy: Y, r: 0, fill: C.dim2, stroke: C.grey, 'stroke-width': 1 }, ctx.svg);
            dots.push(d); vals.push(0);
            ctx.label('n' + i, String(i + 1), X0 + i * DX, Y - 34, { color: C.grey, size: 13 });
            await ctx.anim(d, { r: 0 }, { r: RAD }, 120);
          }
          await ctx.wait(300);
          for (let i = 0; i < n; i++) { ctx.label('d' + i, '', X0 + i * DX, Y + 34, { size: 11 }); setDot(i, sample(i)); await ctx.wait(90); }
          ctx.label('s', `\\(S_{${n}} = ${countFrom(0)}\\) late days`, ctx.W / 2, Y + 90, { color: C.white, size: 15 });
        }
      },
      {
        caption: R`Condition on \(T_1 = 4\): the first late day is day 4. That pins down days 1–4 completely: on time, on time, on time, late. So \(S_4 = 1\).`,
        run: async () => {
          for (let i = 0; i < fixed.length; i++) { setDot(i, fixed[i]); await ctx.wait(160); }
          const bx = X0 - RAD - 8, bw = (fixed.length - 1) * DX + 2 * RAD + 16;
          const box = el('rect', { x: bx, y: Y - RAD - 10, width: bw, height: 2 * RAD + 20, rx: 8, fill: 'none', stroke: C.yellow, 'stroke-width': 1.5, opacity: 0 }, ctx.svg);
          await ctx.fade(box, 0, 1, 300);
          ctx.label('fix', 'fixed by the condition', bx + bw / 2, Y - RAD - 50, { color: C.yellow, size: 13 });
          ctx.text('s', `\\(S_{${n}} = 1 + (S_{${n}} - S_4) = 1 + ${countFrom(fixed.length)}\\)`);
          await ctx.tween(400, t => { for (let i = fixed.length; i < n; i++) dots[i].setAttribute('opacity', 1 - 0.55 * t); });
        }
      },
      {
        caption: R`Days 5–10 are untouched by the condition. Watch them resample while days 1–4 stay put: the increment \(S_{10} - S_4\) is still \(\Binom(6, p)\), independent of \(\{T_1 = 4\}\).`,
        run: async () => {
          await ctx.tween(300, t => { for (let i = fixed.length; i < n; i++) dots[i].setAttribute('opacity', 0.45 + 0.55 * t); });
          const bx = X0 + fixed.length * DX - RAD - 8, bw = (n - fixed.length - 1) * DX + 2 * RAD + 16;
          const box = el('rect', { x: bx, y: Y - RAD - 10, width: bw, height: 2 * RAD + 20, rx: 8, fill: 'none', stroke: C.blue, 'stroke-width': 1.5, 'stroke-dasharray': '4 3', opacity: 0 }, ctx.svg);
          await ctx.fade(box, 0, 1, 300);
          ctx.label('free', 'still random', bx + bw / 2, Y - RAD - 50, { color: C.blue, size: 13 });
          for (let rep = 0; rep < 7; rep++) {
            for (let i = fixed.length; i < n; i++) setDot(i, sample(i));
            ctx.text('s', `\\(S_{${n}} = 1 + ${countFrom(fixed.length)}\\)`);
            if (!(await ctx.wait(650))) return;
          }
          ctx.text('s', `\\(\\E[S_{${n}} \\given T_1 = 4] = 1 + 6p\\)`);
        }
      }
    ];
    return { scenes, reset };
  };

  /* ================================================================
     FIGURE: indicators — a count as a sum of indicators, then expectation
     opts: n, p, q (second-level prob, or null), labelA, labelB, pTex, qTex, nTex
     ================================================================ */
  reg.indicators = function (ctx, o) {
    const n = o.n || 8, p = o.p ?? 0.5, q = (o.q == null) ? null : o.q;
    const X0 = 60, DX = (ctx.W - 120) / (n - 1), Y = 110, S = 34;
    let boxes = [], A = [], B = [];
    function reset() { boxes = []; A = []; B = []; }
    const pTex = o.pTex || 'p', qTex = o.qTex || 'e^{-3\\mu}', nTex = o.nTex || 'n';
    const prodTex = q == null ? pTex : `${pTex}\\,${qTex}`;
    const scenes = [
      {
        caption: o.cap1 || R`Each day is a trial. Blue days are the ones where the first thing happens (${o.labelA || 'Firestone'}), with probability \(${pTex}\).`,
        run: async () => {
          for (let i = 0; i < n; i++) {
            const b = el('rect', { x: X0 + i * DX - S / 2, y: Y - S / 2, width: S, height: S, rx: 6, fill: C.dim2, stroke: C.grey, opacity: 0 }, ctx.svg);
            boxes.push(b); ctx.label('n' + i, String(i + 1), X0 + i * DX, Y - S / 2 - 16, { color: C.grey, size: 12 });
            await ctx.fade(b, 0, 1, 90);
          }
          await ctx.wait(250);
          for (let i = 0; i < n; i++) { A[i] = rnd() < p ? 1 : 0; if (A[i]) boxes[i].setAttribute('fill', C.blue); await ctx.wait(90); }
        }
      },
      ...(q == null ? [] : [{
        caption: o.cap2 || R`On a blue day, the second thing (${o.labelB || 'study more than 3 hours'}) happens with probability \(${qTex}\). Gold rings mark the days where both happened.`,
        run: async () => {
          for (let i = 0; i < n; i++) {
            B[i] = A[i] && rnd() < q ? 1 : 0;
            if (B[i]) { const r = el('rect', { x: X0 + i * DX - S / 2 - 5, y: Y - S / 2 - 5, width: S + 10, height: S + 10, rx: 9, fill: 'none', stroke: C.yellow, 'stroke-width': 2, opacity: 0 }, ctx.svg); await ctx.fade(r, 0, 1, 200); }
          }
        }
      }]),
      {
        caption: o.cap3 || R`Define the indicator \(I_k = 1\) if the event happened on day \(k\), else \(0\). The count is simply \(\sum_k I_k\).`,
        run: async () => {
          const I = q == null ? A : B; let s = 0;
          for (let i = 0; i < n; i++) { s += I[i]; ctx.label('i' + i, `\\(I_{${i + 1}} = ${I[i]}\\)`, X0 + i * DX, Y + 50, { color: I[i] ? C.yellow : C.grey, size: 13 }); await ctx.wait(110); }
          ctx.label('sum', `\\(\\displaystyle\\sum_{k=1}^{${n}} I_k = ${s}\\)`, ctx.W / 2, Y + 110, { color: C.white, size: 15 });
        }
      },
      {
        caption: o.cap4 || R`Expectation is linear: replace each indicator by its probability. No independence is needed for this step.`,
        run: async () => {
          for (let i = 0; i < n; i++) { ctx.text('i' + i, `\\(${prodTex}\\)`); const l = ctx.labelMap['i' + i]; if (l) l.style.color = C.teal; await ctx.wait(80); }
          ctx.text('sum', `\\(\\displaystyle\\E\\Big[\\sum_{k=1}^{${nTex}} I_k\\Big] = \\sum_{k=1}^{${nTex}} \\P\\{I_k = 1\\} = ${nTex}\\,${prodTex}\\)`);
          const l = ctx.labelMap['sum']; if (l) l.style.color = C.teal;
        }
      }
    ];
    return { scenes, reset, params: o.noSlider ? [] : [] };
  };

  /* ================================================================
     FIGURE: tree — chain rule on a three-level tree (Chad)
     ================================================================ */
  reg.tree = function (ctx, o) {
    const L = o.labels || { a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g' };
    const ev = o.events || ['A', 'B', 'C'];
    const X1 = 60, X2 = 230, X3 = 400, X4 = 560;
    const nodes = {}; let edges = {};
    function reset() { edges = {}; }
    function node(id, x, y, text, color) { nodes[id] = { x, y }; el('circle', { cx: x, cy: y, r: 5, fill: color || C.white }, ctx.svg); ctx.label('n' + id, `\\(${text}\\)`, x, y - 18, { color: color || C.white, size: 15 }); }
    async function edge(id, from, to, lab, color) {
      const a = nodes[from], b = nodes[to];
      const ln = el('line', { x1: a.x, y1: a.y, x2: a.x, y2: a.y, stroke: color || C.grey, 'stroke-width': 1.5 }, ctx.svg); edges[id] = ln;
      await ctx.anim(ln, { x2: a.x, y2: a.y }, { x2: b.x, y2: b.y }, 350);
      ctx.label('e' + id, `\\(${lab}\\)`, (a.x + b.x) / 2, (a.y + b.y) / 2 - 12, { color: C.grey, size: 13 });
    }
    function hi(ids, color) { for (const k in edges) { const on = ids.includes(k); edges[k].setAttribute('stroke', on ? color : C.grey); edges[k].setAttribute('stroke-width', on ? 3.5 : 1.5); edges[k].setAttribute('opacity', on ? 1 : 0.35); const l = ctx.labelMap['e' + k]; if (l) l.style.color = on ? color : C.grey; } }
    const Y = { r: 180, A: 90, An: 270, AB: 50, ABn: 130, AnB: 230, AnBn: 310 };
    const scenes = [
      {
        caption: R`The fortune teller speaks in a chain: first \(${ev[0]}\), then \(${ev[1]}\) given what happened with \(${ev[0]}\), then \(${ev[2]}\) given both. Draw it as a tree.`,
        run: async () => {
          node('r', X1, Y.r, '\\Omega'); node('A', X2, Y.A, ev[0]); node('An', X2, Y.An, ev[0] + '^c');
          await edge('a', 'r', 'A', L.a); await edge('an', 'r', 'An', `1 - ${L.a}`);
          node('AB', X3, Y.AB, ev[1]); node('ABn', X3, Y.ABn, ev[1] + '^c'); node('AnB', X3, Y.AnB, ev[1]); node('AnBn', X3, Y.AnBn, ev[1] + '^c');
          await edge('b', 'A', 'AB', L.b); await edge('bn', 'A', 'ABn', `1 - ${L.b}`); await edge('c', 'An', 'AnB', L.c); await edge('cn', 'An', 'AnBn', `1 - ${L.c}`);
          node('C1', X4, Y.AB, ev[2], C.blue); node('C2', X4, Y.ABn, ev[2], C.blue); node('C3', X4, Y.AnB, ev[2], C.blue); node('C4', X4, Y.AnBn, ev[2], C.blue);
          await edge('d', 'AB', 'C1', L.d); await edge('e', 'ABn', 'C2', L.e); await edge('f', 'AnB', 'C3', L.f); await edge('g', 'AnBn', 'C4', L.g);
        }
      },
      {
        caption: R`The probability of one path is the product of its edge labels (chain rule): \(\P\{${ev[0]}\cap ${ev[1]}\cap ${ev[2]}\} = ${L.a}\,${L.b}\,${L.d}\).`,
        run: async () => { hi(['a', 'b', 'd'], C.yellow); await ctx.wait(200); ctx.label('path', `\\(${L.a}\\cdot ${L.b}\\cdot ${L.d}\\)`, X4 + 5, Y.AB + 22, { color: C.yellow, size: 14, align: 'right' }); }
      },
      {
        caption: R`\(\P\{${ev[2]}\}\) is the sum over the four disjoint paths ending in \(${ev[2]}\). That is the law of total probability over the partition \(\{${ev[0]}\cap ${ev[1]}, ${ev[0]}\cap ${ev[1]}^c, \dots\}\).`,
        run: async () => {
          hi(['a', 'b', 'd', 'bn', 'e', 'an', 'c', 'f', 'cn', 'g'], C.blue);
          const l = ctx.labelMap['path']; if (l) l.style.color = C.blue;
          ctx.label('p2', `\\(${L.a}(1-${L.b})${L.e}\\)`, X4 + 5, Y.ABn + 22, { color: C.blue, size: 14, align: 'right' }); await ctx.wait(250);
          ctx.label('p3', `\\((1-${L.a})${L.c}${L.f}\\)`, X4 + 5, Y.AnB + 22, { color: C.blue, size: 14, align: 'right' }); await ctx.wait(250);
          ctx.label('p4', `\\((1-${L.a})(1-${L.c})${L.g}\\)`, X4 + 5, Y.AnBn + 22, { color: C.blue, size: 14, align: 'right' }); await ctx.wait(250);
          ctx.label('sum', `\\(\\P\\{${ev[2]}\\} = \\text{sum of the four}\\)`, X4 - 30, Y.r, { color: C.blue, size: 14 });
        }
      },
      {
        caption: R`Given \(${ev[2]}\): the gold path divided by the sum of the four blue paths. “One way it can happen, over all the ways it can happen.”`,
        run: async () => { hi(['a', 'b', 'd'], C.yellow); for (const k of ['bn', 'e', 'an', 'c', 'f', 'cn', 'g']) { edges[k].setAttribute('stroke', C.blue); edges[k].setAttribute('opacity', 0.8); edges[k].setAttribute('stroke-width', 2); } ctx.text('sum', `\\(\\P\\{\\text{all three}\\given ${ev[2]}\\} = \\dfrac{\\text{gold}}{\\text{gold} + \\text{blue}}\\)`); }
      }
    ];
    return { scenes, reset };
  };

  /* ================================================================
     FIGURE: race — two independent geometric clocks; min and who is first
     ================================================================ */
  reg.race = function (ctx, o) {
    const p = o.p || 0.5, n = o.n || 12, reps = o.reps || 24;
    const X0 = 110, DX = 26, YA = 70, YB = 130, RAD = 9;
    let rows = [[], []], tally = [0, 0, 0], bars = [];
    function reset() { rows = [[], []]; tally = [0, 0, 0]; bars = []; }
    function sampleRow() { const v = []; for (let i = 0; i < n; i++) v.push(rnd() < p ? 1 : 0); return v; }
    function first(v) { const k = v.indexOf(1); return k < 0 ? n + 1 : k + 1; }
    function paint(r, v, mark) { v.forEach((x, i) => { rows[r][i].setAttribute('fill', x ? C.yellow : C.dim2); }); if (mark > 0 && mark <= n) rows[r][mark - 1].setAttribute('stroke', C.white); }
    function clearStroke() { rows.forEach(rw => rw.forEach(d => d.setAttribute('stroke', 'none'))); }
    let line;
    const scenes = [
      {
        caption: R`Two independent clocks: each day each of you gets an offer with probability \(p\). \(N\) and \(M\) are the first gold days.`,
        run: async () => {
          ctx.label('you', 'you', X0 - 28, YA, { color: C.grey, size: 13, align: 'right' }); ctx.label('rm', 'roommate', X0 - 28, YB, { color: C.grey, size: 13, align: 'right' });
          for (let i = 0; i < n; i++) { ctx.label('d' + i, String(i + 1), X0 + i * DX, YA - 24, { color: C.grey, size: 11 }); }
          for (let r = 0; r < 2; r++) for (let i = 0; i < n; i++) rows[r].push(el('circle', { cx: X0 + i * DX, cy: r ? YB : YA, r: RAD, fill: C.dim2 }, ctx.svg));
          const a = sampleRow(), b = sampleRow(); const N = first(a), M = first(b);
          paint(0, a, N); paint(1, b, M);
          ctx.label('NM', `\\(N = ${N},\\quad M = ${M}\\)`, X0 + n * DX + 60, YA, { color: C.white, size: 14 });
          line = el('line', { x1: X0 + (Math.min(N, M) - 1) * DX, y1: YA - 14, x2: X0 + (Math.min(N, M) - 1) * DX, y2: YB + 14, stroke: C.red, 'stroke-width': 2, opacity: 0 }, ctx.svg);
          await ctx.fade(line, 0, 1, 300);
          ctx.label('RAD', `\\(R = \\min\\{N, M\\} = ${Math.min(N, M)}\\)`, X0 + n * DX + 60, YB, { color: C.red, size: 14 });
        }
      },
      {
        caption: R`Repeat the experiment many times and tally who is first. With discrete days, ties are not rare: at \(p = \tfrac12\) each of the three outcomes has probability \(\tfrac13\).`,
        run: async () => {
          const BX = 110, BY = 300, BW = 120, BH = 90;
          const names = ['you first (N &lt; M)', 'tie (N = M)', 'roommate first (N &gt; M)'];
          names.forEach((nm, k) => { bars.push(el('rect', { x: BX + k * 170, y: BY, width: BW, height: 0, fill: [C.blue, C.red, C.purple][k] }, ctx.svg)); ctx.label('b' + k, nm, BX + k * 170 + BW / 2, BY + 16, { color: C.grey, size: 12 }); ctx.label('v' + k, '', BX + k * 170 + BW / 2, BY - 12, { color: C.white, size: 13 }); });
          el('line', { x1: BX - 20, y1: BY, x2: BX + 2 * 170 + BW + 20, y2: BY, stroke: C.grey }, ctx.svg);
          for (let rep = 0; rep < reps; rep++) {
            clearStroke();
            const a = sampleRow(), b = sampleRow(); const N = first(a), M = first(b);
            paint(0, a, N); paint(1, b, M);
            tally[N < M ? 0 : N === M ? 1 : 2]++;
            const tot = tally.reduce((s, x) => s + x, 0);
            ctx.text('NM', `\\(N = ${N},\\quad M = ${M}\\)`); ctx.text('RAD', `\\(R = ${Math.min(N, M)}\\)`);
            const xr = X0 + (Math.min(N, M) - 1) * DX; setA(line, { x1: xr, x2: xr });
            bars.forEach((bar, k) => { const h = tally[k] / tot * BH; setA(bar, { y: BY - h, height: h }); ctx.text('v' + k, `${tally[k]}/${tot}`); ctx.moveLabel('v' + k, BX + k * 170 + BW / 2, BY - h - 12); });
            if (!(await ctx.wait(rep < 6 ? 500 : 180))) return;
          }
          ctx.label('th', `\\(\\P\\{N \\lt M\\} = \\tfrac{1-p}{2-p},\\quad \\P\\{N = M\\} = \\tfrac{p}{2-p}\\)`, ctx.W / 2, 215, { color: C.white, size: 14 });
        }
      }
    ];
    return { scenes, reset };
  };

  /* ================================================================
     FIGURE: renormalize — conditioning rescales every surviving outcome
     opts: outcomes [{label, w, removed, value}], condName
     ================================================================ */
  reg.renormalize = function (ctx, o) {
    const outs = o.outcomes; const X0 = 50, W = ctx.W - 100, Y = 120, H = 56;
    let segs = [];
    function reset() { segs = []; }
    const total = outs.reduce((s, x) => s + x.w, 0);
    const keep = outs.filter(x => !x.removed); const keepTot = keep.reduce((s, x) => s + x.w, 0);
    const scenes = [
      {
        caption: o.cap1 || R`The eight availability patterns are equally likely: each has probability \(\tfrac18\). The bar has total length 1.`,
        run: async () => {
          let x = X0;
          for (let i = 0; i < outs.length; i++) {
            const w = outs[i].w / total * W;
            const r = el('rect', { x, y: Y, width: 0, height: H, fill: outs[i].removed ? C.red : C.blue, stroke: C.dim, 'stroke-width': 2, opacity: 0.9 }, ctx.svg);
            segs.push({ r, x, w }); await ctx.anim(r, { width: 0 }, { width: w }, 120);
            ctx.label('o' + i, outs[i].label, x + w / 2, Y + H / 2, { color: '#111', size: 13 });
            ctx.label('w' + i, `\\(${o.wTex || '\\tfrac18'}\\)`, x + w / 2, Y + H + 18, { color: C.grey, size: 13 });
            if (outs[i].value != null) ctx.label('v' + i, `$${outs[i].value}`, x + w / 2, Y - 16, { color: C.yellow, size: 13 });
            x += w;
          }
        }
      },
      {
        caption: o.cap2 || R`Condition on “not all sold out”: throw away the red outcome and stretch the rest to total length 1. Every survivor is scaled by the same factor \(1/\P(A^c) = \tfrac87\): each now has probability \(\tfrac17\).`,
        run: async () => {
          const rem = segs.map((s, i) => outs[i].removed);
          await ctx.tween(400, t => segs.forEach((s, i) => { if (rem[i]) s.r.setAttribute('opacity', 0.9 * (1 - t)); }));
          rem.forEach((r, i) => { if (r) { ctx.show('o' + i, false); ctx.show('w' + i, false); ctx.show('v' + i, false); } });
          let x = X0; const targets = segs.map((s, i) => { if (rem[i]) return null; const w = outs[i].w / keepTot * W; const t = { x, w }; x += w; return t; });
          await ctx.tween(800, t => segs.forEach((s, i) => { if (rem[i]) return; const nx = lerp(s.x, targets[i].x, t), nw = lerp(s.w, targets[i].w, t); setA(s.r, { x: nx, width: nw }); ctx.moveLabel('o' + i, nx + nw / 2, Y + H / 2); ctx.moveLabel('w' + i, nx + nw / 2, Y + H + 18); ctx.moveLabel('v' + i, nx + nw / 2, Y - 16); }));
          segs.forEach((s, i) => { if (!rem[i]) ctx.text('w' + i, `\\(${o.wTexAfter || '\\tfrac17'}\\)`); });
          if (o.meanTex) ctx.label('mean', o.meanTex, ctx.W / 2, Y + H + 70, { color: C.yellow, size: 15 });
        }
      }
    ];
    return { scenes, reset };
  };

  /* ================================================================
     FIGURE: jensen — E[X²] versus (E[X])², the gap is the variance
     opts: values, probs
     ================================================================ */
  reg.jensen = function (ctx, o) {
    const vals = o.values || [0, 1, 2, 3, 4]; const probs = o.probs || [1 / 16, 4 / 16, 6 / 16, 4 / 16, 1 / 16];
    const X0 = 80, X1 = 600, Y0 = 320, Y1 = 40; const xmax = Math.max(...vals), ymax = xmax * xmax;
    const sx = x => X0 + x / xmax * (X1 - X0), sy = y => Y0 - y / ymax * (Y0 - Y1);
    const mean = vals.reduce((s, v, i) => s + v * probs[i], 0); const m2 = vals.reduce((s, v, i) => s + v * v * probs[i], 0);
    let pts = [];
    function reset() { pts = []; }
    const scenes = [
      {
        caption: R`A random variable \(X\) takes a few values; dot size is probability. The curve is \(y = x^2\).`,
        run: async () => {
          el('line', { x1: X0, y1: Y0, x2: X1 + 10, y2: Y0, stroke: C.grey }, ctx.svg); el('line', { x1: X0, y1: Y0, x2: X0, y2: Y1 - 10, stroke: C.grey }, ctx.svg);
          ctx.label('xl', `\\(x\\)`, X1 + 22, Y0, { color: C.grey, size: 13 }); ctx.label('yl', `\\(x^2\\)`, X0, Y1 - 22, { color: C.grey, size: 13 });
          let d = ''; for (let i = 0; i <= 60; i++) { const x = xmax * i / 60; d += (i ? 'L' : 'M') + sx(x) + ',' + sy(x * x) + ' '; }
          const path = el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': 2, opacity: 0 }, ctx.svg);
          vals.forEach((v, i) => { pts.push(el('circle', { cx: sx(v), cy: Y0, r: 0, fill: C.yellow }, ctx.svg)); ctx.label('t' + i, String(v), sx(v), Y0 + 16, { color: C.grey, size: 12 }); });
          await ctx.tween(500, t => pts.forEach((pt, i) => pt.setAttribute('r', 4 + 14 * probs[i] * t * 2)));
          await ctx.fade(path, 0, 1, 500);
        }
      },
      {
        caption: R`Lift every value onto the curve: the heights are the values of \(X^2\), still weighted by the same probabilities.`,
        run: async () => { await ctx.tween(800, t => pts.forEach((pt, i) => pt.setAttribute('cy', lerp(Y0, sy(vals[i] * vals[i]), t)))); }
      },
      {
        caption: R`\((\E[X])^2\): first average \(x\) (the dashed line), then square it: one point on the curve.`,
        run: async () => {
          const vl = el('line', { x1: sx(mean), y1: Y0, x2: sx(mean), y2: Y0, stroke: C.green, 'stroke-dasharray': '4 3', 'stroke-width': 1.5 }, ctx.svg);
          await ctx.anim(vl, { y2: Y0 }, { y2: sy(mean * mean) }, 500);
          el('circle', { cx: sx(mean), cy: sy(mean * mean), r: 6, fill: C.green }, ctx.svg);
          ctx.label('m', `\\(\\E[X] = ${fmt(mean, 2)}\\)`, sx(mean), Y0 + 34, { color: C.green, size: 13 });
          ctx.label('m2', `\\((\\E[X])^2 = ${fmt(mean * mean, 2)}\\)`, sx(mean) - 16, sy(mean * mean) + 14, { color: C.green, size: 13, align: 'right' });
        }
      },
      {
        caption: R`\(\E[X^2]\): average the <em>heights</em> of the lifted dots. It sits strictly above \((\E[X])^2\); the gap is exactly \(\Var(X)\). Confusing the two is the classic exam error.`,
        run: async () => {
          const hl = el('line', { x1: X0, y1: sy(m2), x2: X0, y2: sy(m2), stroke: C.red, 'stroke-width': 1.5 }, ctx.svg);
          await ctx.anim(hl, { x2: X0 }, { x2: sx(mean) + 60 }, 600);
          ctx.label('e2', `\\(\\E[X^2] = ${fmt(m2, 2)}\\)`, sx(mean) + 70, sy(m2), { color: C.red, size: 13, align: 'left' });
          const br = el('line', { x1: sx(mean) + 40, y1: sy(mean * mean), x2: sx(mean) + 40, y2: sy(m2), stroke: C.white, 'stroke-width': 1.5, opacity: 0 }, ctx.svg);
          await ctx.fade(br, 0, 1, 300);
          ctx.label('var', `\\(\\Var(X) = ${fmt(m2 - mean * mean, 2)}\\)`, sx(mean) + 50, sy(mean * mean) + 18, { color: C.white, size: 13, align: 'left' });
        }
      }
    ];
    return { scenes, reset };
  };

  /* ================================================================
     FIGURE: lattice — joint pmf of two geometrics; diagonal and anti-diagonal sums
     opts: p, n, k
     ================================================================ */
  reg.lattice = function (ctx, o) {
    const p = o.p || 0.4, n = o.n || 8, k = o.k || 5;
    const S = 32, X0 = 120, Y0 = 300; let cells = [];
    const pr = (i, j) => p * p * Math.pow(1 - p, i + j - 2);
    const cx = i => X0 + (i - 1) * S, cy = j => Y0 - (j - 1) * S;
    function reset() { cells = []; }
    const scenes = [
      {
        caption: R`The joint distribution of two independent geometrics \(S_1, S_2\): the cell \((n, m)\) has probability \(p(1-p)^{n-1}\cdot p(1-p)^{m-1}\). Brightness is probability.`,
        run: async () => {
          ctx.label('xl', `\\(S_1\\)`, cx(n) + 40, Y0 + S / 2, { color: C.grey, size: 14 }); ctx.label('yl', `\\(S_2\\)`, X0 + S / 2, cy(n) - 36, { color: C.grey, size: 14 });
          for (let i = 1; i <= n; i++) { ctx.label('x' + i, String(i), cx(i) + S / 2, Y0 + S + 12, { color: C.grey, size: 11 }); ctx.label('y' + i, String(i), X0 - 12, cy(i) + S / 2, { color: C.grey, size: 11 }); }
          for (let j = 1; j <= n; j++) for (let i = 1; i <= n; i++) {
            const op = 0.15 + 0.85 * Math.pow(pr(i, j) / pr(1, 1), 0.6);
            const r = el('rect', { x: cx(i), y: cy(j), width: S - 2, height: S - 2, fill: C.blue, opacity: 0 }, ctx.svg); cells.push({ r, i, j, op });
          }
          await ctx.tween(700, t => cells.forEach(c => c.r.setAttribute('opacity', c.op * t)));
        }
      },
      {
        caption: R`\(\{S_1 = S_2\}\) is the diagonal: a disjoint union of cells \((n, n)\). Its probability is the sum \(\sum_{n\ge1} p^2(1-p)^{2(n-1)} = \frac{p}{2-p}\).`,
        run: async () => {
          let s = 0; ctx.label('sum', '', 460, 120, { color: C.yellow, size: 14 });
          for (let d = 1; d <= n; d++) { const c = cells.find(c => c.i === d && c.j === d); c.r.setAttribute('fill', C.yellow); c.r.setAttribute('opacity', 1); s += pr(d, d); ctx.text('sum', `\\(\\sum_{n=1}^{${d}} = ${fmt(s, 3)}\\)`); if (!(await ctx.wait(220))) return; }
          ctx.text('sum', `\\(\\to \\dfrac{p}{2-p} = ${fmt(p / (2 - p), 3)}\\)`);
        }
      },
      {
        caption: R`\(\{S_1 + S_2 = k\}\) is an anti-diagonal (here \(k = ${k}\)): the \(k-1\) cells \((n, k-n)\), \(1 \le n \le k-1\), all with the same probability \(p^2(1-p)^{k-2}\).`,
        run: async () => {
          cells.forEach(c => { c.r.setAttribute('fill', C.blue); c.r.setAttribute('opacity', c.op * 0.5); });
          for (let i = 1; i <= k - 1; i++) { const c = cells.find(c => c.i === i && c.j === k - i); c.r.setAttribute('fill', C.red); c.r.setAttribute('opacity', 1); if (!(await ctx.wait(200))) return; }
          ctx.text('sum', `\\(\\P\\{S_1+S_2=${k}\\} = (${k}-1)\\,p^2(1-p)^{${k}-2} = ${fmt((k - 1) * p * p * Math.pow(1 - p, k - 2), 3)}\\)`);
          const l = ctx.labelMap['sum']; if (l) l.style.color = C.red;
        }
      }
    ];
    return { scenes, reset };
  };

  ORF309.figures = { mount, register: (n, f) => { reg[n] = f; }, palette: C };
})();
