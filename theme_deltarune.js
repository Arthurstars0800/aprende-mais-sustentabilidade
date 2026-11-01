/**
 * theme_deltarune.js
 * Integração 100% Nativa e Sem Conflitos com o Sistema de Temas do Aprende Mais
 *
 * Desbloqueio: Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)
 * Efeito Especial: STAR BLAZING (Inspirado no ataque estelar de Asriel Dreemurr)
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'drThemeUnlocked';

    // ── Limpeza Imediata de nós antigos órfãos ─────────────────────────────
    function cleanupOrphanNodes() {
        document.querySelectorAll('.dr-star').forEach(el => el.remove());
        const oldBtn = document.getElementById('drThemeBtn');
        if (oldBtn) oldBtn.remove();
    }
    cleanupOrphanNodes();

    // ══════════════════════════════════════════════════════════════
    // MOTOR DO EFEITO "STAR BLAZING" (Canvas 60fps)
    // ══════════════════════════════════════════════════════════════
    let _sbCanvas = null;
    let _sbCtx = null;
    let _sbAnimId = null;
    let _sbActive = false;
    let _sbLastSpawn = 0;

    const BLAZING_COLORS = [
        '#ffe600', // Dourado
        '#00f3ff', // Ciano
        '#ff388b', // Magenta
        '#ff9900', // Laranja
        '#ffffff', // Branco
        '#a855f7'  // Violeta
    ];

    let blazingStars = [];
    let starShards = [];

    function initStarBlazingCanvas() {
        if (_sbCanvas) return;
        _sbCanvas = document.createElement('canvas');
        _sbCanvas.id = 'starBlazingCanvas';
        _sbCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
        document.body.appendChild(_sbCanvas);
        _sbCtx = _sbCanvas.getContext('2d');
        resizeStarBlazingCanvas();
        window.addEventListener('resize', resizeStarBlazingCanvas);

        // Clique interativo: Detona um impacto do Star Blazing onde clicar!
        document.addEventListener('click', function (e) {
            if (!_sbActive) return;
            createStarBurst(e.clientX, e.clientY, BLAZING_COLORS[Math.floor(Math.random() * BLAZING_COLORS.length)], 14);
        });
    }

    function resizeStarBlazingCanvas() {
        if (!_sbCanvas) return;
        _sbCanvas.width = window.innerWidth;
        _sbCanvas.height = window.innerHeight;
    }

    function drawPixelStar(ctx, x, y, size, color, rot = 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = size * 1.2;

        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.quadraticCurveTo(0, 0, size, 0);
        ctx.quadraticCurveTo(0, 0, 0, size);
        ctx.quadraticCurveTo(0, 0, -size, 0);
        ctx.quadraticCurveTo(0, 0, 0, -size);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    function spawnBlazingStar() {
        const color = BLAZING_COLORS[Math.floor(Math.random() * BLAZING_COLORS.length)];

        // 1. Surge de cima: posição X cobrindo 100% da tela + margens
        const startX = Math.random() * (window.innerWidth + 160) - 80;
        const startY = -40 - Math.random() * 30;

        // 2. Linha reta indo para baixo:
        // Ângulo aleatorizado apontando sempre para baixo (entre ~30° e ~150°, centro em 90° = vertical para baixo)
        const angle = (Math.PI / 2) + (Math.random() - 0.5) * (Math.PI * 0.68);

        // Velocidade e rotação variadas
        const speed = 6 + Math.random() * 7;
        const vx = Math.cos(angle) * speed;
        const vy = Math.abs(Math.sin(angle) * speed); // Garante 100% que vai para baixo em linha reta

        // Altura aleatória para detonação estelar
        const targetY = window.innerHeight * (0.3 + Math.random() * 0.7);

        blazingStars.push({
            x: startX,
            y: startY,
            vx: vx,
            vy: vy,
            targetY: targetY,
            size: 14 + Math.random() * 14,
            rot: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.25,
            color: color,
            trail: []
        });
    }

    function createStarBurst(x, y, color, count = 12) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.4;
            const speed = 3 + Math.random() * 6;
            starShards.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 5 + Math.random() * 6,
                color: Math.random() > 0.3 ? color : '#ffffff',
                alpha: 1,
                decay: 0.02 + Math.random() * 0.02,
                rot: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.3
            });
        }
    }

    function starBlazingLoop(timestamp) {
        if (!_sbActive) return;

        _sbCtx.clearRect(0, 0, _sbCanvas.width, _sbCanvas.height);

        const isCompact = window.gamification && window.gamification.userProfile && window.gamification.userProfile.compactMode;
        const spawnDelay = isCompact ? 650 : 300;

        // Spawn múltiplas estrelas em rajadas — a cada 300ms (ou 650ms em modo compacto)
        if (timestamp - _sbLastSpawn > spawnDelay) {
            const burst = isCompact ? 1 : (Math.random() < 0.35 ? (Math.random() < 0.5 ? 3 : 2) : 1);
            for (let b = 0; b < burst; b++) spawnBlazingStar();
            _sbLastSpawn = timestamp;
        }

        // 1. Estrelas cadentes principais
        for (let i = blazingStars.length - 1; i >= 0; i--) {
            const s = blazingStars[i];
            s.x += s.vx;
            s.y += s.vy;
            s.rot += s.rotSpeed;

            s.trail.push({ x: s.x, y: s.y, alpha: 0.8, size: s.size * 0.6 });
            if (s.trail.length > 8) s.trail.shift();

            for (let t = 0; t < s.trail.length; t++) {
                const tr = s.trail[t];
                tr.alpha -= 0.07;
                if (tr.alpha > 0) {
                    _sbCtx.save();
                    _sbCtx.globalAlpha = tr.alpha;
                    drawPixelStar(_sbCtx, tr.x, tr.y, tr.size * (t / s.trail.length), s.color, s.rot);
                    _sbCtx.restore();
                }
            }

            drawPixelStar(_sbCtx, s.x, s.y, s.size, s.color, s.rot);

            if (s.y >= s.targetY || s.y > window.innerHeight + 50 || s.x < -120 || s.x > window.innerWidth + 120) {
                if (s.y <= window.innerHeight + 10 && s.x >= -30 && s.x <= window.innerWidth + 30) {
                    createStarBurst(s.x, s.y, s.color, isCompact ? 6 : 14);
                }
                blazingStars.splice(i, 1);
            }
        }

        // 2. Fragmentos estelares
        for (let j = starShards.length - 1; j >= 0; j--) {
            const sh = starShards[j];
            sh.x += sh.vx;
            sh.y += sh.vy;
            sh.vx *= 0.94;
            sh.vy *= 0.94;
            sh.rot += sh.rotSpeed;
            sh.alpha -= sh.decay;

            if (sh.alpha <= 0) {
                starShards.splice(j, 1);
            } else {
                _sbCtx.save();
                _sbCtx.globalAlpha = sh.alpha;
                drawPixelStar(_sbCtx, sh.x, sh.y, sh.size, sh.color, sh.rot);
                _sbCtx.restore();
            }
        }

        _sbAnimId = requestAnimationFrame(starBlazingLoop);
    }

    function startStarBlazing() {
        if (_sbActive) return;
        _sbActive = true;
        initStarBlazingCanvas();
        _sbAnimId = requestAnimationFrame(starBlazingLoop);
    }

    function stopStarBlazing() {
        _sbActive = false;
        if (_sbAnimId) cancelAnimationFrame(_sbAnimId);
        _sbAnimId = null;
        if (_sbCtx && _sbCanvas) _sbCtx.clearRect(0, 0, _sbCanvas.width, _sbCanvas.height);
        blazingStars = [];
        starShards = [];
    }

    // Expõe globalmente para que gamification.js possa controlar
    window.startStarBlazing = startStarBlazing;
    window.stopStarBlazing  = stopStarBlazing;

    // ── Resposta Nativa a Mudanças de Tema ─────────────────────────────────
    // O Star Blazing agora é controlado EXCLUSIVAMENTE por gamification.js
    // via window.startStarBlazing / window.stopStarBlazing.
    // O tema Dark/Light World NÃO inicia o Star Blazing automaticamente.
    window.onThemeApplied = function (themeId) {
        broadcastToIframes(themeId === 'theme-deltarune');
    };

    function broadcastToIframes(active) {
        const isDark = document.body.classList.contains('dark-mode');
        const msg = active
            ? { type: 'DR_THEME_ON', dark: isDark }
            : { type: 'DR_THEME_OFF' };
        document.querySelectorAll('iframe').forEach(f => {
            try { f.contentWindow.postMessage(msg, '*'); } catch (e) {}
        });
    }

    // ── Chiptune Sound ─────────────────────────────────────────────────────
    function playUnlockSFX() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'square';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.09, ctx.currentTime + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.08);
                osc.stop(ctx.currentTime + i * 0.08 + 0.22);
            });
        } catch (e) {}
    }

    function showUnlockToast(msg, subtitle) {
        document.getElementById('dr-unlock-toast')?.remove();

        const toast = document.createElement('div');
        toast.id = 'dr-unlock-toast';
        toast.innerHTML = `
            <span class="toast-star">★</span>
            <span class="toast-title">${msg}</span>
            <span class="toast-msg">${subtitle}</span>
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('show'));
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 4500);
    }

    // ── Konami Code Sequence (Desbloqueio Limpo e Seguro) ───────────────────
    const KONAMI = [
        'ArrowUp','ArrowUp',
        'ArrowDown','ArrowDown',
        'ArrowLeft','ArrowRight',
        'ArrowLeft','ArrowRight',
        'b','a'
    ];
    let konamiPos = 0;

    document.addEventListener('keydown', function (e) {
        const key = e.key.toLowerCase() === 'arrowup'    ? 'ArrowUp'
                  : e.key.toLowerCase() === 'arrowdown'  ? 'ArrowDown'
                  : e.key.toLowerCase() === 'arrowleft'  ? 'ArrowLeft'
                  : e.key.toLowerCase() === 'arrowright' ? 'ArrowRight'
                  : e.key.toLowerCase();

        if (key === KONAMI[konamiPos]) {
            konamiPos++;
            if (konamiPos === KONAMI.length) {
                konamiPos = 0;
                localStorage.setItem(STORAGE_KEY, '1');
                playUnlockSFX();

                // Desbloqueia e equipa o efeito Star Blazing
                if (typeof userProfile !== 'undefined' && userProfile.unlockedItems) {
                    if (!userProfile.unlockedItems.includes('effect_star_blazing')) {
                        userProfile.unlockedItems.push('effect_star_blazing');
                    }
                    if (typeof saveProgress === 'function') saveProgress();
                }

                if (typeof equipItem === 'function') {
                    equipItem('effects', 'effect_star_blazing', true);
                } else {
                    startStarBlazing();
                }
                showUnlockToast('STAR BLAZING DESBLOQUEADO!', '🌠 Ataque estelar liberado na Eco Loja!');
            }
        } else {
            konamiPos = (key === KONAMI[0]) ? 1 : 0;
        }
    });

    function initOnLoad() {
        cleanupOrphanNodes();
        const oldCastleCanvas = document.getElementById('drCastlePixelCanvas');
        if (oldCastleCanvas) oldCastleCanvas.remove();
        document.body.classList.remove('theme-deltarune', 'dr-world-home', 'dr-world-quizes', 'dr-world-minigames', 'dr-world-reciclagem', 'dr-world-oficina');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOnLoad);
    } else {
        initOnLoad();
    }
})();
