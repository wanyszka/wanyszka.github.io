/* ================================================================
   ORF 309 · Midterm Studio — application engine
   routes:   #/  ·  #/exam/:id  ·  #/exam/:id/:pid  ·  #/playbook
   steps:    note · mcq (single / multi / "spot the error" quote)
             · input (numeric / fraction / symbolic) · reveal
   each step may carry  solution: html  → appended to "Your solution"
                        figure: {name, opts} → animated figure
   ================================================================ */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const main = $('#main');
  const KEY = 'orf309.studio.progress.v2';

  /* ---------------- progress ---------------- */
  function loadProgress() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function saveProgress(p) { localStorage.setItem(KEY, JSON.stringify(p)); }
  let progress = loadProgress();
  function probState(examId, probId) {
    const k = examId + '/' + probId;
    if (!progress[k]) progress[k] = { parts: {}, answers: {}, done: false };
    return progress[k];
  }
  function partState(ps, i) { if (!ps.parts[i]) ps.parts[i] = { revealed: 1 }; return ps.parts[i]; }
  function problemStatus(exam, prob) {
    const ps = progress[exam.id + '/' + prob.id];
    if (!ps) return 'todo';
    return ps.done ? 'done' : 'doing';
  }
  function examCompletion(exam) {
    const total = exam.problems.length;
    const done = exam.problems.filter(p => problemStatus(exam, p) === 'done').length;
    return { done, total };
  }

  /* ---------------- helpers ---------------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  const MACROS = {
    '\\P': '\\mathbb{P}', '\\E': '\\mathbb{E}', '\\Var': '\\operatorname{Var}', '\\Cov': '\\operatorname{Cov}',
    '\\Binom': '\\operatorname{Binom}', '\\Geom': '\\operatorname{Geom}', '\\Exp': '\\operatorname{Exp}',
    '\\ind': '\\mathbf{1}', '\\given': '\\,|\\,'
  };
  function renderMath(root) {
    if (!root) return;
    if (typeof renderMathInElement !== 'function') { setTimeout(() => renderMath(root), 60); return; }
    renderMathInElement(root, {
      delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
      throwOnError: false, strict: false, macros: MACROS
    });
  }
  ORF309.renderMath = renderMath;

  function setNav(name) { document.querySelectorAll('.topnav a').forEach(a => a.classList.toggle('active', a.dataset.nav === name)); }
  const LETTERS = 'ABCDEFGH';

  function parseNumber(str) {
    let s = String(str).trim().toLowerCase().replace(/\s+/g, '');
    if (!s) return NaN;
    s = s.replace(/^\\frac\{([^}]*)\}\{([^}]*)\}$/, '$1/$2').replace(/^\(([^)]*)\)$/, '$1').replace(/[−–]/g, '-');
    let pct = false;
    if (s.endsWith('%')) { pct = true; s = s.slice(0, -1); }
    let v;
    const frac = s.match(/^([+-]?\d*\.?\d+)\/([+-]?\d*\.?\d+)$/);
    if (frac) v = parseFloat(frac[1]) / parseFloat(frac[2]);
    else if (/^[+-]?\d*\.?\d+(e[+-]?\d+)?$/.test(s)) v = parseFloat(s);
    else return NaN;
    return pct ? v / 100 : v;
  }
  function normSym(str) {
    return String(str).toLowerCase().replace(/\s+/g, '')
      .replace(/\*/g, '').replace(/\\cdot/g, '').replace(/\\left|\\right/g, '')
      .replace(/[−–]/g, '-').replace(/²/g, '^2').replace(/³/g, '^3')
      .replace(/\\mu/g, 'μ').replace(/mu(?![a-z])/g, 'μ')
      .replace(/\{/g, '(').replace(/\}/g, ')')
      .replace(/\^\(([a-z0-9+\-]+)\)/g, '^$1');
  }
  function checkInput(step, raw) {
    if (typeof step.numeric === 'number') {
      const v = parseNumber(raw);
      if (!isNaN(v)) {
        const tol = step.tol != null ? step.tol : Math.max(1e-9, Math.abs(step.numeric) * 0.01);
        if (Math.abs(v - step.numeric) <= tol) return true;
      }
    }
    if (Array.isArray(step.answers)) {
      const n = normSym(raw);
      if (step.answers.some(a => normSym(a) === n)) return true;
    }
    return false;
  }
  function mountFigures(root) {
    root.querySelectorAll('[data-figure]').forEach(host => {
      if (host.dataset.mounted) return;
      host.dataset.mounted = '1';
      const name = host.dataset.figure;
      let opts = {};
      try { opts = JSON.parse(host.dataset.opts || '{}'); } catch (e) { /* ignore */ }
      if (ORF309.figures && ORF309.figures.mount) ORF309.figures.mount(host, name, opts);
    });
  }
  function figureHtml(fig) {
    if (!fig) return '';
    return `<div class="fig" data-figure="${esc(fig.name)}" data-opts="${esc(JSON.stringify(fig.opts || {}))}"></div>`;
  }
  function whyHtml(step) {
    let h = '';
    if (step.why) h += `<div class="why"><em class="lead">Why this move.</em> ${step.why}</div>`;
    if (step.watch) h += `<div class="why watch"><em class="lead">Careful.</em> ${step.watch}</div>`;
    return h;
  }

  /* ---------------- routing ---------------- */
  function route() {
    const hash = location.hash.replace(/^#/, '') || '/';
    if (!hash.startsWith('/')) {
      // In-page anchor (e.g. a playbook section): keep the current view, just scroll.
      if (!main.firstElementChild) viewPlaybook();
      const target = document.getElementById(hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const parts = hash.split('/').filter(Boolean);
    window.scrollTo(0, 0);
    if (parts.length === 0) return viewHome();
    if (parts[0] === 'playbook') return viewPlaybook();
    if (parts[0] === 'exam' && parts[1]) {
      const exam = ORF309.exams.find(e => e.id === parts[1]);
      if (!exam) return viewNotFound();
      if (parts[2]) {
        const prob = exam.problems.find(p => p.id === parts[2]);
        if (!prob) return viewNotFound();
        return viewProblem(exam, prob);
      }
      return viewExam(exam);
    }
    viewNotFound();
  }
  function viewNotFound() { setNav(''); main.innerHTML = `<div class="empty"><p>Nothing here. <a href="#/">Back to the exams.</a></p></div>`; }

  /* ---------------- HOME ---------------- */
  function viewHome() {
    setNav('home');
    const rows = ORF309.exams.map(ex => {
      const c = examCompletion(ex);
      const cls = c.done === 0 ? '' : c.done === c.total ? 'done' : 'doing';
      const txt = c.done === 0 ? `${c.total} problems` : c.done === c.total ? 'Completed' : `${c.done} of ${c.total} completed`;
      return `<a class="row" href="#/exam/${ex.id}">
        <div><h3>${esc(ex.title)}</h3><div class="sub">${ex.blurb || ''}</div></div>
        <div class="right ${cls}">${txt}</div></a>`;
    }).join('');
    main.innerHTML = `
      <section class="hero">
        <h1>ORF 309 Midterm Studio</h1>
        <p class="lede">“Past midterms, replayed one move at a time: <span class="hook-emph">learn the approach</span>, not just the answer.”</p>
        <div class="how">
          <div class="tile"><b><span class="num-circle">1</span>Set up</b>Name the events and random variables; decide what kind of object the question asks for.</div>
          <div class="tile"><b><span class="num-circle">2</span>Choose the move</b>Short checkpoints ask for the natural next step, and why it is natural.</div>
          <div class="tile"><b><span class="num-circle">3</span>Spot the error</b>Real mistakes from past exams, quoted from the grading comments, for you to diagnose.</div>
          <div class="tile"><b><span class="num-circle">4</span>Keep the solution</b>Every answer adds a line to your written solution, which stays on screen.</div>
        </div>
      </section>
      <div class="list narrow">
        ${rows}
        <a class="row" href="#/playbook">
          <div><h3>The Playbook</h3><div class="sub">The recurring moves behind every midterm problem, animated, with the red flags graders look for.</div></div>
          <div class="right">Reference</div></a>
      </div>`;
    renderMath(main);
  }

  /* ---------------- EXAM ---------------- */
  function viewExam(exam) {
    setNav('home');
    const rows = exam.problems.map((p, i) => {
      const st = problemStatus(exam, p);
      const label = { todo: '', doing: 'In progress', done: 'Completed' }[st];
      return `<a class="row" href="#/exam/${exam.id}/${p.id}">
        <div><h3><span class="num">${i + 1}</span>${esc(p.title)}</h3><div class="sub">${p.lead || ''}</div>
          ${p.tags && p.tags.length ? `<div class="meta">${p.tags.map(esc).join(' · ')}</div>` : ''}</div>
        <div class="right ${st}">${label}</div></a>`;
    }).join('');
    main.innerHTML = `
      <div class="narrow">
        <div class="crumbs"><a href="#/">Exams</a><span>/</span>${esc(exam.title)}</div>
        <div class="page-head"><h1>${esc(exam.title)}</h1><p class="sub">${exam.intro || ''}</p></div>
        <div class="list">${rows}</div>
      </div>`;
    renderMath(main);
  }

  /* ---------------- PROBLEM ---------------- */
  function viewProblem(exam, prob) {
    setNav('home');
    const ps = probState(exam.id, prob.id);
    ps.current = Math.min(ps.current || 0, prob.parts.length - 1);
    saveProgress(progress);
    const idx = exam.problems.indexOf(prob);
    const next = exam.problems[idx + 1];

    main.innerHTML = `
      <div class="crumbs"><a href="#/">Exams</a><span>/</span><a href="#/exam/${exam.id}">${esc(exam.title)}</a><span>/</span>Problem ${idx + 1}</div>
      <div class="problem-layout">
        <section class="stream">
          <div class="stream-head">
            <h1>${esc(prob.title)}</h1>
            <div class="lead">${prob.lead || ''}</div>
            ${prob.tags && prob.tags.length ? `<div class="tags">${prob.tags.map(esc).join(' · ')}</div>` : ''}
          </div>
          <div class="statement" id="statement">${prob.statement}</div>
          <button type="button" class="statement-toggle" id="toggle-statement">Hide the problem statement</button>
          <div id="part-stream"></div>
          <div id="takeaways"></div>
        </section>
        <aside class="sidebar">
          <div class="side-title">Parts</div>
          <ul class="partnav" id="partnav"></ul>
          <div class="side-title">Your solution</div>
          <div class="solution" id="solution"></div>
        </aside>
      </div>`;

    $('#toggle-statement').addEventListener('click', (e) => {
      const el = $('#statement'); const hidden = el.style.display === 'none';
      el.style.display = hidden ? '' : 'none';
      e.target.textContent = hidden ? 'Hide the problem statement' : 'Show the problem statement';
    });
    renderMath($('#statement'));
    renderPartNav();
    renderSolution(false);
    renderPart(ps.current);

    function stepKey(pi, si) { return pi + ':' + si; }
    function isStepDone(pi, si) {
      const step = prob.parts[pi].steps[si];
      if (!step) return false;
      if (step.type === 'note') return true;
      const a = ps.answers[stepKey(pi, si)];
      return !!(a && (a.correct || a.revealed));
    }
    function isPartComplete(pi) {
      const part = prob.parts[pi]; const st = partState(ps, pi);
      return st.revealed >= part.steps.length && part.steps.every((_, si) => isStepDone(pi, si));
    }
    function isProblemComplete() { return prob.parts.every((_, i) => isPartComplete(i)); }

    function renderPartNav() {
      const nav = $('#partnav');
      nav.innerHTML = prob.parts.map((part, i) => {
        const st = partState(ps, i); const total = part.steps.length; const complete = isPartComplete(i);
        return `<li><button type="button" class="${i === ps.current ? 'active ' : ''}${complete ? 'complete' : ''}" data-part="${i}">
          <span class="pill">${complete ? '✓' : Math.min(st.revealed, total) + '/' + total}</span>
          <span>${esc(part.label)}${part.title ? ' · ' + esc(part.title) : ''}</span></button></li>`;
      }).join('');
      nav.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        ps.current = +b.dataset.part; saveProgress(progress); renderPartNav(); renderPart(ps.current);
      }));
    }

    /* ---- the assembled solution ---- */
    function renderSolution(highlightLast) {
      const box = $('#solution'); if (!box) return;
      let html = ''; let any = false; let lastKey = null;
      prob.parts.forEach((part, pi) => {
        const st = partState(ps, pi);
        const lines = [];
        part.steps.forEach((step, si) => {
          if (si >= st.revealed || !step.solution) return;
          if (!isStepDone(pi, si)) return;
          lines.push({ key: stepKey(pi, si), html: step.solution });
        });
        if (!lines.length) return;
        any = true;
        html += `<div class="sol-part"><h4>${esc(part.label)}${part.title ? ' · ' + esc(part.title) : ''}</h4>` +
          lines.map(l => { lastKey = l.key; return `<div class="sol-line" data-key="${l.key}">${l.html}</div>`; }).join('') + `</div>`;
      });
      box.innerHTML = any ? html : `<div class="sol-empty">Your solution will be assembled here as you answer each step.</div>`;
      if (highlightLast && lastKey) {
        const el = box.querySelector(`[data-key="${lastKey}"]`);
        if (el) { el.classList.add('new'); el.scrollIntoView({ block: 'nearest' }); setTimeout(() => el.classList.remove('new'), 2500); }
      }
      renderMath(box);
    }

    function renderPart(pi) {
      const part = prob.parts[pi]; const st = partState(ps, pi);
      const stream = $('#part-stream');
      stream.innerHTML = `
        <h2 class="part-title"><span class="lbl">${esc(part.label)}</span>${part.title ? esc(part.title) : ''}</h2>
        ${part.question ? `<div class="part-question">${part.question}</div>` : ''}
        <div id="steps"></div>
        <div class="stream-actions" id="actions"></div>`;
      const stepsEl = $('#steps');
      const n = Math.min(st.revealed, part.steps.length);
      for (let si = 0; si < n; si++) stepsEl.appendChild(renderStep(pi, si));
      renderMath(stream); mountFigures(stream);
      renderActions(); renderTakeaways();
    }

    function renderActions() {
      const pi = ps.current; const part = prob.parts[pi]; const st = partState(ps, pi);
      const act = $('#actions');
      const lastIdx = Math.min(st.revealed, part.steps.length) - 1;
      const lastDone = isStepDone(pi, lastIdx);
      const remaining = part.steps.length - st.revealed;
      let html = '';
      if (st.revealed < part.steps.length) {
        html += `<button type="button" class="btn" id="continue" ${lastDone ? '' : 'disabled'}>Continue</button>
                 <span class="remaining">${lastDone ? '' : 'Answer above to continue · '}${remaining} step${remaining === 1 ? '' : 's'} left in this part</span>`;
      } else if (lastDone) {
        html += pi < prob.parts.length - 1
          ? `<button type="button" class="btn" id="next-part">Next: ${esc(prob.parts[pi + 1].label)}</button>`
          : `<span class="remaining">End of the last part.</span>`;
      } else {
        html += `<span class="remaining">Answer above to finish this part.</span>`;
      }
      act.innerHTML = html;
      const c = $('#continue');
      if (c) c.addEventListener('click', () => {
        st.revealed = Math.min(st.revealed + 1, part.steps.length); saveProgress(progress);
        const el = renderStep(pi, st.revealed - 1);
        $('#steps').appendChild(el); renderMath(el); mountFigures(el);
        renderActions(); renderPartNav(); renderSolution(true); renderTakeaways();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      const np = $('#next-part');
      if (np) np.addEventListener('click', () => {
        ps.current = pi + 1; saveProgress(progress); renderPartNav(); renderPart(ps.current);
        $('#part-stream').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    function renderTakeaways() {
      const box = $('#takeaways');
      if (!isProblemComplete()) { box.innerHTML = ''; return; }
      if (!ps.done) { ps.done = true; saveProgress(progress); renderPartNav(); }
      const s = scoreStats();
      box.innerHTML = `
        <div class="takeaways">
          <h2>What to take away</h2>
          <div class="score">${s.firstTry} of ${s.total} checkpoints right on the first try${s.revealed ? ` · ${s.revealed} revealed` : ''}</div>
          <ul>${(prob.takeaways || []).map(t => `<li>${t}</li>`).join('')}</ul>
          <div class="actions">
            ${next ? `<a class="btn" href="#/exam/${exam.id}/${next.id}">Next problem: ${esc(next.title)}</a>` : `<a class="btn" href="#/exam/${exam.id}">Back to ${esc(exam.title)}</a>`}
            <a class="btn ghost" href="#/playbook">Playbook</a>
            <button type="button" class="btn ghost" id="redo">Redo this problem</button>
          </div>
        </div>`;
      renderMath(box);
      $('#redo').addEventListener('click', () => { delete progress[exam.id + '/' + prob.id]; saveProgress(progress); viewProblem(exam, prob); });
    }
    function scoreStats() {
      let total = 0, firstTry = 0, revealed = 0;
      prob.parts.forEach((part, pi) => part.steps.forEach((s, si) => {
        if (s.type === 'note' || s.type === 'reveal') return;
        total++;
        const a = ps.answers[stepKey(pi, si)] || {};
        if (a.revealed) revealed++; else if (a.correct && a.attempts === 1) firstTry++;
      }));
      return { total, firstTry, revealed };
    }

    /* ---- one step ---- */
    function renderStep(pi, si) {
      const step = prob.parts[pi].steps[si];
      const key = stepKey(pi, si);
      const ans = ps.answers[key] || { attempts: 0, correct: false, revealed: false, picked: [] };
      const el = document.createElement('article');
      el.className = `step is-${step.type}`;
      el.dataset.step = key;

      let body = '';
      if (step.title) body += `<h3 class="step-title">${step.title}</h3>`;
      if (step.html && step.type !== 'reveal') body += `<div class="step-body">${step.html}</div>`;
      if (step.figure) body += figureHtml(step.figure);

      if (step.type === 'mcq') {
        if (step.quote) body += `<blockquote class="quote">${step.quote}</blockquote>`;
        body += `<div class="prompt">${step.prompt}</div>`;
        if (step.multi) body += `<div class="hint">Select every option that applies, then check.</div>`;
        body += `<div class="choices">` + step.choices.map((c, ci) =>
          `<button type="button" class="choice" data-ci="${ci}"><span class="key">${LETTERS[ci]}</span><span>${c.text}</span></button>`).join('') + `</div>`;
        if (step.multi) body += `<div class="inputrow"><button type="button" class="btn small" data-act="check-multi">Check</button></div>`;
        body += `<div class="fb"></div>`;
      } else if (step.type === 'input') {
        body += `<div class="prompt">${step.prompt}</div>
          ${step.hint ? `<div class="hint">${step.hint}</div>` : ''}
          <div class="inputrow">
            <input type="text" autocomplete="off" spellcheck="false" placeholder="${esc(step.placeholder || 'your answer')}" aria-label="answer">
            <button type="button" class="btn small" data-act="check-input">Check</button>
            <button type="button" class="btn ghost small" data-act="show-input" style="display:none">Show answer</button>
          </div>
          <div class="fb"></div>`;
      } else if (step.type === 'reveal') {
        body += `<div class="prompt">${step.prompt}</div>
          <div class="reveal-box"><button type="button" class="btn small" data-act="reveal">Reveal</button></div><div class="fb"></div>`;
      }
      body += `<div class="whybox"></div><div class="solbox"></div>`;
      el.innerHTML = body;

      const fb = $('.fb', el); const whybox = $('.whybox', el); const solbox = $('.solbox', el);
      function done() { return step.type === 'note' || ans.correct || ans.revealed; }
      function showWhy() {
        if (!done()) return;
        whybox.innerHTML = whyHtml(step);
        if (step.solution) solbox.innerHTML = `<div class="sol-inline"><span class="lbl">Added to your solution</span>${step.solution}</div>`;
      }
      function commit(highlight) { ps.answers[key] = ans; saveProgress(progress); renderActions(); renderPartNav(); renderSolution(highlight); renderTakeaways(); }

      if (step.type === 'mcq') {
        const buttons = [...el.querySelectorAll('.choice')];
        const correctSet = new Set(step.choices.map((c, i) => c.correct ? i : -1).filter(i => i >= 0));
        function lock() {
          buttons.forEach(b => {
            b.disabled = true; const ci = +b.dataset.ci;
            if (correctSet.has(ci)) b.classList.add('correct');
            else if (ans.picked.includes(ci)) b.classList.add('wrong');
            else b.classList.add('dim');
          });
          const extra = $('[data-act="check-multi"]', el); if (extra) extra.remove();
        }
        function fbHtml(ok, text, head) {
          return `<div class="feedback ${ok ? 'ok' : 'bad'}"><div class="fb-head">${head || (ok ? 'Correct' : 'Not quite')}</div><div>${text}</div></div>`;
        }
        function showAnswerButton() {
          if ($('[data-act="show-mcq"]', el)) return;
          fb.insertAdjacentHTML('beforeend', `<div class="inputrow"><button type="button" class="btn ghost small" data-act="show-mcq">Show the answer</button></div>`);
          $('[data-act="show-mcq"]', el).addEventListener('click', () => {
            ans.revealed = true; lock();
            const c = [...correctSet][0];
            fb.innerHTML = fbHtml(true, step.multi ? (step.feedback || '') : (step.choices[c].feedback || ''), 'Answer');
            showWhy(); renderMath(el); commit(true);
          });
        }
        if (!step.multi) {
          buttons.forEach(b => b.addEventListener('click', () => {
            const ci = +b.dataset.ci; ans.attempts++; ans.picked = [...new Set([...ans.picked, ci])];
            const ok = correctSet.has(ci);
            fb.innerHTML = fbHtml(ok, step.choices[ci].feedback || (ok ? 'Correct.' : 'Think again.'));
            if (ok) { ans.correct = true; lock(); showWhy(); }
            else { b.classList.add('wrong'); b.disabled = true; if (ans.attempts >= 2) showAnswerButton(); }
            renderMath(el); commit(ok);
          }));
        } else {
          buttons.forEach(b => b.addEventListener('click', () => b.classList.toggle('selected')));
          $('[data-act="check-multi"]', el).addEventListener('click', () => {
            const sel = buttons.filter(b => b.classList.contains('selected')).map(b => +b.dataset.ci);
            if (!sel.length) return;
            ans.attempts++; ans.picked = sel;
            const ok = sel.length === correctSet.size && sel.every(i => correctSet.has(i));
            if (ok) { ans.correct = true; lock(); fb.innerHTML = fbHtml(true, step.feedback || 'Exactly the right set.'); showWhy(); }
            else {
              const wrongPicked = sel.filter(i => !correctSet.has(i)); const missed = [...correctSet].filter(i => !sel.includes(i));
              let msg = '';
              if (wrongPicked.length) msg += `<p>${wrongPicked.map(i => LETTERS[i]).join(', ')} should not be selected. ${wrongPicked.map(i => step.choices[i].feedback || '').join(' ')}</p>`;
              if (missed.length) msg += `<p>You are missing ${missed.length} option${missed.length > 1 ? 's' : ''}.</p>`;
              fb.innerHTML = fbHtml(false, msg);
              if (ans.attempts >= 2) showAnswerButton();
            }
            renderMath(el); commit(ok);
          });
        }
        if (ans.correct || ans.revealed) {
          lock();
          const c = [...correctSet][0];
          fb.innerHTML = fbHtml(true, step.multi ? (step.feedback || '') : (step.choices[c].feedback || ''), ans.revealed ? 'Answer' : 'Correct');
          showWhy();
        } else if (ans.picked.length && !step.multi) {
          ans.picked.forEach(ci => { const b = buttons[ci]; if (b) { b.classList.add('wrong'); b.disabled = true; } });
        }
      }

      if (step.type === 'input') {
        const inp = $('input', el); const showBtn = $('[data-act="show-input"]', el);
        function finish() { inp.disabled = true; inp.classList.remove('bad'); inp.classList.add('ok'); const cb = $('[data-act="check-input"]', el); if (cb) cb.remove(); showBtn.remove(); showWhy(); }
        function check() {
          const raw = inp.value; if (!raw.trim()) return;
          ans.attempts++;
          const ok = checkInput(step, raw);
          if (ok) { ans.correct = true; fb.innerHTML = `<div class="feedback ok"><div class="fb-head">Correct</div><div>${step.feedback || ''}</div></div>`; finish(); }
          else { inp.classList.add('bad'); fb.innerHTML = `<div class="feedback bad"><div class="fb-head">Not quite</div><div>${step.wrong || 'Check the setup again and try once more.'}</div></div>`; if (ans.attempts >= 2) showBtn.style.display = ''; }
          renderMath(el); commit(ok);
        }
        $('[data-act="check-input"]', el).addEventListener('click', check);
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
        inp.addEventListener('input', () => inp.classList.remove('bad'));
        showBtn.addEventListener('click', () => {
          ans.revealed = true; inp.value = step.display || (step.answers && step.answers[0]) || String(step.numeric);
          fb.innerHTML = `<div class="feedback ok"><div class="fb-head">Answer</div><div>${step.feedback || ''}</div></div>`; finish(); renderMath(el); commit(true);
        });
        if (ans.correct || ans.revealed) {
          inp.value = step.display || (step.answers && step.answers[0]) || String(step.numeric);
          fb.innerHTML = `<div class="feedback ok"><div class="fb-head">${ans.revealed ? 'Answer' : 'Correct'}</div><div>${step.feedback || ''}</div></div>`; finish();
        }
      }

      if (step.type === 'reveal') {
        const btn = $('[data-act="reveal"]', el);
        function open() { $('.reveal-box', el).innerHTML = `<div class="reveal-content">${step.html}</div>`; showWhy(); }
        btn.addEventListener('click', () => { ans.revealed = true; ans.correct = true; open(); renderMath(el); mountFigures(el); commit(true); });
        if (ans.revealed || ans.correct) open();
      }

      if (step.type === 'note') showWhy();
      return el;
    }
  }

  /* ---------------- PLAYBOOK ---------------- */
  function viewPlaybook() {
    setNav('playbook');
    const pb = ORF309.playbook;
    if (!pb) { main.innerHTML = '<div class="empty">No playbook yet.</div>'; return; }
    const probLink = (ref) => {
      const [eid, pid] = ref.split('/');
      const ex = ORF309.exams.find(e => e.id === eid); const pr = ex && ex.problems.find(p => p.id === pid);
      return pr ? `<a href="#/exam/${eid}/${pid}">${esc(ex.short || ex.title)} · ${esc(pr.title)}</a>` : '';
    };
    const toc = `<nav class="toc">
        <div class="toc-h">Before you compute</div><a href="#pb-checklist">The setup checklist</a>
        <div class="toc-h">Moves</div>${pb.moves.map(m => `<a href="#${m.id}">${esc(m.title)}</a>`).join('')}
        <div class="toc-h">Grading</div><a href="#pb-redflags">Red flags</a></nav>`;
    const moves = pb.moves.map(m => `
      <article class="move" id="${m.id}">
        <h3>${esc(m.title)}</h3>
        <div class="when"><b>Reach for it when</b> ${m.when}</div>
        <div>${m.html}</div>
        ${figureHtml(m.figure)}
        <div class="box"><h5>Template</h5>${m.template}</div>
        <div class="box trap"><h5>Classic trap</h5>${m.trap}</div>
        ${m.seen && m.seen.length ? `<div class="seen">Seen in: ${m.seen.map(probLink).filter(Boolean).join('')}</div>` : ''}
      </article>`).join('');
    const flags = pb.redflags.map(f => `
      <div class="redflag"><div class="no"><h5>Marked wrong</h5>${f.no}</div><div class="yes"><h5>What graders want</h5>${f.yes}</div>${f.src ? `<div class="src">${f.src}</div>` : ''}</div>`).join('');
    main.innerHTML = `
      <div class="page-head narrow"><h1>The Playbook</h1><p class="sub">${pb.intro}</p></div>
      <div class="playbook-grid" style="margin-top:30px">
        ${toc}
        <div>
          <section class="checklist" id="pb-checklist">
            <h2 style="font-size:26px">${esc(pb.checklist.title)}</h2>
            <ol>${pb.checklist.items.map(it => `<li><div><b>${it.q}</b>${it.a}</div></li>`).join('')}</ol>
          </section>
          <h2 class="section-title">The moves</h2>
          ${moves}
          <h2 class="section-title" id="pb-redflags">Red flags, from the grading comments</h2>
          <div style="margin-top:14px">${flags}</div>
        </div>
      </div>`;
    renderMath(main); mountFigures(main);
  }

  /* ---------------- boot ---------------- */
  $('#reset-progress').addEventListener('click', () => {
    if (confirm('Reset all saved progress in this browser?')) { progress = {}; saveProgress(progress); route(); }
  });
  window.addEventListener('hashchange', route);
  route();
})();
