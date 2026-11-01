let gameInterval;
let score = 0;
let timeLeft = 10;
let lives = 3;
let isGameActive = false;
let currentLevel = 1;
let itemsLeftInWave = 0;

let selectedWaste = null;
let isDragging = false;
let dragX, dragY; 
let initialX, initialY;

// --- Memória State ---
let flippedCards = [];
let matchedPairs = 0;
let memoryScore = 0;
let memoryLevel = 1;

const WASTE_TYPES = [
    { name: 'Garrafa PET', type: 'plastic', color: '#ef4444', icon: '🍶' },
    { name: 'Papelão', type: 'paper', color: '#3b82f6', icon: '📦' },
    { name: 'Vidro', type: 'glass', color: '#22c55e', icon: '🍷' },
    { name: 'Latinha', type: 'metal', color: '#eab308', icon: '🥫' }
];

const MEMORY_PAIRS = [
    { id: 1, icon: '🗑️', type: 'seco', label: 'Lixo Seco' },
    { id: 1, icon: '📦', type: 'seco', label: 'Papel/Papelão' },
    { id: 2, icon: '🍷', type: 'glass', label: 'Vidro' },
    { id: 2, icon: '🥃', type: 'glass', label: 'Taça/Tulipa' },
    { id: 3, icon: '🍎', type: 'org', label: 'Orgânico' },
    { id: 3, icon: '🍗', type: 'org', label: 'Resto Comida' },
    { id: 4, icon: '🥫', type: 'metal', label: 'Metal' },
    { id: 4, icon: '🍴', type: 'metal', label: 'Talher/Lata' },
    { id: 5, icon: '🥤', type: 'plastic', label: 'Plástico' },
    { id: 5, icon: '🧴', type: 'plastic', label: 'Embalagem' },
    { id: 6, icon: '🔋', type: 'danger', label: 'Perigoso' },
    { id: 6, icon: '💡', type: 'danger', label: 'Lâmpada/Pilha' },
    { id: 7, icon: '🥛', type: 'special', label: 'Tetrapak' },
    { id: 7, icon: '🧱', type: 'special', label: 'Telha Ecológ.' },
    { id: 8, icon: '📻', type: 'eletron', label: 'Eletrônico' },
    { id: 8, icon: '💻', type: 'eletron', label: 'Sucata TI' }
];

const BINS = {
    plastic: { name: 'Plástico', color: '#ef4444', icon: 'fa-bottle-water' },
    paper: { name: 'Papel', color: '#3b82f6', icon: 'fa-scroll' },
    glass: { name: 'Vidro', color: '#22c55e', icon: 'fa-wine-glass' },
    metal: { name: 'Metal', color: '#eab308', icon: 'fa-magnet' }
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPopSound(type = 'correct') {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    if (type === 'correct') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    } else if (type === 'error') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    } else if (type === 'nextLevel') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    }
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
}

// Sets gradient text on an element via DOM — bulletproof, no shorthand issues
function applyGradient(el, c1, c2) {
    if (!el) return;
    el.style.backgroundImage = `linear-gradient(135deg, ${c1}, ${c2})`;
    el.style.webkitBackgroundClip = 'text';
    el.style.backgroundClip = 'text';
    el.style.webkitTextFillColor = 'transparent';
    el.style.color = 'transparent';
}

function startCatchGame() {
    showModernSplash({
        badge: 'Resíduos & Reciclagem',
        heroIcon: '♻️',
        title: 'Coleta Seletiva',
        subtitle: 'Ajude a limpar o planeta descartando cada material na lixeira correta!',
        rules: [
            { icon: '👀', title: 'Fique Atento', desc: 'Resíduos de diferentes materiais vão surgir na tela!' },
            { icon: '⚡', title: 'Aja Rápido', desc: 'Arraste cada material para sua lixeira correspondente.' },
            { icon: '⏳', title: 'Sobrevivência', desc: 'Não deixe o tempo esgotar e proteja suas vidas!' }
        ],
        chipsLabel: 'Lixeiras de Descarte',
        chips: [
            { icon: '🍶', label: 'Plástico', colorClass: 'chip-red' },
            { icon: '📦', label: 'Papel', colorClass: 'chip-blue' },
            { icon: '🍷', label: 'Vidro', colorClass: 'chip-green' },
            { icon: '🥫', label: 'Metal', colorClass: 'chip-yellow' }
        ],
        onStart: 'initCatchGame()'
    });
}

function startMemoryGame() {
    showModernSplash({
        badge: 'Biodiversidade',
        heroIcon: '🃏',
        title: 'Memória da Natureza',
        subtitle: 'Exercite sua mente memorizando pares de materiais e elementos ecológicos!',
        rules: [
            { icon: '👆', title: 'Revelar', desc: 'Clique em qualquer carta para descobrir o símbolo escondido.' },
            { icon: '🧩', title: 'Formar Pares', desc: 'Encontre o par correspondente de cada material reciclável.' },
            { icon: '⏱️', title: 'Velocidade', desc: 'Limpe todo o tabuleiro antes que o cronômetro zere!' }
        ],
        chipsLabel: 'Exemplos de Pares',
        chips: [
            { icon: '🗑️', label: 'Seco', colorClass: 'chip-blue' },
            { icon: '🍷', label: 'Vidro', colorClass: 'chip-green' },
            { icon: '🔋', label: 'Perigo', colorClass: 'chip-yellow' },
            { icon: '🥤', label: 'Plástico', colorClass: 'chip-red' }
        ],
        onStart: 'memoryLevel=1; initMemoryGame()'
    });
}

function closeGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    const stage = document.getElementById('gameStage');
    if (stage) {
        stage.style.display = 'none';
        stage.classList.remove('splash-active', 'game-active-mode');
    }
    const canvas = document.getElementById('gameCanvas');
    if (canvas) canvas.innerHTML = '';
}

function loadIframe(src) {
    const gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:12px;background:transparent;';
    
    // Make the iframe feel native by auto-starting and hiding its own splash
    iframe.onload = () => {
        try {
            const iwin = iframe.contentWindow;
            const idoc = iwin.document;
            
            // Hide internal splash overlay
            const overlay = idoc.getElementById('overlay');
            if (overlay) overlay.style.display = 'none';
            
            // Click start button if it exists
            const startBtn = idoc.getElementById('startBtn') || idoc.querySelector('.pbtn') || idoc.querySelector('.btn-start');
            if (startBtn) startBtn.click();

            // Intercept internal game over to trigger external one if needed
            // (For now, we let them handle their own game over, but hide the 'Voltar' link)
            idoc.querySelectorAll('a[href="index.html"], a.blink').forEach(a => {
                a.style.display = 'none';
            });
        } catch(e) {
            console.warn("Could not modify iframe (cross-origin or timing issue):", e);
        }
    };
    
    gameCanvas.appendChild(iframe);
}

function openStage(showHud = false) {
    const stage = document.getElementById('gameStage');
    stage.style.display = 'flex';
    stage.scrollIntoView({ behavior: 'smooth' });
    if (!showHud) {
        stage.classList.add('splash-active');
        stage.classList.remove('game-active-mode');
    } else {
        stage.classList.remove('splash-active');
        stage.classList.add('game-active-mode');
    }
}

function showModernSplash(config) {
    openStage(false);
    const canvas = document.getElementById('gameCanvas');
    
    const rulesHtml = (config.rules || []).map(r => `
        <div class="rule-card">
            <div class="rule-card-icon">${r.icon || '✨'}</div>
            <h4>${r.title}</h4>
            <p>${r.desc}</p>
        </div>
    `).join('');

    const chipsHtml = (config.chips || []).map(c => `
        <div class="game-chip-pill ${c.colorClass || ''}">
            <span>${c.icon}</span>
            <span>${c.label}</span>
        </div>
    `).join('');

    const elementsBox = chipsHtml ? `
        <div class="splash-elements-box">
            <span class="splash-elements-label">${config.chipsLabel || 'Elementos em Jogo'}</span>
            <div class="splash-chips-row">${chipsHtml}</div>
        </div>
    ` : '';

    canvas.innerHTML = `
        <div class="game-instructions modern-splash ${config.customClass || ''}">
            <button class="splash-close-btn" onclick="closeGame()" title="Fechar">&times;</button>
            <div class="splash-header">
                <span class="splash-badge-pill">${config.badge || 'Arcade Ecológico'}</span>
                <h2 class="splash-title">${config.title}</h2>
                <p class="splash-subtitle">${config.subtitle}</p>
            </div>

            <div class="splash-body">
                ${elementsBox}
                <div class="rules-grid">${rulesHtml}</div>
            </div>

            <div class="splash-footer">
                <button class="splash-start-btn" onclick="openStage(true); ${config.onStart}">
                    <i class="fas fa-play"></i> Começar Jogo
                </button>
            </div>
        </div>
    `;
}


// Adaptive Game HUD Configuration
window.configureGameHUD = function(config = {}) {
    const lvlEl = document.getElementById('levelBadge');
    const scrEl = document.getElementById('scoreBadge');
    const livEl = document.getElementById('livesBadge');
    const timEl = document.getElementById('timeBadge');
    if (lvlEl) lvlEl.style.display = config.showLevel === false ? 'none' : 'flex';
    if (scrEl) scrEl.style.display = config.showScore === false ? 'none' : 'flex';
    if (livEl) livEl.style.display = config.showLives === false ? 'none' : 'flex';
    if (timEl) timEl.style.display = config.showTime === false ? 'none' : 'flex';
};

// Unified Modern Victory / Defeat Screen
function showModernResult(config) {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    // Hide stats in header during result screen
    const stage = document.getElementById('gameStage');
    if (stage) {
        stage.classList.add('splash-active');
        stage.classList.remove('game-active-mode');
    }

    const statsHtml = (config.stats || []).map(s => `
        <div class="result-stat-box ${s.highlight ? 'highlight' : ''}">
            <span class="result-stat-label">${s.label}</span>
            <div class="result-stat-value">
                ${s.icon ? `<span>${s.icon}</span>` : ''}
                <span>${s.value}</span>
            </div>
        </div>
    `).join('');

    canvas.innerHTML = `
        <div class="game-instructions modern-result ${config.type || 'win'}">
            <span class="result-badge">${config.badge || (config.type === 'win' ? 'Vitória Ecológica' : 'Fim de Jogo')}</span>
            <div class="result-icon">${config.heroIcon || (config.type === 'win' ? '🏆' : '🥀')}</div>
            <h2 class="result-title">${config.title}</h2>
            <p class="result-subtitle">${config.subtitle || ''}</p>
            
            <div class="result-stats-grid">
                ${statsHtml}
            </div>

            <div class="result-actions">
                <button class="result-btn result-btn-secondary" onclick="closeGame()">
                    <i class="fas fa-arrow-left"></i> Minigames
                </button>
                <button class="result-btn result-btn-primary" onclick="openStage(true); ${config.onRestart}">
                    <i class="fas fa-rotate-right"></i> ${config.restartLabel || 'Jogar Novamente'}
                </button>
            </div>
        </div>
    `;
}
window.showModernResult = showModernResult;

// Backward-compatible alias
window.addLeaves = function(xp, reason) {
    if (window.gamification) window.gamification.addXp(xp, reason ? '(' + reason + ')' : '(Minigame)');
};

function handleIframeGameResult(data) {
    if (!data) return;
    if (data.game === 'gari') {
        const xp = data.xp || Math.max(15, Math.floor((data.score || 0) / 4));
        if (window.gamification) window.gamification.addXp(xp, "(Gari Aquático)");
        showModernResult({
            type: data.win ? 'win' : 'lose',
            badge: data.win ? 'Recifes Preservados' : (data.reason === 'shark' ? 'Ataque do Tubarão!' : 'Cardume Agitado'),
            heroIcon: data.win ? '🤿' : (data.reason === 'shark' ? '🦈' : '🐟'),
            title: data.win ? 'Oceano Despoluído!' : 'Mergulho Interrompido!',
            subtitle: data.win 
                ? 'Você recolheu todo o lixo marinho com maestria e salvou o recife.' 
                : (data.reason === 'shark' ? 'O tubarão te pegou! Mantenha distância máxima dos predadores.' : 'Muitos peixes foram feridos. Nade com mais cuidado nas próximas águas.'),
            stats: [
                { label: 'Pontuação', value: data.score || 0, icon: '⭐' },
                { label: 'XP Conquistado', value: `+${xp} XP`, highlight: true, icon: '🌿' },
                { label: 'Lixo Recolhido', value: `${data.collected || 0}/${data.totalTrash || 0}`, icon: '🗑️' }
            ],
            onRestart: "launchGameFile('gari.html')",
            restartLabel: 'Mergulhar Novamente'
        });
    } else if (data.game === 'vazamento') {
        const xp = data.xp || Math.max(15, Math.floor((data.score || 0) / 4));
        if (window.gamification) window.gamification.addXp(xp, "(Caça ao Vazamento)");
        showModernResult({
            type: data.win ? 'win' : 'lose',
            badge: data.win ? 'Planta Florescendo' : 'Água Desperdiçada',
            heroIcon: data.win ? '🌻' : '💦',
            title: data.win ? 'Cultivo Sustentável!' : 'Inundação no Solo!',
            subtitle: data.win 
                ? 'Você coletou as gotas com rapidez e utilizou a água para nutrir a vida vegetal!' 
                : 'Muitas gotas caíram fora do vaso e alagaram o piso. Fique atento aos gotejamentos.',
            stats: [
                { label: 'Pontuação', value: data.score || 0, icon: '⭐' },
                { label: 'XP Conquistado', value: `+${xp} XP`, highlight: true, icon: '🌿' },
                { label: 'Crescimento', value: `${data.plantGrowth || 100}%`, icon: '🌱' }
            ],
            onRestart: "launchGameFile('vazamento.html')",
            restartLabel: 'Consertar Novamente'
        });
    } else if (data.game === 'incendio') {
        const xp = data.xp || Math.max(20, Math.floor((data.score || 0) * 4));
        if (window.gamification) window.gamification.addXp(xp, "(Incêndio Zero)");
        showModernResult({
            type: data.win ? 'win' : 'lose',
            badge: data.win ? 'Defesa Heroica' : 'Fumaça Crítica',
            heroIcon: data.win ? '🌳' : '🔥',
            title: data.win ? 'Reserva Protegida!' : 'Floresta Sufocada!',
            subtitle: data.win 
                ? 'Você manteve os focos sob controle com maestria e evitou que a poluição tomasse o céu!' 
                : 'A poluição atingiu 100% e as chamas sufocaram a mata. Tente agir ainda mais rápido!',
            stats: [
                { label: 'Árvores Salvas', value: data.score || 0, icon: '🌲' },
                { label: 'XP Conquistado', value: `+${xp} XP`, highlight: true, icon: '🌿' },
                { label: 'Sobrevivência', value: data.survivalTime || `${data.score || 0}s`, icon: '⏱️' }
            ],
            onRestart: "launchGameFile('incendio.html')",
            restartLabel: 'Decolar Novamente'
        });
    }
}

// Global HUD updater — called directly when games run inline
window.__updateHUD = function(data) {
    if (!data || data.type !== 'UPDATE_HUD') return;
    if (data.score !== undefined) {
        const el = document.getElementById('gameScore');
        if (el) {
            el.textContent = data.score;
            // Score pop animation
            el.classList.remove('score-pop');
            void el.offsetWidth; // reflow
            el.classList.add('score-pop');
            setTimeout(() => el.classList.remove('score-pop'), 350);
        }
    }
    if (data.level !== undefined) {
        const el = document.getElementById('gameLevel');
        if (el) el.textContent = data.level;
    }
    if (data.time !== undefined) {
        const el = document.getElementById('gameTime');
        const timeBadge = document.getElementById('timeBadge');
        if (el) el.textContent = data.time;
        // Time danger visual at <= 10 seconds
        if (timeBadge) {
            const t = parseInt(data.time, 10);
            if (!isNaN(t) && t <= 10) {
                timeBadge.classList.add('time-danger');
            } else {
                timeBadge.classList.remove('time-danger');
            }
        }
    }
    if (data.lives !== undefined) {
        const livesEl = document.getElementById('gameLives');
        const livesBadge = document.getElementById('livesBadge');
        if (data.lives === false || data.lives === '') {
            if (livesBadge) livesBadge.style.display = 'none';
        } else {
            if (livesBadge) livesBadge.style.display = 'flex';
            if (livesEl) {
                if (typeof data.lives === 'number') {
                    livesEl.innerHTML = '❤️'.repeat(Math.max(0, data.lives)) + '🩶'.repeat(Math.max(0, 3 - data.lives));
                } else {
                    livesEl.innerHTML = data.lives;
                }
            }
        }
    }
};

// Listen for postMessage from iframes AND from same-page dispatches
window.addEventListener('message', (e) => {
    if (!e.data) return;
    if (e.data.type === 'UPDATE_HUD') {
        window.__updateHUD(e.data);
    } else if (e.data.type === 'GAME_RESULT') {
        handleIframeGameResult(e.data);
    }
});

function startPescadorGame() {
    showModernSplash({
        badge: 'Preservação Marinha',
        heroIcon: '🎣',
        title: 'Pescador Ecológico',
        subtitle: 'Limpe os oceanos resgatando o lixo submarino sem machucar os peixes!',
        rules: [
            { icon: '🚢', title: 'Navegação', desc: 'Mova o barco com o mouse ou toque para mirar com precisão.' },
            { icon: '🪝', title: 'Lançar Anzol', desc: 'Clique ou toque para lançar a linha no fundo do mar.' },
            { icon: '🐠', title: 'Proteger Vidas', desc: 'Cuidado redobrado: pescar animais marinhos custa vidas!' }
        ],
        chipsLabel: 'Mecânicas da Pesca',
        chips: [
            { icon: '🚢', label: 'Barco', colorClass: 'chip-cyan' },
            { icon: '🪝', label: 'Anzol', colorClass: 'chip-blue' },
            { icon: '🗑️', label: 'Pesque Lixo', colorClass: 'chip-green' },
            { icon: '🐠', label: 'Evite Peixes!', colorClass: 'chip-red' }
        ],
        onStart: "loadIframe('pescador.html')"
    });
}

function startGariGame() {
    showModernSplash({
        badge: 'Mergulho & Limpeza',
        heroIcon: '🤿',
        title: 'Gari Aquático',
        subtitle: 'Mergulhe fundo e salve os recifes recolhendo o lixo humano!',
        rules: [
            { icon: '🏊', title: 'Natação', desc: 'Use WASD ou setas do teclado para manobrar na água.' },
            { icon: '🗑️', title: 'Coletar Detritos', desc: 'Recolha plástico e metal flutuando antes que afundem.' },
            { icon: '🦈', title: 'Perigo!', desc: 'Desvie de tubarões e animais marinhos em rota de caça!' }
        ],
        chipsLabel: 'Elementos do Mergulho',
        chips: [
            { icon: '🏊', label: 'Nadar', colorClass: 'chip-blue' },
            { icon: '🗑️', label: 'Coletar', colorClass: 'chip-green' },
            { icon: '🐟', label: 'Preservar', colorClass: 'chip-yellow' },
            { icon: '🦈', label: 'Cuidado!', colorClass: 'chip-red' }
        ],
        onStart: "loadIframe('gari.html')"
    });
}

function startVazamentoGame() {
    showModernSplash({
        badge: 'Recursos Hídricos',
        heroIcon: '🔧',
        title: 'Caça ao Vazamento',
        subtitle: 'Cada gota conta! Repare a tubulação e evite o desperdício de água potável!',
        rules: [
            { icon: '💧', title: 'Localizar', desc: 'Encontre canos gotejando antes que o reservatório esvazie.' },
            { icon: '🪣', title: 'Coletar Água', desc: 'Use baldes para reaproveitar água vazada na horta.' },
            { icon: '🛠️', title: 'Reparar', desc: 'Clique e segure para apertar conexões e vedar os canos.' }
        ],
        chipsLabel: 'Ferramentas do Jogo',
        chips: [
            { icon: '💧', label: 'Água Potável', colorClass: 'chip-cyan' },
            { icon: '🪣', label: 'Balde', colorClass: 'chip-blue' },
            { icon: '🔧', label: 'Consertar', colorClass: 'chip-yellow' },
            { icon: '🌿', label: 'Irrigar', colorClass: 'chip-green' }
        ],
        onStart: "loadIframe('vazamento.html')"
    });
}

function startIrrigacaoGame() {
    showModernSplash({
        badge: 'Agricultura Sustentável',
        heroIcon: '🌱',
        title: 'Irrigação Inteligente',
        subtitle: 'Mantenha o solo na faixa perfeita de umidade sem desperdiçar água!',
        rules: [
            { icon: '🚰', title: 'Abastecer o Tanque', desc: 'Se a água do tanque acabar, você não tem como regar e a planta morre!' },
            { icon: '💧', title: 'Regar na Medida', desc: 'Regue a planta para não secar, mas cuidado para não regar demais.' },
            { icon: '⚖️', title: 'Equilíbrio Total', desc: 'Mantenha a umidade entre 20% e 80% durante os 30 segundos!' }
        ],
        chipsLabel: 'Cuidados Vitais',
        chips: [
            { icon: '🥀', label: 'Seca (<15%)', colorClass: 'chip-yellow' },
            { icon: '🌻', label: 'Zona Ideal', colorClass: 'chip-green' },
            { icon: '💦', label: 'Afogada (>90%)', colorClass: 'chip-red' }
        ],
        onStart: "initIrrigacaoGame()"
    });
}

function startIncendioGame() {
    showModernSplash({
        badge: 'Proteção Florestal',
        heroIcon: '🔥',
        title: 'Incêndio Zero',
        subtitle: 'Modo Sobrevivência: apague o fogo e impeça a poluição de atingir 100%!',
        rules: [
            { icon: '🧯', title: 'Combater Focos', desc: 'Clique sobre as chamas com o helicóptero para lançar água em área.' },
            { icon: '🌫️', title: 'Controlar Poluição', desc: 'Cada árvore apagada reduz a fumaça. Mantenha o ar respirável!' },
            { icon: '🌲', title: 'Sem Limite de Tempo', desc: 'O jogo continua enquanto você resistir. Ele só acaba se a poluição chegar a 100%!' }
        ],
        chipsLabel: 'Missão de Voo',
        chips: [
            { icon: '🚁', label: 'Helicóptero', colorClass: 'chip-cyan' },
            { icon: '💧', label: 'Descarga em Área', colorClass: 'chip-blue' },
            { icon: '🌫️', label: 'Evite 100%', colorClass: 'chip-red' }
        ],
        onStart: "loadIframe('incendio.html')"
    });
}

function startSupermercadoGame() {
    showModernSplash({
        badge: 'Consumo Consciente',
        heroIcon: '🛒',
        title: 'Supermercado Consciente',
        subtitle: 'Planeje suas compras com equilíbrio financeiro e impacto ambiental reduzido!',
        rules: [
            { icon: '🏷️', title: 'Avaliar Itens', desc: 'Observe a utilidade, pegada ecológica e o valor do produto.' },
            { icon: '⚖️', title: 'Classificar', desc: 'Decida rápido: é item Essencial, Desejo ou Supérfluo?' },
            { icon: '🪙', title: 'Poupança', desc: 'Gerencie seu saldo de 500 moedas sem zerar o orçamento.' }
        ],
        chipsLabel: 'Categorias de Compra',
        chips: [
            { icon: '✅', label: 'Essencial', colorClass: 'chip-green' },
            { icon: '💛', label: 'Desejo', colorClass: 'chip-yellow' },
            { icon: '❌', label: 'Desnecessário', colorClass: 'chip-red' },
            { icon: '🪙', label: 'Orçamento', colorClass: 'chip-purple' }
        ],
        onStart: "loadIframe('supermercado.html')"
    });
}

function updateLivesUI() {
    const livesContainer = document.getElementById('gameLives');
    if (livesContainer) {
        livesContainer.textContent = '🍃'.repeat(Math.max(0, lives)) || '💀';
    }
    const livesBadge = document.getElementById('livesBadge');
    if (livesBadge) {
        if (lives === 1) {
            livesBadge.classList.add('danger-pulse');
        } else {
            livesBadge.classList.remove('danger-pulse');
        }
    }
}

// --- Jogo da Coleta ---
function initCatchGame() {
    if (window.configureGameHUD) window.configureGameHUD({ showLevel: true, showScore: true, showLives: true, showTime: true });
    const statsEl = document.querySelector('.game-stats-container');
    if (statsEl) statsEl.style.display = 'flex';
    score = 0;
    currentLevel = 1;
    lives = 3;
    isGameActive = true;
    selectedWaste = null;
    isDragging = false;
    
    document.getElementById('gameScore').textContent = '0';
    document.getElementById('gameTime').textContent = '10';
    const lvlEl = document.getElementById('gameLevel');
    if (lvlEl) lvlEl.textContent = currentLevel;
    updateLivesUI();
    
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = ''; 

    const binsContainer = document.createElement('div');
    binsContainer.className = 'game-bins';
    Object.keys(BINS).forEach(type => {
        const bin = document.createElement('div');
        bin.className = `game-bin bin-${type}`;
        bin.id = `bin-${type}`;
        bin.innerHTML = `
            <div class="bin-lid"></div>
            <div class="bin-slot"></div>
            <div class="bin-body-grooves"></div>
            <div class="bin-icon-wrap"><i class="fas ${BINS[type].icon}"></i></div>
            <div class="bin-label">${BINS[type].name}</div>
            <div class="bin-recycle-badge"><i class="fas fa-recycle"></i></div>
        `;
        binsContainer.appendChild(bin);
    });
    canvas.appendChild(binsContainer);

    canvas.onpointermove = (e) => {
        if (!isGameActive || !isDragging || !selectedWaste) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - dragX;
        const y = e.clientY - rect.top - dragY;
        selectedWaste.style.left = x + 'px';
        selectedWaste.style.top = y + 'px';
    };

    canvas.onpointerup = (e) => {
        if (!isGameActive || !isDragging || !selectedWaste) return;
        isDragging = false;
        
        const bins = document.querySelectorAll('.game-bin');
        let droppedBin = null;
        bins.forEach(bin => {
            const bRect = bin.getBoundingClientRect();
            if (e.clientX >= bRect.left && e.clientX <= bRect.right &&
                e.clientY >= bRect.top && e.clientY <= bRect.bottom) {
                droppedBin = bin;
            }
        });

        if (droppedBin) {
            const type = droppedBin.id.replace('bin-', '');
            if (selectedWaste.dataset.type === type) {
                collectWaste(selectedWaste, droppedBin);
            } else {
                playPopSound('error');
                lives--; updateLivesUI();
                droppedBin.style.animation = 'shake 0.3s ease';
                selectedWaste.style.transition = 'all 0.3s ease';
                selectedWaste.style.left = initialX + 'px';
                selectedWaste.style.top = initialY + 'px';
                if (lives <= 0) endGame();
            }
        } else {
            selectedWaste.style.transition = 'all 0.3s ease';
            selectedWaste.style.left = initialX + 'px';
            selectedWaste.style.top = initialY + 'px';
        }
        selectedWaste.classList.remove('selected');
        selectedWaste = null;
    };
    startRound();
}

function startRound() {
    if (!isGameActive) return;
    timeLeft = Math.max(5, 12 - currentLevel);
    document.getElementById('gameTime').textContent = timeLeft;
    itemsLeftInWave = 2 + currentLevel;
    for (let i = 0; i < itemsLeftInWave; i++) setTimeout(spawnWaste, i * 300);
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('gameTime').textContent = timeLeft;
        if (window.__updateHUD) window.__updateHUD({ type: 'UPDATE_HUD', time: timeLeft });
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            lives--; updateLivesUI();
            playPopSound('error');
            if (lives <= 0) endGame();
            else {
                document.querySelectorAll('.game-waste-item').forEach(w => w.remove());
                startRound();
            }
        }
    }, 1000);
}

function spawnWaste() {
    if (!isGameActive) return;
    const canvas = document.getElementById('gameCanvas');
    const waste = document.createElement('div');
    const data = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)];
    waste.className = 'game-waste-item';
    waste.dataset.type = data.type;
    waste.innerHTML = data.icon;
    const startX = Math.random() * (canvas.offsetWidth - 80) + 10;
    const startY = Math.random() * 100 + 50;
    waste.style.left = startX + 'px';
    waste.style.top = startY + 'px';
    canvas.appendChild(waste);
    waste.onpointerdown = (e) => {
        if (!isGameActive) return;
        isDragging = true; selectedWaste = waste;
        waste.classList.add('selected'); waste.style.transition = 'none';
        const rect = canvas.getBoundingClientRect();
        const wRect = waste.getBoundingClientRect();
        dragX = e.clientX - wRect.left; dragY = e.clientY - wRect.top;
        initialX = wRect.left - rect.left; initialY = wRect.top - rect.top;
        waste.setPointerCapture(e.pointerId);
    };
}

function spawnEcoSparks(bin) {
    const canvas = document.getElementById("gameCanvas");
    if (!canvas) return;
    const bRect = bin.getBoundingClientRect();
    const cRect = canvas.getBoundingClientRect();
    const cx = bRect.left - cRect.left + bRect.width / 2;
    const cy = bRect.top - cRect.top + 8;
    for (let i = 0; i < 9; i++) {
        const spark = document.createElement("div");
        spark.style.cssText = "position:absolute;left:" + cx + "px;top:" + cy + "px;width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #4ade80,0 0 18px #22c55e;pointer-events:none;z-index:100;transition:all 0.5s cubic-bezier(0.16,1,0.3,1);";
        canvas.appendChild(spark);
        const angle = (Math.PI * 2 / 9) * i;
        const dist = 28 + Math.random() * 32;
        requestAnimationFrame(() => {
            spark.style.transform = "translate(" + (Math.cos(angle)*dist) + "px, " + (Math.sin(angle)*dist - 24) + "px) scale(0)";
            spark.style.opacity = "0";
        });
        setTimeout(() => spark.remove(), 550);
    }
}
function collectWaste(waste, bin) {
    playPopSound('correct');
    bin.classList.remove('bin-feed-success');
    void bin.offsetWidth; // force reflow
    bin.classList.add('bin-feed-success');
    spawnEcoSparks(bin);
    setTimeout(() => bin.classList.remove('bin-feed-success'), 400);

    const canvas = document.getElementById('gameCanvas');
    const bRect = bin.getBoundingClientRect();
    const cRect = canvas.getBoundingClientRect();
    waste.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    waste.style.left = (bRect.left - cRect.left + bRect.width / 2) + 'px';
    waste.style.top = (bRect.top - cRect.top + 20) + 'px';
    waste.style.transform = 'scale(0) rotate(720deg)';
    waste.style.opacity = '0';
    waste.style.pointerEvents = 'none';
    score += 15;
    document.getElementById('gameScore').textContent = score;
    itemsLeftInWave--;
    setTimeout(() => {
        waste.remove();
        if (isGameActive && itemsLeftInWave <= 0) {
            playPopSound('nextLevel');
            currentLevel++;
            const lvlEl = document.getElementById('gameLevel');
            if (lvlEl) lvlEl.textContent = currentLevel;
            clearInterval(gameInterval);
            setTimeout(startRound, 800);
        }
    }, 450);
}

function endGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    const xp = Math.max(10, Math.floor(score / 2));
    if (window.gamification) window.gamification.addXp(xp, "(Coleta Seletiva)");
    showModernResult({
        type: score >= 80 ? 'win' : 'lose',
        badge: score >= 80 ? 'Coleta Eficiente' : 'Tempo Esgotado',
        heroIcon: score >= 80 ? '♻️' : '🗑️',
        title: score >= 80 ? 'Parabéns, Reciclador!' : 'Quase lá!',
        subtitle: score >= 80 
            ? 'Você separou os resíduos com rapidez e evitou a contaminação do solo.' 
            : 'Fique atento às cores das lixeiras e tente agir mais rápido na próxima rodada.',
        stats: [
            { label: 'Pontuação', value: score, icon: '⭐' },
            { label: 'XP Conquistado', value: `+${xp} XP`, highlight: true, icon: '🌿' },
            { label: 'Nível Final', value: currentLevel, icon: '🏅' }
        ],
        onRestart: 'initCatchGame()',
        restartLabel: 'Jogar Novamente'
    });
}

// --- Jogo da Memória ---
function initMemoryGame() {
    if (window.configureGameHUD) window.configureGameHUD({ showLevel: true, showScore: true, showLives: false, showTime: true });
    const statsEl = document.querySelector('.game-stats-container');
    if (statsEl) statsEl.style.display = 'flex';
    isGameActive = true;
    memoryScore = (memoryLevel > 1) ? memoryScore : 0;
    matchedPairs = 0; flippedCards = [];
    timeLeft = 60 - (memoryLevel * 5);
    if (timeLeft < 25) timeLeft = 25;

    document.getElementById('gameScore').textContent = memoryScore;
    document.getElementById('gameTime').textContent = timeLeft;
    const lvlEl = document.getElementById('gameLevel');
    if (lvlEl) lvlEl.textContent = memoryLevel;
    
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `<div class="memory-grid"></div>`;
    const grid = canvas.querySelector('.memory-grid');
    
    const numPairs = Math.min(4 + (memoryLevel * 2), MEMORY_PAIRS.length / 2);
    const selectedPairs = MEMORY_PAIRS.slice(0, numPairs * 2);
    const gameCards = [...selectedPairs].sort(() => Math.random() - 0.5);
    
    if (numPairs > 6) grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    else if (numPairs > 4) grid.style.gridTemplateColumns = 'repeat(3, 1fr)';

    gameCards.forEach((data) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.id = data.id;
        card.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front"><i class="fas fa-leaf"></i></div>
                <div class="memory-card-back">
                    <span class="memory-icon">${data.icon}</span>
                    <span class="memory-label" style="font-size:0.6rem;text-align:center">${data.label}</span>
                </div>
            </div>
        `;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('gameTime').textContent = timeLeft;
        if (window.__updateHUD) window.__updateHUD({ type: 'UPDATE_HUD', time: timeLeft });
        if (timeLeft <= 0) endMemoryGame(false);
    }, 1000);
}

function flipCard(card) {
    if (!isGameActive || flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flippedCards.push(card);
    if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.id === card2.dataset.id) {
        matchedPairs++;
        memoryScore += 50 * memoryLevel;
        document.getElementById('gameScore').textContent = memoryScore;
        card1.classList.add('matched'); card2.classList.add('matched');
        flippedCards = []; playPopSound('correct');
        const totalPairs = Math.min(4 + (memoryLevel * 2), MEMORY_PAIRS.length / 2);
        if (matchedPairs === totalPairs) {
            clearInterval(gameInterval);
            setTimeout(() => {
                playPopSound('nextLevel');
                if (memoryLevel < 4) { memoryLevel++; initMemoryGame(); }
                else endMemoryGame(true);
            }, 1000);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped'); card2.classList.remove('flipped');
            flippedCards = []; playPopSound('error');
        }, 800);
    }
}

function endMemoryGame(win) {
    isGameActive = false;
    clearInterval(gameInterval);
    const xp = Math.max(15, Math.floor((memoryScore + (win ? 150 : 0)) / 8));
    if (window.gamification) window.gamification.addXp(xp, "(Memória da Natureza)");
    showModernResult({
        type: win ? 'win' : 'lose',
        badge: win ? 'Mestre da Memória' : 'Tempo Esgotado',
        heroIcon: win ? '🧠' : '⏳',
        title: win ? 'Memória de Elefante!' : 'O Tempo Acabou!',
        subtitle: win 
            ? 'Você encontrou todos os pares ecológicos e dominou os conceitos sustentáveis.' 
            : 'Memorize a localização de cada carta para formar os pares com mais agilidade.',
        stats: [
            { label: 'Pontuação', value: memoryScore, icon: '⭐' },
            { label: 'XP Conquistado', value: `+${xp} XP`, highlight: true, icon: '🌿' },
            { label: 'Nível', value: `${memoryLevel}/4`, icon: '🧩' }
        ],
        onRestart: 'memoryLevel=1; initMemoryGame()',
        restartLabel: 'Jogar Novamente'
    });
}
