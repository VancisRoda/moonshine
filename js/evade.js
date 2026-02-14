/* ========================================
   Evasive "Vetar resolución" Button
   ======================================== */

(function () {
    'use strict';

    function initEvade() {
        const btn = document.getElementById('btn-veto');
        if (!btn) return;

        function evade() {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const btnW = btn.offsetWidth;
            const btnH = btn.offsetHeight;

            // Ensure button stays fully visible with some padding
            const pad = 10;
            const maxX = vw - btnW - pad;
            const maxY = vh - btnH - pad;

            let newX, newY;
            const currentX = parseFloat(btn.style.left) || vw / 2;
            const currentY = parseFloat(btn.style.top) || vh / 2;

            // Move at least 30% of viewport away from current position
            do {
                newX = pad + Math.random() * maxX;
                newY = pad + Math.random() * maxY;
            } while (
                Math.abs(newX - currentX) < vw * 0.2 &&
                Math.abs(newY - currentY) < vh * 0.2
            );

            btn.style.left = newX + 'px';
            btn.style.top = newY + 'px';
        }

        // Position the button initially in a normal-ish place
        btn.style.position = 'fixed';
        btn.style.zIndex = '100';

        // Attach evade listeners
        btn.addEventListener('mouseover', evade);
        btn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            evade();
        }, { passive: false });

        // Also evade on focus (for keyboard users trying to tab to it)
        btn.addEventListener('focus', evade);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEvade);
    } else {
        initEvade();
    }
})();
