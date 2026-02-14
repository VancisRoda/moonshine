/* ========================================
   Valentine SPA — Main Application Logic
   ======================================== */

(function () {
  'use strict';

  // --- Screen Navigation ---
  let currentScreen = 1;
  const totalScreens = 5;
  let emojiRainInterval = null;

  function showScreen(n) {
    // Stop rain when leaving screen 2
    if (currentScreen === 2 && n !== 2) stopEmojiRain();

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + n);
    if (target) {
      target.classList.add('active');
      currentScreen = n;
      // Trigger screen-specific effects
      if (n === 2) setTimeout(() => startEmojiRain(), 400);
      if (n === 5) setTimeout(() => startFinalEmojis(), 800);
    }
  }

  window.showScreen = showScreen;

  // --- Audio Controller ---
  let audioEl = null;
  let isPlaying = false;

  function initAudio() {
    audioEl = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    if (!audioEl || !musicBtn) return;

    musicBtn.addEventListener('click', toggleMusic);

    // Try autoplay on first user interaction
    document.addEventListener('click', function firstPlay() {
      if (!isPlaying) playMusic();
      document.removeEventListener('click', firstPlay);
    }, { once: true });

    document.addEventListener('touchstart', function firstTouch() {
      if (!isPlaying) playMusic();
      document.removeEventListener('touchstart', firstTouch);
    }, { once: true });
  }

  function playMusic() {
    if (!audioEl) return;
    audioEl.play().then(() => {
      isPlaying = true;
      updateMusicBtn();
    }).catch(() => { /* Blocked by browser policy, user will click btn */ });
  }

  function toggleMusic() {
    if (!audioEl) return;
    if (isPlaying) {
      audioEl.pause();
      isPlaying = false;
    } else {
      audioEl.play().then(() => { isPlaying = true; }).catch(() => { });
    }
    updateMusicBtn();
  }

  function updateMusicBtn() {
    const btn = document.getElementById('music-btn');
    if (!btn) return;
    btn.textContent = isPlaying ? '🔊' : '🎵';
    btn.classList.toggle('playing', isPlaying);
  }

  // --- Emoji Particle Engine ---
  const THEME_EMOJIS = ['💗', '💕', '✨', '💖', '❤️', '🌹', '💘', '🦋', '🌸'];
  const DOG_EMOJIS = ['🐕', '🐶', '🦴', '🐾', '🌭', '❤️'];
  const HEART_EMOJIS = ['❤️', '💕', '💖', '💗', '💘', '💝', '✨'];

  function spawnEmoji(emoji, x, y, className, duration) {
    const el = document.createElement('span');
    el.className = 'emoji-particle ' + (className || '');
    el.textContent = emoji;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--duration', (duration || 4) + 's');
    el.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (duration || 4) * 1000 + 200);
  }

  function startEmojiRain() {
    stopEmojiRain(); // clear any previous
    // Spawn a batch immediately, then repeat
    spawnRainBatch();
    emojiRainInterval = setInterval(spawnRainBatch, 5000);
  }

  function spawnRainBatch() {
    var count = 20;
    for (var i = 0; i < count; i++) {
      setTimeout(function () {
        if (currentScreen !== 2) return;
        var emoji = THEME_EMOJIS[Math.floor(Math.random() * THEME_EMOJIS.length)];
        var x = Math.random() * window.innerWidth;
        var dur = 3.5 + Math.random() * 3;
        spawnEmoji(emoji, x, -30, 'rain', dur);
      }, i * 250);
    }
  }

  function stopEmojiRain() {
    if (emojiRainInterval) {
      clearInterval(emojiRainInterval);
      emojiRainInterval = null;
    }
  }

  function burstEmojis(emojiSet, originX, originY, count) {
    count = count || 25;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const emoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
        const el = document.createElement('span');
        el.className = 'emoji-particle burst';
        el.textContent = emoji;
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const dist = 80 + Math.random() * 120;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 60;
        const dx2 = dx * 1.5;
        const dy2 = dy - 80;
        el.style.left = originX + 'px';
        el.style.top = originY + 'px';
        el.style.setProperty('--dx', dx + 'px');
        el.style.setProperty('--dy', dy + 'px');
        el.style.setProperty('--dx2', dx2 + 'px');
        el.style.setProperty('--dy2', dy2 + 'px');
        el.style.setProperty('--duration', (1.5 + Math.random()) + 's');
        el.style.fontSize = (1.2 + Math.random() * 1) + 'rem';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
      }, i * 60);
    }
  }

  window.burstEmojis = burstEmojis;
  window.HEART_EMOJIS = HEART_EMOJIS;
  window.DOG_EMOJIS = DOG_EMOJIS;

  function startFinalEmojis() {
    const count = 20;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + 20;
        spawnEmoji(emoji, x, y, '', 5 + Math.random() * 3);
      }, i * 300);
    }
  }

  // --- Button Handlers ---
  function onApproveMotion(e) {
    const rect = e.target.getBoundingClientRect();
    burstEmojis(HEART_EMOJIS, rect.left + rect.width / 2, rect.top);
    setTimeout(() => showScreen(3), 1200);
  }

  function onCanelaChoice(e) {
    const rect = e.target.getBoundingClientRect();
    burstEmojis(DOG_EMOJIS, rect.left + rect.width / 2, rect.top);
    setTimeout(() => showScreen(4), 1200);
  }

  function onContinueToFinal() {
    showScreen(5);
  }

  // --- Food Card Selection ---
  function initFoodCards() {
    const cards = document.querySelectorAll('.food-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });
  }

  // --- Init ---
  function init() {
    initAudio();
    initFoodCards();

    // Screen 2 buttons
    const btnYes = document.getElementById('btn-approve');
    if (btnYes) btnYes.addEventListener('click', onApproveMotion);

    // Screen 3 buttons
    document.querySelectorAll('.btn-canela').forEach(btn => {
      btn.addEventListener('click', onCanelaChoice);
    });

    // Screen 4 continue
    const btnContinue = document.getElementById('btn-continue-final');
    if (btnContinue) btnContinue.addEventListener('click', onContinueToFinal);

    // Start on screen 1
    showScreen(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
