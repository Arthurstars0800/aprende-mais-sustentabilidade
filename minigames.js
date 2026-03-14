let gameInterval;
let score = 0;
let timeLeft = 10;
let lives = 3;
let isGameActive = false;
let currentLevel = 1;
let itemsLeftInWave = 0;
let selectedWaste = null;

const WASTE_TYPES = [
    { name: 'Garrafa PET', type: 'plastic', color: '#ef4444', icon: '🍶' },
    { name: 'Papelão', type: 'paper', color: '#3b82f6', icon: '📦' },
    { name: 'Vidro', type: 'glass', color: '#22c55e', icon: '🍷' },
    { name: 'Latinha', type: 'metal', color: '#eab308', icon: '🥫' }
];

const MEMORY_PAIRS = [
    { id: 1, icon: '🍶', type: 'plastic', label: 'Garrafa' },
    { id: 1, icon: '👕', type: 'plastic', label: 'Camiseta' },
    { id: 2, icon: '📦', type: 'paper', label: 'Papelão' },
    { id: 2, icon: '📚', type: 'paper', label: 'Livro' },
    { id: 3, icon: '🍷', type: 'glass', label: 'Vidro' },
    { id: 3, icon: '🏺', type: 'glass', label: 'Vaso' },
    { id: 4, icon: '🥫', type: 'metal', label: 'Lata' },
    { id: 4, icon: '🚲', type: 'metal', label: 'Bicicleta' },
    { id: 5, icon: '🍎', type: 'compost', label: 'Maçã' },
    { id: 5, icon: '🌱', type: 'compost', label: 'Adubo' },
    { id: 6, icon: '💡', type: 'special', label: 'Lâmpada' },
    { id: 6, icon: '🔋', type: 'special', label: 'Posto' }
];

const BINS = {
    plastic: { name: 'Plástico', color: '#ef4444', icon: 'fa-bottle-water' },
    paper: { name: 'Papel', color: '#3b82f6', icon: 'fa-scroll' },
    glass: { name: 'Vidro', color: '#22c55e', icon: 'fa-wine-glass' },
    metal: { name: 'Metal', color: '#eab308', icon: 'fa-can-food' }
};

// --- Efeitos Sonoros (Procedural Pop) ---
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
    document.getElementById('gameStage').style.display = 'flex';
    document.getElementById('gameStage').scrollIntoView({ behavior: 'smooth' });
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

function initCatchGame() {
    score = 0;
    currentLevel = 1;
    lives = 3;
    isGameActive = true;
    selectedWaste = null;
    
    document.getElementById('gameInstructions').style.display = 'none';
    document.getElementById('gameScore').textContent = '0';
    updateLivesUI();
    
    const canvas = document.getElementById('gameCanvas');
    canvas.querySelectorAll('.game-waste-item').forEach(w => w.remove());
    
    const oldBins = canvas.querySelector('.game-bins');
    if (oldBins) oldBins.remove();

    const binsContainer = document.createElement('div');
    binsContainer.className = 'game-bins';
    Object.keys(BINS).forEach(type => {
        const bin = document.createElement('div');
        bin.className = `game-bin bin-${type}`;
        bin.id = `bin-${type}`;
        bin.innerHTML = `<i class="fas ${BINS[type].icon}"></i><span>${BINS[type].name}</span>`;
        
        bin.onclick = () => {
            if (!isGameActive || !selectedWaste) return;
            
            const wasteData = selectedWaste.dataset;
            if (wasteData.type === type) {
                collectWaste(selectedWaste, bin);
                selectedWaste = null;
            } else {
                playPopSound('error');
                lives--;
                updateLivesUI();
                bin.style.animation = 'shake 0.3s ease';
                setTimeout(() => bin.style.animation = '', 300);
                if (lives <= 0) endGame();
            }
        };
        
        binsContainer.appendChild(bin);
    });
    canvas.appendChild(binsContainer);

    startRound();
}

function startRound() {
    if (!isGameActive) return;

    timeLeft = Math.max(5, 12 - currentLevel);
    document.getElementById('gameTime').textContent = timeLeft;
    
    itemsLeftInWave = 2 + currentLevel;
    
    for (let i = 0; i < itemsLeftInWave; i++) {
        setTimeout(() => {
            spawnWaste();
        }, i * 200);
    }

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('gameTime').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            lives--;
            updateLivesUI();
            playPopSound('error');
            
            if (lives <= 0) {
                endGame();
            } else {
                const canvas = document.getElementById('gameCanvas');
                canvas.querySelectorAll('.game-waste-item').forEach(w => w.remove());
                selectedWaste = null;
                startRound();
            }
        }
    }, 1000);
}

function spawnWaste() {
    if (!isGameActive) return;

    const canvas = document.getElementById('gameCanvas');
    const waste = document.createElement('div');
    const randomWaste = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)];
    
    waste.className = 'game-waste-item';
    waste.dataset.type = randomWaste.type;
    waste.innerHTML = randomWaste.icon;
    waste.style.left = Math.random() * 80 + 10 + '%';
    waste.style.top = Math.random() * 50 + 50 + 'px';
    
    canvas.appendChild(waste);

    waste.onclick = (e) => {
        e.stopPropagation();
        if (!isGameActive) return;
        
        document.querySelectorAll('.game-waste-item').forEach(w => w.classList.remove('selected'));
        
        selectedWaste = waste;
        waste.classList.add('selected');
    };
}

function collectWaste(waste, bin) {
    playPopSound('correct');
    
    const canvas = document.getElementById('gameCanvas');
    const rect = bin.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    
    const targetX = rect.left - canvasRect.left + rect.width / 2;
    const targetY = rect.top - canvasRect.top;

    waste.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    waste.style.left = targetX + 'px';
    waste.style.top = targetY + 'px';
    waste.style.transform = 'scale(0.0) rotate(720deg)';
    waste.style.opacity = '0';
    waste.style.pointerEvents = 'none';

    score += 10;
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
    }, 400);
}

function endGame() {
    isGameActive = false;
    clearInterval(gameInterval);
    
    const xpGained = Math.floor(score / 2);
    if (window.gamification) {
        window.gamification.addXp(xpGained, "(Minigame de Coleta)");
    }

    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="game-instructions">
            <h2>${lives <= 0 ? 'Fim de Jogo!' : 'Fim da Missão!'}</h2>
            <p>Você alcançou o <strong>Nível ${currentLevel}</strong>.</p>
            <p>Pontuação: <strong>${score}</strong></p>
            <p>Ganhou <strong>${xpGained} XP</strong> para seu perfil!</p>
            <button class="btn btn-primary" onclick="initCatchGame()">Jogar Novamente</button>
        </div>
    `;
}

// --- Memória da Natureza ---
let flippedCards = [];
let matchedPairs = 0;
let memoryScore = 0;

function startMemoryGame() {
    document.getElementById('gameStage').style.display = 'flex';
    document.getElementById('gameStage').scrollIntoView({ behavior: 'smooth' });
    initMemoryGame();
}

function initMemoryGame() {
    isGameActive = true;
    memoryScore = 0;
    matchedPairs = 0;
    flippedCards = [];
    timeLeft = 60;
    
    document.getElementById('gameInstructions').style.display = 'none';
    document.getElementById('gameScore').textContent = '0';
    document.getElementById('gameTime').textContent = '60';
    
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = '<div class="memory-grid"></div>';
    const grid = canvas.querySelector('.memory-grid');
    
    const gameCards = [...MEMORY_PAIRS].sort(() => Math.random() - 0.5);
    
    gameCards.forEach((data, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.id = data.id;
        card.innerHTML = `
            <div class="memory-card-inner">
                <div class="memory-card-front"><i class="fas fa-leaf"></i></div>
                <div class="memory-card-back">
                    <span class="memory-icon">${data.icon}</span>
                    <span class="memory-label">${data.label}</span>
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
    
    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.id === card2.dataset.id;
    
    if (match) {
        matchedPairs++;
        memoryScore += 50;
        document.getElementById('gameScore').textContent = memoryScore;
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        playPopSound('nextLevel');
        
        if (matchedPairs === MEMORY_PAIRS.length / 2) {
            endMemoryGame(true);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            playPopSound('error');
        }, 1000);
    }
}

function endMemoryGame(win) {
    isGameActive = false;
    clearInterval(gameInterval);
    
    const xpGained = win ? Math.floor(memoryScore / 10) + 20 : Math.floor(memoryScore / 10);
    if (window.gamification) {
        window.gamification.addXp(xpGained, "(Memória Ecológica)");
    }

    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="game-instructions">
            <h2>${win ? 'Incrível!' : 'Tempo Esgotado!'}</h2>
            <p>Você encontrou <strong>${matchedPairs}</strong> pares.</p>
            <p>Ganhou <strong>${xpGained} XP</strong>!</p>
            <button class="btn btn-primary" onclick="initMemoryGame()">Jogar Novamente</button>
        </div>
    `;
}
