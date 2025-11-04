(() => {
  const els = {
    min: document.getElementById('min-input'),
    max: document.getElementById('max-input'),
    pickBtn: document.getElementById('pick-btn'),
    picked: document.getElementById('picked-number'),
    continueBtn: document.getElementById('continue-btn'),
  };

  function clampRange(min, max) {
    const a = Number.isFinite(+min) ? +min : 1;
    const b = Number.isFinite(+max) ? +max : 100;
    return a <= b ? [a, b] : [b, a];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let pickedNumber = null;

  els.pickBtn.addEventListener('click', () => {
    const [min, max] = clampRange(els.min.valueAsNumber, els.max.valueAsNumber);
    const n = randInt(min, max);
    pickedNumber = n;
    presentNumber(n);
    els.continueBtn.disabled = false;
  });

  els.continueBtn.addEventListener('click', () => {
    // Save to sessionStorage so cards page can read if needed later
    try {
      sessionStorage.setItem('pickedNumber', String(pickedNumber ?? ''));
      sessionStorage.setItem('range', JSON.stringify({
        min: els.min.value,
        max: els.max.value,
      }));
    } catch {}
    window.location.href = 'cards.html';
  });
  
  function presentNumber(n) {
    // Update text
    els.picked.textContent = String(n);
    // Trigger pop animation
    els.picked.classList.remove('animate-pop');
    // force reflow so animation can restart
    void els.picked.offsetWidth;
    els.picked.classList.add('animate-pop');

    // Confetti burst
    const wrap = els.picked.parentElement; // .confetti-wrap
    spawnConfetti(wrap, { count: 18 });
  }

  function spawnConfetti(container, { count = 16 } = {}) {
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];
    const rect = container.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'confetti';
      el.style.left = (rect.width / 2 - 5 + (Math.random() * 20 - 10)) + 'px';
      el.style.top = (rect.height / 2 - 5 + (Math.random() * 10 - 5)) + 'px';
      el.style.backgroundColor = colors[i % colors.length];
      // Random travel distance and rotation
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 80; // px
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const rot = (Math.random() * 360 - 180) + 'deg';
      el.style.setProperty('--dx', dx + 'px');
      el.style.setProperty('--dy', dy + 'px');
      el.style.setProperty('--rot', rot);
      container.appendChild(el);
      // Cleanup after animation
      el.addEventListener('animationend', () => {
        el.remove();
      }, { once: true });
    }
  }
})();
