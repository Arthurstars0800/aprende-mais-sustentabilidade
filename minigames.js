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

const WASTE_TYPES = [
    { name: 'Garrafa PET', type: 'plastic', color: '#ef4444', icon: '🍶' },
    { name: 'Papelão', type: 'paper', color: '#3b82f6', icon: '📦' },
    { name: 'Vidro', type: 'glass', color: '#22c55e', icon: '🍷' },
    { name: 'Latinha', type: 'metal', color: '#eab308', icon: '🥫' }
];

const MEMORY_PAIRS = [
    { id: 1, icon: '🍶', type: 'plastic', label: 'Garrafa PET' },
    { id: 1, icon: '👕', type: 'plastic', label: 'Camiseta PET' },
    { id: 2, icon: '📦', type: 'paper', label: 'Papelão' },
    { id: 2, icon: '📚', type: 'paper', label: 'Livro Novo' },
    { id: 3, icon: '🍷', type: 'glass', label: 'Vidro' },
    { id: 3, icon: '🏺', type: 'glass', label: 'Vaso Novo' },
    { id: 4, icon: '🥫', type: 'metal', label: 'Latinha' },
    { id: 4, icon: '🚲', type: 'metal', label: 'Bicicleta' },
    { id: 5, icon: '🍏', type: 'compost', label: 'Resto Orgânico' },
    { id: 5, icon: '🌱', type: 'compost', label: 'Fertilizante' },
    { id: 6, icon: '🔋', type: 'special', label: 'Pilha Velha' },
    { id: 6, icon: '⚡', type: 'special', label: 'Energia' },
    { id: 7, icon: '🥛', type: 'special', label: 'Tetra Pak' },
    { id: 7, icon: '🏠', type: 'special', label: 'Telha' },
    { id: 8, icon: '⭕', type: 'special', label: 'Pneu Velho' },
    { id: 8, icon: '👟', type: 'special', label: 'Sapato' }
];

const BINS = {
    plastic: { name: 'Plástico', color: '#ef4444', icon: 'fa-bottle-water' },
    paper: { name: 'Papel', color: '#3b82f6', icon: 'fa-scroll' },
    glass: { name: 'Vidro', color: '#22c55e', icon: 'fa-wine-glass' },
    metal: { name: 'Metal', color: '#eab308', icon: 'fa-can-food' }
};

// --- Efeitos Sonoros ---
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
    const canvas = document.getElementById('gameCanvas');
    canvas.onpointermove = null;
    canvas.onpointerup = null;
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
    isDragging = false;
    
    document.getElementById('gameInstructions').style.display = 'none';
    document.getElementById('gameScore').textContent = '0';
    updateLivesUI();
    
    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = ''; // Limpa tudo

    // Recria as lixeiras
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

    // --- Lógica de Arrastar (Canvas Listeners) ---
    canvas.onpointermove = (e) => {
        if (!isGameActive || !isDragging || !selectedWaste) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - dragX;
        const y = e.clientY - rect.top - dragY;
        
        // Mantém dentro do canvas
        const bx = Math.max(0, Math.min(x, rect.width - 60));
        const by = Math.max(0, Math.min(y, rect.height - 60));

        selectedWaste.style.left = bx + 'px';
        selectedWaste.style.top = by + 'px';
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
                lives--;
                updateLivesUI();
                droppedBin.style.animation = 'shake 0.3s ease';
                setTimeout(() => droppedBin.style.animation = '', 300);
                
                // Reset position
                selectedWaste.style.transition = 'all 0.3s ease';
                selectedWaste.style.left = initialX + 'px';
                selectedWaste.style.top = initialY + 'px';
                
                if (lives <= 0) endGame();
            }
        } else {
            // Reset position if dropped outside
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
    
    for (let i = 0; i < itemsLeftInWave; i++) {
        setTimeout(spawnWaste, i * 300);
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
    
    // Posição inicial randômica
    const startX = Math.random() * (canvas.offsetWidth - 80) + 10;
    const startY = Math.random() * 100 + 50;
    
    waste.style.left = startX + 'px';
    waste.style.top = startY + 'px';
    
    canvas.appendChild(waste);

    waste.onpointerdown = (e) => {
        if (!isGameActive) return;
        isDragging = true;
        selectedWaste = waste;
        waste.classList.add('selected');
        waste.style.transition = 'none';

        const rect = canvas.getBoundingClientRect();
        const wRect = waste.getBoundingClientRect();
        
        dragX = e.clientX - wRect.left;
        dragY = e.clientY - wRect.top;
        
        initialX = wRect.left - rect.left;
        initialY = wRect.top - rect.top;

        waste.setPointerCapture(e.pointerId);
    };
}

function collectWaste(waste, bin) {
    playPopSound('correct');
    const canvas = document.getElementById('gameCanvas');
    const bRect = bin.getBoundingClientRect();
    const cRect = canvas.getBoundingClientRect();
    
    const targetX = bRect.left - cRect.left + bRect.width / 2;
    const targetY = bRect.top - cRect.top;

    waste.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    waste.style.left = targetX + 'px';
    waste.style.top = targetY + 'px';
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
            <h2>${lives <= 0 ? 'Fim de Jogo!' : 'Tempo Esgotado!'}</h2>
            <p>Você alcançou o <strong>Nível ${currentLevel}</strong>.</p>
            <p>Pontuação: <strong>${score}</strong></p>
            <p>Ganhou <strong>${xp} XP</strong>!</p>
            <button class="btn btn-primary" onclick="initCatchGame()">Jogar Novamente</button>
        </div>
    `;
}

// --- Memória da Natureza ---
let flippedCards = [];
let matchedPairs = 0;
let memoryScore = 0;
let memoryLevel = 1;

function startMemoryGame() {
    document.getElementById('gameStage').style.display = 'flex';
    document.getElementById('gameStage').scrollIntoView({ behavior: 'smooth' });
    memoryLevel = 1;
    initMemoryGame();
}

function initMemoryGame() {
    isGameActive = true;
    memoryScore = (memoryLevel > 1) ? memoryScore : 0;
    matchedPairs = 0;
    flippedCards = [];
    
    // Tempo dinâmico baseado no nível
    timeLeft = 60 - (memoryLevel * 5);
    if (timeLeft < 20) timeLeft = 20;

    document.getElementById('gameInstructions').style.display = 'none';
    document.getElementById('gameScore').textContent = memoryScore;
    document.getElementById('gameTime').textContent = timeLeft;
    
    updateLivesUI(); // Reusando o HUD de vidas se necessário, mas memória usa tempo

    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="memory-header">
            <h4>Nível ${memoryLevel}</h4>
        </div>
        <div class="memory-grid grid-level-${memoryLevel}"></div>
    `;
    const grid = canvas.querySelector('.memory-grid');
    
    // Selecionar número de pares baseado no nível (4, 6, 8 pares...)
    const numPairs = Math.min(4 + (memoryLevel * 2), MEMORY_PAIRS.length / 2);
    const selectedPairs = MEMORY_PAIRS.slice(0, numPairs * 2);
    
    // Embaralhar
    const gameCards = [...selectedPairs].sort(() => Math.random() - 0.5);
    
    // Ajustar colunas da grade
    if (numPairs > 6) grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    else if (numPairs > 4) grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    else grid.style.gridTemplateColumns = 'repeat(4, 1fr)';

    gameCards.forEach((data) => {
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
    const isMatch = card1.dataset.id === card2.dataset.id;
    
    if (isMatch) {
        matchedPairs++;
        memoryScore += 50 * memoryLevel;
        document.getElementById('gameScore').textContent = memoryScore;
        
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        playPopSound('correct');
        
        const totalPairsNeeded = Math.min(4 + (memoryLevel * 2), MEMORY_PAIRS.length / 2);
        if (matchedPairs === totalPairsNeeded) {
            clearInterval(gameInterval);
            setTimeout(() => {
                playPopSound('nextLevel');
                if (memoryLevel < 4) { // Limite de níveis, ajuste conforme necessário
                    memoryLevel++;
                    initMemoryGame(); // Próxima onda de memória
                } else {
                    endMemoryGame(true);
                }
            }, 1000);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            playPopSound('error');
        }, 800);
    }
}

function endMemoryGame(win) {
    isGameActive = false;
    clearInterval(gameInterval);
    
    const bonus = win ? 100 : 0;
    const xpGained = Math.floor((memoryScore + bonus) / 10);
    
    if (window.gamification) {
        window.gamification.addXp(xpGained, "(Combo Memória)");
    }

    const canvas = document.getElementById('gameCanvas');
    canvas.innerHTML = `
        <div class="game-instructions">
            <h2>${win ? 'Mestre da Natureza!' : 'O Tempo Voou!'}</h2>
            <p>Você completou até o <strong>Nível ${memoryLevel}</strong>.</p>
            <p>Pontuação Total: <strong>${memoryScore}</strong></p>
            <p>Reciclou muitos itens mentais e ganhou <strong>${xpGained} XP</strong>!</p>
            <button class="btn btn-primary" onclick="startMemoryGame()">Tentar de Novo</button>
        </div>
    `;
}
