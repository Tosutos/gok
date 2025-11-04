(() => {
  const els = {
    restartBtn: document.getElementById('restart-btn'),
    causeImg: document.getElementById('cause-img'),
    effectImg: document.getElementById('effect-img'),
    causeText: document.getElementById('cause-text'),
    effectText: document.getElementById('effect-text'),
    causeDrawBtn: document.getElementById('cause-draw-btn'),
    effectDrawBtn: document.getElementById('effect-draw-btn'),
  };

  const IMG_DIR = 'img';
  let causeIndices = Array.from({ length: 8 }, (_, i) => i + 1);
  let effectIndices = Array.from({ length: 8 }, (_, i) => i + 1);

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async function loadTextOrFallback(path, fallback) {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (!res.ok) throw new Error('Not OK');
      const txt = await res.text();
      return txt.trim() || fallback;
    } catch {
      return fallback;
    }
  }

  async function drawCause() {
    const idx = causeIndices[randInt(0, causeIndices.length - 1)];
    const imgPath = `${IMG_DIR}/cause_${idx}.png`;
    els.causeImg.src = imgPath;
    els.causeImg.alt = `원인 ${idx}`;
    const txt = await loadTextOrFallback(`${IMG_DIR}/cause_${idx}.txt`, `원인 ${idx}`);
    els.causeText.textContent = txt;
    if (els.causeDrawBtn) {
      // 첫 뽑기 후 버튼이 사진을 가리지 않도록 제거
      els.causeDrawBtn.style.display = 'none';
    }
  }

  async function drawEffect() {
    const idx = effectIndices[randInt(0, effectIndices.length - 1)];
    const imgPath = `${IMG_DIR}/effect_${idx}.png`;
    els.effectImg.src = imgPath;
    els.effectImg.alt = `결과 ${idx}`;
    const txt = await loadTextOrFallback(`${IMG_DIR}/effect_${idx}.txt`, `결과 ${idx}`);
    els.effectText.textContent = txt;
    if (els.effectDrawBtn) {
      // 첫 뽑기 후 버튼이 사진을 가리지 않도록 제거
      els.effectDrawBtn.style.display = 'none';
    }
  }

  els.restartBtn.addEventListener('click', () => {
    try {
      sessionStorage.removeItem('pickedNumber');
      sessionStorage.removeItem('range');
    } catch {}
    window.location.href = '/';
  });

  (async () => {
    try {
      const res = await fetch('/api/sets', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.cause) && data.cause.length) causeIndices = data.cause;
        if (Array.isArray(data.effect) && data.effect.length) effectIndices = data.effect;
      }
    } catch {}
    // Wait for user to click buttons
  })();

  els.causeDrawBtn?.addEventListener('click', drawCause);
  els.effectDrawBtn?.addEventListener('click', drawEffect);
})();
