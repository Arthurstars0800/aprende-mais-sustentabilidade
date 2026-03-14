const LEVELS = [
    { level: 1, name: "Semente Curiosa", minXp: 0, icon: "🌱" },
    { level: 2, name: "Brotinho Verde", minXp: 500, icon: "🌿" },
    { level: 3, name: "Árvore Jovem", minXp: 1200, icon: "🌳" },
    { level: 4, name: "Floresta Viva", minXp: 2500, icon: "🌲" },
    { level: 5, name: "Guardião Gaia", minXp: 4500, icon: "🌍" },
    { level: 6, name: "Defensor das Águas", minXp: 7000, icon: "💧" },
    { level: 7, name: "Mestre da Reciclagem", minXp: 10000, icon: "♻️" },
    { level: 8, name: "Protetor da Fauna", minXp: 13500, icon: "🦊" },
    { level: 9, name: "Aliado Solar", minXp: 17500, icon: "☀️" },
    { level: 10, name: "Herói Sustentável", minXp: 22000, icon: "🦸" },
    { level: 15, name: "Lenda Ecológica", minXp: 35000, icon: "🏆" },
    { level: 20, name: "Capivara Suprema", minXp: 50000, icon: "👑" }
];

let userProfile = {
    xp: 0,
    level: 1,
    badges: [],
    completedQuizzes: [],
    totalQuizzes: 6,
    unlockedItems: ['avatar_seed', 'theme-default'],
    unlockedEasterEgg: false,
    equipped: {
        avatar: 'avatar_seed',
        theme: 'theme-default',
        effect: 'effect_none'
    },
    lastVisit: Date.now(),
    dailyStreak: 0,
    audioMuted: true,
    isLoggedIn: false,
    googleUser: null // Armazena { name, email, picture }
};

// --- Google Auth Configuration ---
const GOOGLE_CLIENT_ID = "331980862086-pbt7v86884pveas2at8sc0tqg6pkv2nt.apps.googleusercontent.com"; // Substitua pelo seu ID se necessário

function initGoogleAuth() {
    if (typeof google === 'undefined') {
        console.warn("Google GSI script não carregado.");
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
        auto_select: false,
        cancel_on_tap_outside: true
    });

    renderGoogleButton();
}

function renderGoogleButton() {
    const btnContainer = document.getElementById('googleLoginBtn');
    if (!btnContainer) return;

    if (userProfile.isLoggedIn) {
        btnContainer.style.display = 'none';
        const img = document.getElementById('userProfileImg');
        if (img) {
            img.src = userProfile.googleUser.picture;
            img.style.display = 'block';
            img.title = `Logado como ${userProfile.googleUser.name} (${userProfile.googleUser.email})`;
            img.onclick = logoutGoogle;
        }
    } else {
        btnContainer.style.display = 'block';
        google.accounts.id.renderButton(
            btnContainer,
            { theme: "outline", size: "large", type: "icon", shape: "circle" }
        );
        const img = document.getElementById('userProfileImg');
        if (img) img.style.display = 'none';
    }
}

function handleGoogleLogin(response) {
    const payload = decodeJwt(response.credential);
    console.log("Usuário logado:", payload);

    userProfile.isLoggedIn = true;
    userProfile.googleUser = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture
    };

    // Migra o XP local para o perfil do Google se for a primeira vez
    // Ou carrega o XP específico desse e-mail se já existir
    const accountProgressKey = `eco_progress_${userProfile.googleUser.email}`;
    const savedAccountData = localStorage.getItem(accountProgressKey);

    if (savedAccountData) {
        const parsed = JSON.parse(savedAccountData);
        // Mantém as informações do Google User atuais
        userProfile = { ...userProfile, ...parsed, googleUser: userProfile.googleUser };
    }

    saveProgress();
    renderGoogleButton();
    showToast(`Bem-vindo, ${userProfile.googleUser.name}! 🌟`);
    updateHud();
}

function logoutGoogle() {
    if (confirm("Deseja sair da conta?")) {
        userProfile.isLoggedIn = false;
        userProfile.googleUser = null;
        saveProgress();
        window.location.reload();
    }
}

function decodeJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// --- Audio Engine (High Quality Assets) ---
let activeAudioElements = {};
let currentAmbienceType = null;

function stopAllAudio() {
    Object.values(activeAudioElements).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    if (window._ambienceTimers) {
        window._ambienceTimers.forEach(t => clearTimeout(t));
        window._ambienceTimers = [];
    }
}

function getAudioElement(id, src, loop = true) {
    if (!activeAudioElements[id]) {
        const audio = new Audio(src);
        audio.loop = loop;
        audio.volume = 0.4;
        activeAudioElements[id] = audio;
    }
    return activeAudioElements[id];
}

function playAmbience(type) {
    if (userProfile.audioMuted) return;

    const sounds = {
        'forest': 'assets/sounds/floresta.mp3',
        'wind': 'assets/sounds/floresta.mp3', // Usando floresta como base para vento também
        'rain': 'assets/sounds/chuva.mp3',
        'storm': 'assets/sounds/tempestade.mp3',
        'crickets': 'assets/sounds/grilo.mp3',
        'digital': 'assets/sounds/matrix.mp3',
        'matrix': 'assets/sounds/matrix.mp3',
        'scifi': 'assets/sounds/matrix.mp3'
    };

    const src = sounds[type];
    if (!src) return;

    stopAllAudio();
    const audio = getAudioElement(type, src);
    audio.play().catch(err => console.warn("Interação do usuário necessária para áudio:", err));
}

// Funções de ambiente removidas em favor da playAmbience geral para assets.

function getAmbienceType() {
    const effect = userProfile.equipped.effect;
    const theme = userProfile.equipped.theme;

    if (effect && effect !== 'effect_none') {
        if (effect === 'effect_leaves' || effect === 'effect_gold_leaves') return 'wind';
        if (effect === 'effect_rain') return 'rain';
        if (effect === 'effect_storm') return 'storm';
        if (effect === 'effect_vagalume') return 'crickets';
        if (effect === 'effect_digital_rain') return 'digital';
        if (effect === 'effect_matrix_rain') return 'matrix';
    }

    if (theme === 'theme-future') return 'scifi';
    return 'forest'; // default
}

function updateAmbience() {
    if (userProfile.audioMuted) {
        stopAllAudio();
        currentAmbienceType = null;
        return;
    }

    const targetType = getAmbienceType();

    // Don't restart if already playing the right ambience
    if (targetType === currentAmbienceType) return;

    stopAllAudio();
    currentAmbienceType = targetType;
    window._ambienceTimers = [];

    try {
        playAmbience(targetType);
        console.log(`🎵 Ambience: ${targetType}`);
    } catch (err) {
        console.warn("Erro ao iniciar áudio:", err);
    }
}

function setupAudioToggle() {
    console.log("Tentando configurar o botão de áudio...");
    if (!document.getElementById('audioToggle')) {
        const nav = document.querySelector('.navbar .container');
        if (nav) {
            const btn = document.createElement('button');
            btn.id = 'audioToggle';
            btn.className = 'dark-mode-toggle';
            btn.style.marginLeft = '12px';
            btn.style.cursor = 'pointer';
            btn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            btn.title = "Rádio Ecológica";

            const mobileToggle = nav.querySelector('.mobile-menu-toggle');
            if (mobileToggle) {
                nav.insertBefore(btn, mobileToggle);
            } else {
                nav.appendChild(btn);
            }

            console.log("Botão de áudio injetado na Navbar!");
            updateAudioUI();
        } else {
            console.warn("Navbar container não encontrado.");
        }
    }
}

function toggleMute() {
    userProfile.audioMuted = !userProfile.audioMuted;
    saveProgress();
    updateAudioUI();
    if (!userProfile.audioMuted) {
        // Agora usando Audio elements, não precisamos mais de resume explicito do actx
        updateAmbience();
    } else {
        stopAllAudio();
        currentAmbienceType = null;
    }
    showToast(userProfile.audioMuted ? "Rádio Silenciada 🔇" : "Rádio Ligada 📻");
}

function updateAudioUI() {
    const btn = document.getElementById('audioToggle');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (userProfile.audioMuted) {
        icon.className = 'fas fa-volume-mute';
        btn.style.color = '#9ca3af';
    } else {
        icon.className = 'fas fa-volume-up';
        btn.style.color = 'var(--primary)';
    }
}

// --- Global State ---

// --- Core Logic ---

function loadProgress() {
    const saved = localStorage.getItem('eco_progress');
    if (saved) {
        const savedData = JSON.parse(saved);
        userProfile = { ...userProfile, ...savedData };
    }
    if (!userProfile.completedQuizzes) userProfile.completedQuizzes = [];
    checkDailyVisit();
    updateHud();
    applyTheme();
    // Delay curto para garantir que a navbar carregou
    setTimeout(setupAudioToggle, 500);
}

function saveProgress() {
    localStorage.setItem('eco_progress', JSON.stringify(userProfile));
    
    // Se logado, também salva na chave específica do e-mail (Sincronização Local-Account)
    if (userProfile.isLoggedIn && userProfile.googleUser) {
        localStorage.setItem(`eco_progress_${userProfile.googleUser.email}`, JSON.stringify(userProfile));
    }
    
    updateHud();
}

function addXp(amount, reason = "") {
    userProfile.xp += amount;
    checkLevelUp();
    saveProgress();
    showToast(`+${amount} EcoPoints! 🌿 ${reason}`);
}

function checkLevelUp() {
    let newLevelObj = LEVELS[0];
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (userProfile.xp >= LEVELS[i].minXp) {
            newLevelObj = LEVELS[i];
            break;
        }
    }

    if (newLevelObj.level > userProfile.level) {
        userProfile.level = newLevelObj.level;
        showToast(`🎉 SUBIU DE NÍVEL! Agora você é: ${newLevelObj.name} ${newLevelObj.icon}`, 6000);
    }
}

function checkDailyVisit() {
    const now = new Date();
    const last = new Date(userProfile.lastVisit);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime();
    const diffDays = (today - lastDay) / (1000 * 60 * 60 * 24);

    if (today > lastDay) {
        if (diffDays === 1) {
            userProfile.dailyStreak = (userProfile.dailyStreak || 0) + 1;
        } else {
            userProfile.dailyStreak = 1;
        }

        const streakBonus = Math.min(userProfile.dailyStreak * 20, 200);
        const totalVisitXp = 100 + streakBonus;

        addXp(totalVisitXp, `(Visita Diária - Ofensiva de ${userProfile.dailyStreak} dias! 🔥)`);
        userProfile.lastVisit = now.getTime();
        saveProgress();
    }
}

// --- UI Components ---

function showToast(message, duration = 3000) {
    const existing = document.querySelector('.eco-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'eco-toast';
    toast.innerHTML = `
        <div class="eco-toast-icon">🌿</div>
        <div class="eco-toast-content">
            <span class="eco-toast-msg">${message}</span>
        </div>
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function updateHud() {
    const hud = document.getElementById('ecoHud');
    if (!hud) return;

    const fill = document.getElementById('ecoBarFill');
    const text = document.getElementById('ecoXpText');
    const icon = document.querySelector('.eco-level-icon');

    let currentLevelData = LEVELS.find(l => l.level === userProfile.level) || LEVELS[0];
    let nextLevelData = LEVELS.find(l => l.level === userProfile.level + 1);

    if (icon) icon.textContent = currentLevelData.icon;

    let percentage = 100;
    if (nextLevelData) {
        let min = currentLevelData.minXp;
        let max = nextLevelData.minXp;
        let current = userProfile.xp;
        percentage = Math.max(0, Math.min(100, Math.floor(((current - min) / (max - min)) * 100)));
    }

    if (fill) fill.style.width = `${percentage}%`;
    if (text) text.textContent = `${userProfile.xp} XP`;
    hud.title = `${currentLevelData.name} (Próximo nível em ${nextLevelData ? (nextLevelData.minXp - userProfile.xp) : 0} XP)`;
}

// --- Shop & Customization ---

const SHOP_ITEMS = {
    avatars: [
        { id: 'avatar_seed', name: 'Semente', icon: '🌱', reqLevel: 1 },
        { id: 'avatar_cat', name: 'Gatinho Reciclador', icon: '🐱', reqLevel: 5 },
        { id: 'avatar_robot', name: 'Robô G.A.I.A.', icon: '🤖', reqLevel: 10 },
        { id: 'avatar_capy', name: 'Capivara Suprema', icon: '👑', reqLevel: 20 }
    ],
    effects: [
        { id: 'effect_none', name: 'Nenhum', icon: '🚫', reqLevel: 1 },
        { id: 'effect_leaves', name: 'Chuva de Folhas', icon: '🍂', reqLevel: 3 },
        { id: 'effect_rain', name: 'Chuva Refrescante', icon: '🌧️', reqLevel: 4 },
        { id: 'effect_storm', name: 'Tempestade Feroz', icon: '⛈️ | ⚡', reqLevel: 9 },
        { id: 'effect_vagalume', name: 'Vagalumes', icon: '✨', reqLevel: 7 },
        { id: 'effect_gold_leaves', name: 'Folhas de Ouro', icon: '💰', reqLevel: 1, reqAllQuizzes: true },
        { id: 'effect_digital_rain', name: 'Chuva de Dados', icon: '💾', reqLevel: 1, reqTheme: 'theme-future' },
        { id: 'effect_matrix_rain', name: 'G.A.I.A. Matrix', icon: '🕶️', reqLevel: 1, isEasterEgg: true }
    ],
    themes: [
        { id: 'theme-default', name: 'Ambiental', icon: '🌿', reqLevel: 1 },
        { id: 'theme-future', name: 'G.A.I.A. Core', icon: '🌌', reqLevel: 20 }
    ]
};

function applyTheme() {
    const themeId = userProfile.equipped.theme || 'theme-default';
    document.body.classList.remove('theme-future');
    if (themeId === 'theme-future') document.body.classList.add('theme-future');
}

function openProfile() {
    const modal = document.createElement('div');
    modal.className = 'eco-modal-overlay';
    modal.id = 'ecoProfileModal';
    const currentLevel = LEVELS.find(l => l.level === userProfile.level) || LEVELS[0];

    modal.innerHTML = `
    <div class="eco-modal">
        <div class="eco-modal-header">
            <h2>Seu Perfil de Guardião</h2>
            <button class="eco-close-modal">&times;</button>
        </div>
        <div class="eco-modal-content">
            <div class="eco-profile-summary">
                <div class="eco-profile-avatar-big">${currentLevel.icon}</div>
                <div class="eco-profile-info">
                    <h3>${currentLevel.name}</h3>
                    <p>Nível ${userProfile.level}</p>
                    <p>Total: ${userProfile.xp} XP acumulados</p>
                </div>
            </div>
            <div class="eco-shop-tabs">
                <button class="eco-tab-btn active" data-tab="shop-effects">Efeitos Visuais</button>
                <button class="eco-tab-btn" data-tab="shop-avatars">Avatares</button>
                <button class="eco-tab-btn" data-tab="shop-themes">Temas</button>
            </div>
            <div class="eco-shop-grid" id="shopGrid"></div>
        </div>
    </div>`;

    document.body.appendChild(modal);
    renderShop('effects');

    modal.querySelector('.eco-close-modal').onclick = () => modal.remove();
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    modal.querySelectorAll('.eco-tab-btn').forEach(btn => {
        btn.onclick = () => {
            modal.querySelectorAll('.eco-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderShop(btn.dataset.tab.split('-')[1]);
        };
    });
}

function renderShop(category) {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;
    const items = SHOP_ITEMS[category] || [];
    grid.innerHTML = items.map(item => {
        const levelUnlocked = userProfile.level >= item.reqLevel;
        let themeUnlocked = item.reqTheme ? userProfile.equipped.theme === item.reqTheme : true;
        let quizzesUnlocked = item.reqAllQuizzes ? userProfile.completedQuizzes.length >= (userProfile.totalQuizzes || 6) : (item.reqQuizzes ? userProfile.completedQuizzes.length >= item.reqQuizzes : true);

        // Easter eggs remain hidden until found
        if (item.isEasterEgg && !userProfile.unlockedEasterEgg) return '';

        // FORCE UNLOCK FOR AVATARS (User Request)
        const isAvatar = category === 'avatars';
        const isUnlocked = isAvatar || (levelUnlocked && quizzesUnlocked && themeUnlocked);

        const isEquipped = category === 'effects' ? userProfile.equipped.effect === item.id : (category === 'avatars' ? userProfile.equipped.avatar === item.id : userProfile.equipped.theme === item.id);

        let statusText = isEquipped ? 'Equipado' : 'Usar';
        if (!isUnlocked) {
            if (!levelUnlocked) statusText = `🔒 Nvl ${item.reqLevel}`;
            else if (item.reqTheme && !themeUnlocked) statusText = `🔒 Tema Futuro`;
            else statusText = `🔒 Bloqueado`;
        }

        return `<div class="eco-shop-item ${!isUnlocked ? 'locked' : ''} ${isEquipped ? 'equipped' : ''}" 
                     onclick="equipItem('${category}', '${item.id}', ${isUnlocked})">
                    <div class="item-icon">${item.icon}</div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-status">${statusText}</div>
                </div>`;
    }).join('');
}

function equipItem(category, itemId, isUnlocked) {
    if (!isUnlocked) {
        showToast("Bloqueado! 🔒");
        return;
    }
    if (category === 'effects' && itemId === 'effect_storm') {
        showStormWarning(() => {
            userProfile.equipped.effect = itemId;
            saveProgress();
            renderShop(category);
            applyEffects();
            currentAmbienceType = null; // Force ambience refresh
            updateAmbience();
        });
        return;
    }
    if (category === 'effects') userProfile.equipped.effect = itemId;
    else if (category === 'avatars') userProfile.equipped.avatar = itemId;
    else if (category === 'themes') { userProfile.equipped.theme = itemId; applyTheme(); }
    saveProgress();
    renderShop(category);
    applyEffects();
    if (category === 'effects' || category === 'themes') {
        currentAmbienceType = null; // Force ambience refresh
        updateAmbience();
    }
    showToast(`Equipado! ✨`);
}

function showStormWarning(onConfirm) {
    const isFuture = document.body.classList.contains('theme-future');
    const isDark = document.body.classList.contains('dark-mode');

    const modal = document.createElement('div');
    modal.className = 'eco-modal-overlay';
    modal.style.zIndex = '10000';
    modal.style.backdropFilter = 'blur(10px)';

    const accentColor = isFuture ? '#00f3ff' : '#d97706';
    const bgColor = isFuture ? (isDark ? '#05010a' : '#0d1117') : (isDark ? '#2a2a2a' : '#fff');
    const textColor = isFuture ? '#c9d1d9' : 'var(--text-dark)';

    modal.innerHTML = `
    <div class="eco-modal" style="max-width: 450px; text-align: center; border: 2px solid ${accentColor}; background: ${bgColor}; box-shadow: 0 0 30px ${isFuture ? 'rgba(0,243,255,0.2)' : 'rgba(0,0,0,0.3)'};">
        <div style="font-size: 3rem; margin-bottom: 20px;">⚡</div>
        <h3 style="color: ${accentColor}; font-size: 1.8rem; margin-bottom: 15px; ${isFuture ? 'text-shadow: 0 0 10px #00f3ff;' : ''}">ALERTA DE SEGURANÇA</h3>
        <p style="color: ${textColor}; font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">
            O efeito <strong>Tempestade Feroz</strong> contém relâmpagos com flashes de luz intensos que podem causar desconforto ou crises em pessoas com fotossensibilidade.
            <br><br>
            Deseja prosseguir com a ativação?
        </p>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button class="btn btn-primary" id="confirmStorm" style="background: ${accentColor}; border: none; flex: 1; padding: 15px; font-weight: 800; border-radius: 12px; cursor: pointer;">SIM, ATIVAR</button>
            <button class="btn btn-outline" id="cancelStorm" style="border: 2px solid ${accentColor}; color: ${accentColor}; background: transparent; flex: 1; padding: 15px; font-weight: 800; border-radius: 12px; cursor: pointer;">CANCELAR</button>
        </div>
    </div>`;

    document.body.appendChild(modal);

    const confirmBtn = modal.querySelector('#confirmStorm');
    const cancelBtn = modal.querySelector('#cancelStorm');

    confirmBtn.onmouseover = () => { confirmBtn.style.transform = 'scale(1.05)'; confirmBtn.style.boxShadow = `0 0 20px ${accentColor}`; };
    confirmBtn.onmouseout = () => { confirmBtn.style.transform = 'scale(1)'; confirmBtn.style.boxShadow = 'none'; };

    cancelBtn.onmouseover = () => { cancelBtn.style.background = accentColor; cancelBtn.style.color = (isFuture || isDark) ? '#000' : '#fff'; };
    cancelBtn.onmouseout = () => { cancelBtn.style.background = 'transparent'; cancelBtn.style.color = accentColor; };

    modal.querySelector('#confirmStorm').onclick = () => { modal.remove(); onConfirm(); };
    modal.querySelector('#cancelStorm').onclick = () => modal.remove();
}

// --- Visual Effects ---

function applyEffects() {
    if (window.ecoEffectInterval) clearInterval(window.ecoEffectInterval);
    const existing = document.getElementById('ecoEffectLayer');
    if (existing) existing.remove();
    const oldWater = document.querySelector('.eco-flood-water');
    if (oldWater) oldWater.remove();

    clearTimeout(window.ecoLightningTimer);
    clearInterval(window.ecoFloodTimer);
    clearInterval(window.ecoBoatTimer);
    clearInterval(window.ecoSeaLifeTimer);

    const effect = userProfile.equipped.effect;
    if (!effect || effect === 'effect_none') return;

    const layer = document.createElement('div');
    layer.id = 'ecoEffectLayer';
    layer.className = `eco-effect-${effect}`;
    document.body.appendChild(layer);

    const VESSELS_SVG = {
        sailboat: `<svg viewBox="0 0 100 80" class="vessel-svg"><path d="M10 60 Q 50 80, 90 60 L 80 75 Q 50 85, 20 75 Z" fill="#5D4037" /><path d="M48 5 L 48 55 L 15 45 Z" fill="#FFFFFF" /><path d="M52 10 L 52 55 L 85 50 Z" fill="#F8F8F8" /></svg>`,
        jetski: `<svg viewBox="0 0 100 60" class="vessel-svg"><path d="M10 40 L 80 40 L 95 55 L 5 55 Z" fill="#2563eb" /><path d="M60 25 L 85 40 L 55 40 Z" fill="#1e40af" /></svg>`,
        pirate: `<svg viewBox="0 0 160 120" class="vessel-svg"><path d="M10 65 L 150 65 Q 160 65, 155 75 L 140 100 Q 80 115, 20 100 L 5 75 Q 0 65, 10 65 Z" fill="#3E2723" /><rect x="78" y="5" width="4" height="65" fill="#2D1B18" /><path d="M78 10 Q 50 30, 78 40 Q 106 30, 78 10 Z" fill="#111" /></svg>`,
        link: `<svg viewBox="0 0 100 80" class="vessel-svg"><rect x="10" y="55" width="80" height="10" rx="3" fill="#5D4037" /><rect x="15" y="52" width="70" height="10" rx="3" fill="#795548" /><path d="M40 52 L 60 52 L 58 35 L 42 35 Z" fill="#4CAF50" /><circle cx="50" cy="30" r="8" fill="#fbc199" /><path d="M43 25 L 57 25 L 50 5 Z" fill="#2E7D32" /><path d="M45 30 Q 50 25, 55 30" fill="none" stroke="#FFD600" stroke-width="3" /></svg>`,
        fish: `<svg viewBox="0 0 40 20" class="vessel-svg"><path d="M5 10 Q 20 0, 35 10 Q 20 20, 5 10 Z" fill="#ff9800" /></svg>`,
        shark: `<svg viewBox="0 0 100 40" class="vessel-svg"><path d="M10 20 Q 50 5, 90 20 Q 50 35, 10 20 Z" fill="#607d8b" /><path d="M40 10 L 55 10 L 45 20 Z" fill="#455a64" /></svg>`
    };

    const runBoatSpawner = (waterEl) => {
        window.ecoBoatTimer = setInterval(() => {
            if (userProfile.equipped.effect !== effect || !waterEl.parentNode) return;
            if (Math.random() > 0.4) return;
            const boat = document.createElement('div');
            boat.className = effect === 'effect_storm' ? (Math.random() > 0.1 ? 'eco-pirate' : 'eco-link-wood') : (Math.random() > 0.7 ? 'eco-jetski' : 'eco-boat');
            boat.innerHTML = `<div class="boat-icon">${boat.className === 'eco-pirate' ? VESSELS_SVG.pirate : (boat.className === 'eco-link-wood' ? VESSELS_SVG.link : (boat.className === 'eco-jetski' ? VESSELS_SVG.jetski : VESSELS_SVG.sailboat))}</div>`;
            const fromLeft = Math.random() > 0.5;
            const duration = 12 + Math.random() * 8;
            boat.style.left = fromLeft ? '-150px' : '105vw';
            boat.style.animation = `${fromLeft ? 'drift-right' : 'drift-left'} ${duration}s linear forwards`;
            if (!fromLeft) boat.style.transform = 'scaleX(-1)';
            waterEl.appendChild(boat);
            setTimeout(() => boat.remove(), duration * 1000);
        }, 4000);
    };

    const runSeaLifeSpawner = (waterEl) => {
        window.ecoSeaLifeTimer = setInterval(() => {
            if (userProfile.equipped.effect !== effect || !waterEl.parentNode) return;
            if (Math.random() > 0.5) return;
            const isShark = Math.random() > 0.8;
            const creature = document.createElement('div');
            creature.className = isShark ? 'eco-shark' : 'eco-fish';
            creature.innerHTML = `<div class="creature-icon">${isShark ? VESSELS_SVG.shark : VESSELS_SVG.fish}</div>`;
            const fromLeft = Math.random() > 0.5;
            const duration = 6 + Math.random() * 6;
            creature.style.left = fromLeft ? '-100px' : '105vw';
            creature.style.top = `${10 + Math.random() * 80}%`;
            creature.style.animation = `${fromLeft ? 'drift-right' : 'drift-left'} ${duration}s linear forwards`;
            if (!fromLeft) creature.style.transform = 'scaleX(-1)';
            waterEl.appendChild(creature);
            setTimeout(() => creature.remove(), duration * 1000);
        }, 2500);
    };

    if (effect === 'effect_rain' || effect === 'effect_storm') {
        const isStorm = effect === 'effect_storm';
        window.ecoEffectInterval = setInterval(() => {
            if (!document.getElementById('ecoEffectLayer')) return; // Safety check
            const drop = document.createElement('div');
            drop.className = isStorm ? 'eco-storm-drop' : 'eco-rain-drop';
            drop.style.left = Math.random() * 100 + 'vw';
            layer.appendChild(drop);
            // Optimized lifetime: enough to fall off screen but cleared faster
            setTimeout(() => { if (drop.parentNode) drop.remove(); }, 800);
        }, isStorm ? 15 : 40);

        if (isStorm) {
            const lightning = () => {
                if (userProfile.equipped.effect !== effect) return;
                const flash = document.createElement('div');
                flash.className = 'eco-lightning-flash';
                document.body.appendChild(flash);
                requestAnimationFrame(() => { flash.style.opacity = 0.5; setTimeout(() => { flash.style.opacity = 0; setTimeout(() => flash.remove(), 200); }, 100); });
                window.ecoLightningTimer = setTimeout(lightning, 5000 + Math.random() * 8000);
            };
            lightning();
        }

        const water = document.createElement('div');
        water.className = 'eco-flood-water';
        water.innerHTML = `<div class="water-wave-layer wave-3"></div><div class="water-wave-layer wave-2"></div><div class="water-wave-layer wave-1"></div><div class="wave-shine"></div>`;
        document.body.appendChild(water);
        let level = 1;
        const maxLevel = isStorm ? 25 : 6;
        window.ecoFloodTimer = setInterval(() => {
            if (level < maxLevel) { level += 0.5; water.style.height = level + 'vh'; }
            else { water.style.height = (maxLevel + Math.sin(Date.now() / 1000) * (isStorm ? 2 : 0.5)) + 'vh'; }
        }, 50);

        runBoatSpawner(water);
        runSeaLifeSpawner(water);
    } else if (effect === 'effect_leaves' || effect === 'effect_gold_leaves') {
        window.ecoEffectInterval = setInterval(() => {
            const types = ['type-1', 'type-2', 'type-3', 'boldo'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            const leaf = document.createElement('div');
            leaf.className = `eco-leaf eco-leaf-${randomType} ${effect === 'effect_gold_leaves' ? 'eco-leaf-gold' : ''}`;
            leaf.style.left = Math.random() * 100 + 'vw';
            layer.appendChild(leaf);
            setTimeout(() => leaf.remove(), 12000);
        }, 1200);
    } else if (effect === 'effect_vagalume') {
        window.ecoEffectInterval = setInterval(() => {
            const glow = document.createElement('div');
            glow.className = 'eco-vagalume';
            glow.style.left = Math.random() * 100 + 'vw';
            glow.style.top = Math.random() * 100 + 'vh';
            layer.appendChild(glow);
            setTimeout(() => glow.remove(), 10000);
        }, 800);
    } else if (effect === 'effect_digital_rain' || effect === 'effect_matrix_rain') {
        const isMatrix = effect === 'effect_matrix_rain';
        window.ecoEffectInterval = setInterval(() => {
            const bit = document.createElement('div');
            bit.className = `eco-data-bit ${isMatrix ? 'matrix-style' : ''}`;
            bit.textContent = Math.random() > 0.5 ? '1' : '0';
            bit.style.left = Math.random() * 100 + 'vw';
            bit.style.fontSize = (0.8 + Math.random() * 1.5) + 'rem';
            bit.style.animationDuration = (2 + Math.random() * 3) + 's';
            layer.appendChild(bit);
            setTimeout(() => bit.remove(), 5000);
        }, isMatrix ? 50 : 150);
    }
}

function updateTotalQuizzes(count) {
    if (count && count !== userProfile.totalQuizzes) {
        userProfile.totalQuizzes = count;
        saveProgress();
    }
}

function markQuizComplete(quizType) {
    if (!userProfile.completedQuizzes) userProfile.completedQuizzes = [];
    if (!userProfile.completedQuizzes.includes(quizType)) {
        userProfile.completedQuizzes.push(quizType);
        saveProgress();
    }
}

// --- Initialization ---

window.gamification = { addXp, markQuizComplete, updateTotalQuizzes, userProfile, loadProgress, openProfile };

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    applyEffects();
    
    // Inicializa o Google Auth com um pequeno delay para carregar o SDK
    setTimeout(initGoogleAuth, 1000);

    const hud = document.getElementById('ecoHud');
    if (hud) {
        hud.addEventListener('click', (e) => {
            if (e.target.classList.contains('eco-level-icon')) {
                window.clickCount = (window.clickCount || 0) + 1;

                // 7 cliques = Easter Egg Matrix
                if (window.clickCount === 7) {
                    userProfile.unlockedEasterEgg = true;
                    saveProgress();
                    showToast("🕵️ MODO HACKER ATIVADO!");
                }

                // 30 cliques = Console para Celular (Eruda)
                if (window.clickCount === 30) {
                    showToast("🛠️ ABRINDO CONSOLE DE DEV...");
                    const script = document.createElement('script');
                    script.src = "//cdn.jsdelivr.net/npm/eruda";
                    document.body.appendChild(script);
                    script.onload = function () {
                        eruda.init();
                        eruda.show();
                    };
                }
            }
            openProfile();
        });
    }

    document.addEventListener('click', (e) => {
        const audioBtn = e.target.closest('#audioToggle');
        if (audioBtn) {
            toggleMute();
        }
    });

    window.addEventListener('storage', (e) => {
        if (e.key === 'eco_progress' && e.newValue) {
            const newData = JSON.parse(e.newValue);
            const effectChanged = newData.equipped.effect !== userProfile.equipped.effect;
            const themeChanged = newData.equipped.theme !== userProfile.equipped.theme;
            const muteChanged = newData.audioMuted !== userProfile.audioMuted;

            userProfile = newData;
            updateHud();

            if (themeChanged) applyTheme();
            if (effectChanged || themeChanged || muteChanged) {
                applyEffects();
                updateAmbience();
                updateAudioUI();
            }

            if (document.getElementById('ecoProfileModal')) {
                const activeTabBtn = document.querySelector('.eco-tab-btn.active');
                if (activeTabBtn) renderShop(activeTabBtn.dataset.tab.split('-')[1]);
            }
        }
    });

    window.addEventListener('scroll', () => {
        const layer = document.getElementById('ecoEffectLayer');
        if (layer) {
            const shift = Math.max(-20, Math.min(20, -window.scrollY * 0.1));
            layer.style.setProperty('--eco-scroll-shift-y', `${shift}px`);
        }
    }, { passive: true });
});
