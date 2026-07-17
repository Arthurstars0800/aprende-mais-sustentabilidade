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
    const stage = document.getElementById('gameStage');
    stage.style.display = 'flex';
    document.querySelector('.game-stats-container').style.display = 'flex';
    stage.scrollIntoView({ behavior: 'smooth' });
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div id="gameInstructions" class="game-instructions game-splash-coleta">
            <div class="splash-centered-header">
                <div class="splash-hero-icon">♻️</div>
                <h2 class="splash-title">Coleta Seletiva</h2>
                <p class="splash-subtitle" style="font-size:1rem;font-weight:600;color:#10b981;">Ajude a limpar o planeta antes que seja tarde demais! 🌍</p>
            </div>
            <div class="splash-content-split">
                <div class="splash-text-side">
                    <ul class="game-tutorial-list">
                        <li><div><strong>Fique Atento:</strong> Os resíduos vão começar a pipocar pela tela!</div></li>
                        <li><div><strong>Aja Rápido:</strong> Arraste cada material para a lixeira correta e mostre suas habilidades.</div></li>
                        <li><div><strong>Sobrevivência:</strong> O tempo voa! Não deixe o relógio zerar e proteja suas vidas a todo custo!</div></li>
                    </ul>
                </div>
                <div class="splash-visual-side">
                    <div class="bins-chip-row">
                        <div class="bin-chip" style="--chip-color:#ef4444"><span class="bin-chip-icon">🍶</span><span class="memory-label">Plástico</span></div>
                        <div class="bin-chip" style="--chip-color:#3b82f6"><span class="bin-chip-icon">📦</span><span class="memory-label">Papel</span></div>
                        <div class="bin-chip" style="--chip-color:#22c55e"><span class="bin-chip-icon">🍷</span><span class="memory-label">Vidro</span></div>
                        <div class="bin-chip" style="--chip-color:#eab308"><span class="bin-chip-icon">🥫</span><span class="memory-label">Metal</span></div>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary splash-btn" style="background:#10b981;color:white;border:none;box-shadow:0 4px 15px rgba(16,185,129,0.4);" onclick="initCatchGame()"><i class="fas fa-play"></i> Começar Jogo</button>
        </div>`;
    
    // Fallback directly to green color to avoid any background-clip bugs
    const titleEl = canvas.querySelector('.splash-title');
    if (titleEl) {
        titleEl.style.color = '#10b981';
        titleEl.style.webkitTextFillColor = '#10b981';
        titleEl.style.background = 'none';
    }
}

function startMemoryGame() {
    const stage = document.getElementById('gameStage');
    stage.style.display = 'flex';
    document.querySelector('.game-stats-container').style.display = 'flex';
    stage.scrollIntoView({ behavior: 'smooth' });
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div id="gameInstructions" class="game-instructions game-splash-memory">
            <div class="splash-centered-header">
                <div class="splash-hero-icon">🃏</div>
                <h2 class="splash-title">Memória da Natureza</h2>
                <p class="splash-subtitle">Vire as cartas e forme pares de materiais recicláveis!</p>
            </div>
            <div class="splash-content-split">
                <div class="splash-text-side">
                    <ul class="game-tutorial-list">
                        <li><div><span>1</span> Clique em qualquer carta para revelá-la</div></li>
                        <li><div><span>2</span> Encontre o par correspondente de cada material</div></li>
                        <li><div><span>3</span> Memorize as posições para pontuar mais rápido</div></li>
                        <li><div><span>4</span> Limpe o tabuleiro antes do tempo acabar</div></li>
                    </ul>
                </div>
                <div class="splash-visual-side">
                    <div class="splash-card-preview">
                        <div class="preview-card flipped-preview">🗑️<span>Seco</span></div>
                        <div class="preview-card flipped-preview">🍷<span>Vidro</span></div>
                        <div class="preview-card back-preview"><i class="fas fa-leaf"></i></div>
                        <div class="preview-card flipped-preview">🔋<span>Perigo</span></div>
                        <div class="preview-card back-preview"><i class="fas fa-leaf"></i></div>
                        <div class="preview-card flipped-preview">🥤<span>Plástico</span></div>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary splash-btn" onclick="memoryLevel=1; initMemoryGame()"><i class="fas fa-play"></i> Começar Jogo</button>
        </div>`;
    applyGradient(canvas.querySelector('.splash-title'), '#f59e0b', '#d97706');
}

function closeGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    document.getElementById('gameStage').style.display = 'none';
    document.getElementById('gameCanvas').innerHTML = '';
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
    document.querySelector('.game-stats-container').style.display = showHud ? 'flex' : 'none';
}

// Global HUD updater — called directly when games run inline
window.__updateHUD = function(data) {
    if (!data || data.type !== 'UPDATE_HUD') return;
    if (data.score !== undefined) {
        const el = document.getElementById('gameScore');
        if (el) el.textContent = data.score;
    }
    if (data.level !== undefined) {
        const el = document.getElementById('gameLevel');
        if (el) el.textContent = data.level;
    }
    if (data.time !== undefined) {
        const el = document.getElementById('gameTime');
        if (el) el.textContent = data.time;
    }
    if (data.lives !== undefined) {
        const livesEl = document.getElementById('gameLives');
        if (livesEl) {
            if (typeof data.lives === 'number') {
                livesEl.innerHTML = '❤️'.repeat(data.lives) + '🩶'.repeat(Math.max(0, 3 - data.lives));
            } else {
                livesEl.innerHTML = data.lives;
            }
        }
    }
};

// Listen for postMessage from iframes (legacy) AND from same-page dispatches
window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'UPDATE_HUD') {
        window.__updateHUD(e.data);
    }
});

function startPescadorGame() {
    openStage(true);
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="game-instructions game-splash-pescador">
            <div class="splash-centered-header">
                <div class="splash-hero-icon">🎣</div>
                <h2 class="splash-title">Pescador Ecológico</h2>
                <p class="splash-subtitle">Limpe o oceano retirando o lixo do fundo do mar!</p>
            </div>
            <div class="splash-content-split">
                <div class="splash-text-side">
                    <ul class="game-tutorial-list">
                        <li><div><span>1</span> Mova o barco com o mouse ou toque na tela</div></li>
                        <li><div><span>2</span> Clique ou toque para lançar o anzol</div></li>
                        <li><div><span>3</span> Capture os lixos acumulados no fundo do oceano</div></li>
                        <li><div><span>4</span> Evite capturar os peixes para não perder vida</div></li>
                    </ul>
                </div>
                <div class="splash-visual-side">
                    <div class="splash-icon-row">
                        <div class="splash-icon-chip" style="--chip-accent:#06b6d4">🚢<span>Barco</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#0ea5e9">🪝<span>Anzol</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#ef4444">🐠<span>Evite!</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#22c55e">🗑️<span>Pesque!</span></div>
                    </div>
                </div>
            </div>
            <button class="btn splash-btn splash-btn-ocean" onclick="loadIframe('pescador.html')"><i class="fas fa-play"></i> Começar Jogo</button>
        </div>`;
    applyGradient(canvas.querySelector('.splash-title'), '#06b6d4', '#0284c7');
}

function startGariGame() {
    openStage(true);
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="game-instructions game-splash-gari">
            <div class="splash-centered-header">
                <div class="splash-hero-icon">🤿</div>
                <h2 class="splash-title">Gari Aquático</h2>
                <p class="splash-subtitle">Mergulhe fundo e salve a vida marinha do lixo humano!</p>
            </div>
            <div class="splash-content-split">
                <div class="splash-text-side">
                    <ul class="game-tutorial-list">
                        <li><div><span>1</span> Use WASD ou setas do teclado para nadar</div></li>
                        <li><div><span>2</span> Recolha todos os detritos flutuando no mar</div></li>
                        <li><div><span>3</span> Não encoste nos peixes da região marinha</div></li>
                        <li><div><span>4</span> Desvie do tubarão faminto que patrulha o fundo!</div></li>
                    </ul>
                </div>
                <div class="splash-visual-side">
                    <div class="splash-icon-row">
                        <div class="splash-icon-chip" style="--chip-accent:#3b82f6">🏊<span>Nadar</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#22c55e">🗑️<span>Coletar</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#f59e0b">🐟<span>Desviar</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#ef4444">🦈<span>Perigo!</span></div>
                    </div>
                </div>
            </div>
            <button class="btn splash-btn splash-btn-ocean" onclick="loadIframe('gari.html')"><i class="fas fa-play"></i> Começar Jogo</button>
        </div>`;
    applyGradient(canvas.querySelector('.splash-title'), '#3b82f6', '#1d4ed8');
}

function startVazamentoGame() {
    openStage(true);
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="game-instructions game-splash-vazamento">
            <div class="splash-centered-header">
                <div class="splash-hero-icon">🔧</div>
                <h2 class="splash-title">Caça ao Vazamento</h2>
                <p class="splash-subtitle">Cada gota conta! Conserte os canos e salve a água!</p>
            </div>
            <div class="splash-content-split">
                <div class="splash-text-side">
                    <ul class="game-tutorial-list">
                        <li><div><span>1</span> Localize os canos que estão gotejando na cena</div></li>
                        <li><div><span>2</span> Posicione o balde sob o vazamento para coletar água</div></li>
                        <li><div><span>3</span> Use a água acumulada para irrigar a plantação</div></li>
                        <li><div><span>4</span> Clique e segure nos canos para consertá-los</div></li>
                    </ul>
                </div>
                <div class="splash-visual-side">
                    <div class="splash-icon-row">
                        <div class="splash-icon-chip" style="--chip-accent:#0ea5e9">💧<span>Água</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#64748b">🪣<span>Balde</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#0369a1">🔧<span>Consertar</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#22c55e">🌿<span>Irrigar</span></div>
                    </div>
                </div>
            </div>
            <button class="btn splash-btn splash-btn-water" onclick="loadIframe('vazamento.html')"><i class="fas fa-play"></i> Começar Jogo</button>
        </div>`;
    applyGradient(canvas.querySelector('.splash-title'), '#0ea5e9', '#0369a1');
}

function startIrrigacaoGame() {
    openStage(true);
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="game-instructions game-splash-irrigacao">
            <div class="splash-centered-header">
                <div class="splash-hero-icon">🌱</div>
                <h2 class="splash-title">Irrigação Inteligente</h2>
                <p class="splash-subtitle">Encontre o equilíbrio perfeito de água para sua plantação!</p>
            </div>
            <div class="splash-content-split">
                <div class="splash-text-side">
                    <ul class="game-tutorial-list">
                        <li><div><span>1</span> Monitore o nível de umidade do solo em tempo real</div></li>
                        <li><div><span>2</span> Pressione o botão de irrigar quando o solo secar</div></li>
                        <li><div><span>3</span> Evite ressecamento: nível abaixo de 10% mata a planta!</div></li>
                        <li><div><span>4</span> Evite encharcamento: nível acima de 90% afoga a raiz!</div></li>
                    </ul>
                </div>
                <div class="splash-visual-side">
                    <div class="splash-umidade-bar">
                        <div class="umidade-zone zone-seco">Seco</div>
                        <div class="umidade-zone zone-ideal">✅ Ideal</div>
                        <div class="umidade-zone zone-encharcado">Encharcado</div>
                    </div>
                </div>
            </div>
            <button class="btn splash-btn splash-btn-green" onclick="loadIframe('irrigacao.html')"><i class="fas fa-play"></i> Começar Jogo</button>
        </div>`;
    applyGradient(canvas.querySelector('.splash-title'), '#84cc16', '#4d7c0f');
}

function startIncendioGame() {
    openStage(true);
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="game-instructions game-splash-incendio">
            <div class="splash-centered-header">
                <div class="splash-hero-icon">🔥</div>
                <h2 class="splash-title">Incêndio Zero</h2>
                <p class="splash-subtitle">Proteja a floresta! Cada segundo conta para salvar as árvores!</p>
            </div>
            <div class="splash-content-split">
                <div class="splash-text-side">
                    <ul class="game-tutorial-list">
                        <li><div><span>1</span> Pressione e segure um foco de incêndio por 3 segundos</div></li>
                        <li><div><span>2</span> Impeça que o fogo se propague para árvores vizinhas</div></li>
                        <li><div><span>3</span> Monitore o nível de fumaça — não deixe chegar ao topo!</div></li>
                        <li><div><span>4</span> Aguarde a brisa do vento que ajuda a limpar o céu</div></li>
                    </ul>
                </div>
                <div class="splash-visual-side">
                    <div class="splash-icon-row">
                        <div class="splash-icon-chip" style="--chip-accent:#ef4444">🔥<span>Apagar</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#78350f">🌳<span>Proteger</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#6b7280">💨<span>Brisa</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#a3a3a3">🌫️<span>Fumaça</span></div>
                    </div>
                </div>
            </div>
            <button class="btn splash-btn splash-btn-fire" onclick="loadIframe('incendio.html')"><i class="fas fa-play"></i> Começar Jogo</button>
        </div>`;
    applyGradient(canvas.querySelector('.splash-title'), '#f97316', '#b91c1c');
}

function startSupermercadoGame() {
    openStage(true);
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="game-instructions game-splash-supermercado">
            <div class="splash-centered-header">
                <div class="splash-hero-icon">🛒</div>
                <h2 class="splash-title">Supermercado Consciente</h2>
                <p class="splash-subtitle">Consuma de forma inteligente e sustentável!</p>
            </div>
            <div class="splash-content-split">
                <div class="splash-text-side">
                    <ul class="game-tutorial-list">
                        <li><div><span>1</span> Um item aparece na tela com preço e descrição</div></li>
                        <li><div><span>2</span> Decida em até 5 segundos: comprar ou descartar</div></li>
                        <li><div><span>3</span> Classifique como Essencial, Desejo ou Desnecessário</div></li>
                        <li><div><span>4</span> Não esvazie seu orçamento inicial de 500 moedas!</div></li>
                    </ul>
                </div>
                <div class="splash-visual-side">
                    <div class="splash-icon-row">
                        <div class="splash-icon-chip" style="--chip-accent:#22c55e">✅<span>Essencial</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#f59e0b">💛<span>Desejo</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#ef4444">❌<span>Desneces.</span></div>
                        <div class="splash-icon-chip" style="--chip-accent:#a855f7">🪙<span>500 moedas</span></div>
                    </div>
                </div>
            </div>
            <button class="btn splash-btn splash-btn-purple" onclick="loadIframe('supermercado.html')"><i class="fas fa-play"></i> Começar Jogo</button>
        </div>`;
    applyGradient(canvas.querySelector('.splash-title'), '#a855f7', '#7e22ce');
}

function startPegadaGame() {
    openStage(true);
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="game-instructions game-splash-pegada">
            <div class="splash-centered-header">
                <div class="splash-hero-icon">👣</div>
                <h2 class="splash-title">Pegada Ecológica</h2>
                <p class="splash-subtitle">Suas escolhas diárias moldam o futuro do planeta!</p>
            </div>
            <div class="splash-content-split">
                <div class="splash-text-side">
                    <ul class="game-tutorial-list">
                        <li><div><span>1</span> Você vive um dia simulado cheio de escolhas cotidianas</div></li>
                        <li><div><span>2</span> Começa com 1000 Folhas de XP no banco</div></li>
                        <li><div><span>3</span> Decisões prejudiciais aumentam sua pegada de CO₂</div></li>
                        <li><div><span>4</span> Quanto maior a pegada ao final, mais XP é deduzido!</div></li>
                    </ul>
                </div>
                <div class="splash-visual-side">
                    <div class="splash-co2-preview">
                        <div class="co2-bar-track">
                            <div class="co2-bar-fill" id="co2PreviewFill"></div>
                            <span class="co2-label">Pegada de CO₂</span>
                        </div>
                        <div class="co2-icons">
                            <span title="Transporte">🚗</span>
                            <span title="Alimentação">🍔</span>
                            <span title="Energia">💡</span>
                            <span title="Compras">🛍️</span>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn splash-btn splash-btn-pink" onclick="loadIframe('pegada.html')"><i class="fas fa-play"></i> Começar Jogo</button>
        </div>`;
    applyGradient(canvas.querySelector('.splash-title'), '#ec4899', '#be185d');
    setTimeout(() => { const f = document.getElementById('co2PreviewFill'); if(f) f.style.width='38%'; }, 200);
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
        bin.innerHTML = `<i class="fas ${BINS[type].icon}"></i><span>${BINS[type].name}</span>`;
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

function collectWaste(waste, bin) {
    playPopSound('correct');
    const canvas = document.getElementById('gameCanvas');
    const bRect = bin.getBoundingClientRect();
    const cRect = canvas.getBoundingClientRect();
    waste.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    waste.style.left = (bRect.left - cRect.left + bRect.width / 2) + 'px';
    waste.style.top = (bRect.top - cRect.top) + 'px';
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
    const canvas = document.getElementById('gameCanvas');
    const xp = Math.floor(score / 2);
    if (window.gamification) window.gamification.addXp(xp, "(Minigame)");
    canvas.innerHTML = `
        <div class="game-instructions">
            <h2>Fim de Jogo!</h2>
            <p>Pontuação: <strong>${score}</strong> | XP: <strong>${xp}</strong></p>
            <button class="btn btn-primary" onclick="initCatchGame()">Jogar Novamente</button>
        </div>
    `;
}

// --- Jogo da Memória ---
function initMemoryGame() {
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
    const xp = Math.floor((memoryScore + (win ? 100 : 0)) / 10);
    if (window.gamification) window.gamification.addXp(xp, "(Memória)");
    
    document.getElementById('gameCanvas').innerHTML = `
        <div class="game-instructions">
            <h2>${win ? 'Mestre da Memória!' : 'Tempo Esgotado!'}</h2>
            <p>Score: <strong>${memoryScore}</strong> | XP: <strong>${xp}</strong></p>
            <button class="btn btn-primary" onclick="memoryLevel=1; initMemoryGame()">Tentar de Novo</button>
        </div>
    `;
}
