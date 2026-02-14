/* ========================================
   Tinder-style Logic
   ======================================== */
(function () {
    'use strict';

    const PHOTOS = [
        'img/image.jpg',
        'img/Screenshot_20260213_234758_Instagram.jpg',
        'img/Screenshot_20260213_234807_Instagram.jpg',
        'img/Screenshot_20260213_234818_Instagram.jpg',
        'img/Screenshot_20260213_234834_Instagram.jpg'
    ];

    let currentPhotoIndex = 0;

    function init() {
        // Render initial card
        renderNextCard();

        // Start loop: 1 photo per second
        setInterval(autoSwipe, 1200);

        // Show match banner immediately
        const banner = document.getElementById('match-banner');
        if (banner) banner.style.display = 'block';
    }

    function createCard(src) {
        const el = document.createElement('div');
        el.className = 't-card'; // initial state
        el.innerHTML = `
      <img src="${src}" class="t-card-img" draggable="false" />
      <div class="t-info-overlay">
        <div class="t-name">Lu <span class="t-age">24</span></div>
        <div class="t-dist">📍 1245 km</div>
      </div>
      <div class="like-stamp">LIKE</div>
    `;
        return el;
    }

    function renderNextCard() {
        const container = document.getElementById('tinder-card-container');
        if (!container) return;

        // Create Next Card
        const card = createCard(PHOTOS[currentPhotoIndex]);

        // Insert at bottom of visual stack (first child if valid z-index, or insertBefore current)
        // Actually, for stack: Last Child = Top. First Child = Bottom.
        // So if we have a Top Card, we want to insert the Next Card *before* it (visually behind).
        // If container is empty, append.

        if (container.firstElementChild) {
            container.insertBefore(card, container.firstElementChild);
        } else {
            container.appendChild(card);
        }

        // Determine next index
        currentPhotoIndex = (currentPhotoIndex + 1) % PHOTOS.length;
    }

    function autoSwipe() {
        const container = document.getElementById('tinder-card-container');
        if (!container) return;

        // The visual "Top" card is the Last Child
        const currentCard = container.lastElementChild;
        if (!currentCard) {
            renderNextCard();
            return;
        }

        // 1. Prepare the Card Behind (Next Iteration)
        // We render it BEFORE we swipe, so it's ready.
        renderNextCard();

        // 2. Animate Current Card
        // Show Stamp
        const stamp = currentCard.querySelector('.like-stamp');
        if (stamp) {
            stamp.style.opacity = '1';
            stamp.style.transform = 'rotate(-15deg) scale(1.1)';
        }

        // Swipe Right
        setTimeout(() => {
            currentCard.classList.add('swipe-right');

            // Remove after animation
            setTimeout(() => {
                if (currentCard.parentNode) currentCard.remove();
            }, 800);
        }, 200); // short delay to see the stamp
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
