let gameInterval;
let score = 0;
let timeLeft = 30;
let isGameActive = false;

const WASTE_TYPES = [
    { name: 'Garrafa PET', type: 'plastic', color: '#ef4444', icon: '🍶' },
    { name: 'Papelão', type: 'paper', color: '#3b82f6', icon: '📦' },
    { name: 'Vidro', type: 'glass', color: '#22c55e', icon: '🍷' },
    { name: 'Latinha', type: 'metal', color: '#eab308', icon: '🥫' }
];

const BINS = {
    plastic: { name: 'Plástico', color: '#ef4444' },
    paper: { name: 'Papel', color: '#3b82f6' },
    glass: { name: 'Vidro', color: '#22c55e' }
};

// --- Efeitos Sonoros (Procedural Pop) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPopSound() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    
    // Frequência de bolha: Começa agudo e desce rápido
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

    // Envelope de volume: Ataque rápido e decay curto
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
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

function initCatchGame() {
    score = 0;
    timeLeft = 30;
    isGameActive = true;
    document.getElementById('gameInstructions').style.display = 'none';
    document.getElementById('gameScore').textContent = '0';
    document.getElementById('gameTime').textContent = '30';
    
    // Limpa canvas
    const canvas = document.getElementById('gameCanvas');
    const oldWaste = canvas.querySelectorAll('.game-waste-item');
    oldWaste.forEach(w => w.remove());

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

    // Movimento de queda
    let pos = -50;
    const speed = 2 + (score / 100); // Acelera conforme pontua
    
    const fall = setInterval(() => {
        if (!isGameActive) { clearInterval(fall); waste.remove(); return; }
        
        pos += speed;
        waste.style.top = pos + 'px';

        if (pos > canvas.offsetHeight - 80) {
            clearInterval(fall);
            waste.classList.add('fade-out');
            setTimeout(() => waste.remove(), 300);
            if (isGameActive) spawnWaste(); // Spawna o próximo
        }
    }, 20);

    waste.onclick = () => {
        if (!isGameActive) return;
        
        // Simulação simples de acerto (em breve faremos as lixeiras reais)
        // Por enquanto, apenas clique no item para "coletar"
        score += 10;
        document.getElementById('gameScore').textContent = score;
        playPopSound(); // Toca o som de bolha
        clearInterval(fall);
        waste.classList.add('collected');
        setTimeout(() => waste.remove(), 200);
        spawnWaste();
        
        if (window.gamification) {
            // Pequeno feedback visual hático se estiver no mobile seria bom aqui
        }
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
            <h2>Tempo Esgotado!</h2>
            <p>Você marcou <strong>${score}</strong> pontos.</p>
            <p>Ganhou <strong>${xpGained} XP</strong> para seu perfil!</p>
            <button class="btn btn-primary" onclick="initCatchGame()">Jogar Novamente</button>
        </div>
    `;
}
