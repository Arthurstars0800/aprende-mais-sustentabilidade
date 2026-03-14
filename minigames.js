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
    metal: { name: 'Metal', color: '#eab308', icon: 'fa-can-food' }
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

function startCatchGame() {
    const stage = document.getElementById('gameStage');
    stage.style.display = 'flex';
    stage.scrollIntoView({ behavior: 'smooth' });
    
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div id="gameInstructions" class="game-instructions">
            <h2>Coleta Seletiva</h2>
            <ol class="game-tutorial-list">
                <li>Itens de lixo aparecem na tela</li>
                <li>Arraste cada item até a lixeira da cor certa</li>
                <li>Colete tudo antes do tempo acabar!</li>
            </ol>
            <div class="bins-chip-row">
                <div class="bin-chip" style="--chip-color:#ef4444">
                    <span class="memory-icon">♻️</span>
                    <span class="memory-label" style="font-size:0.6rem;text-align:center">Plástico</span>
                </div>
                <div class="bin-chip" style="--chip-color:#3b82f6">
                    <span class="memory-icon">📄</span>
                    <span class="memory-label" style="font-size:0.6rem;text-align:center">Papel</span>
                </div>
                <div class="bin-chip" style="--chip-color:#22c55e">
                    <span class="memory-icon">🍷</span>
                    <span class="memory-label" style="font-size:0.6rem;text-align:center">Vidro</span>
                </div>
                <div class="bin-chip" style="--chip-color:#eab308">
                    <span class="memory-icon">🥫</span>
                    <span class="memory-label" style="font-size:0.6rem;text-align:center">Metal</span>
                </div>
            </div>
            <button class="btn btn-primary" onclick="initCatchGame()">Começar</button>
        </div>
    `;
}

function startMemoryGame() {
    const stage = document.getElementById('gameStage');
    stage.style.display = 'flex';
    stage.scrollIntoView({ behavior: 'smooth' });
    
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div id="gameInstructions" class="game-instructions">
            <h2>Memória da Natureza</h2>
            <ol class="game-tutorial-list">
                <li>Clique em qualquer carta para virá-la</li>
                <li>Clique em uma segunda carta para tentar o par</li>
                <li>Encontre todos os pares antes do tempo acabar</li>
                <li>Acerte mais rápido para ganhar mais pontos!</li>
            </ol>
            <button class="btn btn-primary" onclick="memoryLevel=1; initMemoryGame()">Começar</button>
        </div>
    `;
}

function closeGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    document.getElementById('gameStage').style.display = 'none';
}

function updateLivesUI() {
    const livesContainer = document.getElementById('gameLives');
    if (livesContainer) {
        livesContainer.textContent = '🍃'.repeat(Math.max(0, lives)) || '💀';
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
    
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `<div class="memory-header"><h4>Nível ${memoryLevel}</h4></div><div class="memory-grid"></div>`;
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
