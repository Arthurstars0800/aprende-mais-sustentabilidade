let gameInterval;
let score = 0;
let timeLeft = 30;
let lives = 3;
let isGameActive = false;

const WASTE_TYPES = [
    { name: 'Garrafa PET', type: 'plastic', color: '#ef4444', icon: '🍶' },
    { name: 'Papelão', type: 'paper', color: '#3b82f6', icon: '📦' },
    { name: 'Vidro', type: 'glass', color: '#22c55e', icon: '🍷' },
    { name: 'Latinha', type: 'metal', color: '#eab308', icon: '🥫' }
];

const BINS = {
    plastic: { name: 'Plástico', color: '#ef4444', icon: 'fa-bottle-water' },
    paper: { name: 'Papel', color: '#3b82f6', icon: 'fa-scroll' },
    glass: { name: 'Vidro', color: '#22c55e', icon: 'fa-wine-glass' },
    metal: { name: 'Metal', color: '#eab308', icon: 'fa-can-food' }
};

// --- Efeitos Sonoros (Procedural Pop) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPopSound(isCorrect = true) {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = isCorrect ? 'sine' : 'square';
    
    if (isCorrect) {
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    } else {
        oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    }

    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (isCorrect ? 0.1 : 0.2));

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + (isCorrect ? 0.1 : 0.2));
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
        livesContainer.textContent = '🍃'.repeat(lives) || '💀';
    }
}

function initCatchGame() {
    score = 0;
    timeLeft = 30;
    lives = 3;
    isGameActive = true;
    document.getElementById('gameInstructions').style.display = 'none';
    document.getElementById('gameScore').textContent = '0';
    document.getElementById('gameTime').textContent = '30';
    updateLivesUI();
    
    const canvas = document.getElementById('gameCanvas');
    // Limpa canvas mantendo apenas as lixeiras
    canvas.querySelectorAll('.game-waste-item').forEach(w => w.remove());
    
    // Remove lixeiras antigas se houver
    const oldBins = canvas.querySelector('.game-bins');
    if (oldBins) oldBins.remove();

    // Cria as lixeiras
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

    spawnWaste();
    
    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('gameTime').textContent = timeLeft;
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function spawnWaste() {
    if (!isGameActive) return;

    const canvas = document.getElementById('gameCanvas');
    const waste = document.createElement('div');
    const randomWaste = WASTE_TYPES[Math.floor(Math.random() * WASTE_TYPES.length)];
    
    waste.className = 'game-waste-item';
    waste.innerHTML = randomWaste.icon;
    waste.style.left = Math.random() * 80 + 10 + '%';
    waste.style.top = '-50px';
    
    canvas.appendChild(waste);

    let pos = -50;
    const speed = 2 + (score / 150);
    
    const fall = setInterval(() => {
        if (!isGameActive) { clearInterval(fall); waste.remove(); return; }
        
        pos += speed;
        waste.style.top = pos + 'px';

        // Verifica se errou (caiu no chão)
        if (pos > canvas.offsetHeight - 110) {
            clearInterval(fall);
            waste.classList.add('fade-out');
            
            // Perde vida se não for coletado
            if (isGameActive) {
                lives--;
                updateLivesUI();
                playPopSound(false); // Som de erro
                if (lives <= 0) endGame();
                else {
                    setTimeout(() => waste.remove(), 300);
                    spawnWaste();
                }
            }
        }
    }, 20);

    waste.onclick = () => {
        if (!isGameActive) return;
        
        clearInterval(fall);
        playPopSound(true);
        
        // Efeito de "voar" para a lixeira correta
        const targetBin = document.getElementById(`bin-${randomWaste.type}`);
        const rect = targetBin.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        const targetX = rect.left - canvasRect.left + rect.width / 2;
        const targetY = rect.top - canvasRect.top;

        waste.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        waste.style.left = targetX + 'px';
        waste.style.top = targetY + 'px';
        waste.style.transform = 'scale(0.2) rotate(360deg)';
        waste.style.opacity = '0';

        score += 15;
        document.getElementById('gameScore').textContent = score;
        
        setTimeout(() => {
            waste.remove();
            if (isGameActive) spawnWaste();
        }, 500);
    };
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
            <h2>${lives <= 0 ? 'Fim de Jogo!' : 'Tempo Esgotado!'}</h2>
            <p>Você marcou <strong>${score}</strong> pontos.</p>
            <p>Ganhou <strong>${xpGained} XP</strong> para seu perfil!</p>
            <button class="btn btn-primary" onclick="initCatchGame()">Jogar Novamente</button>
        </div>
    `;
}
