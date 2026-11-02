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
    totalQuizzes: 10,
    unlockedItems: ['avatar_seed', 'theme-default', 'theme-ice', 'effect_snowflakes', 'effect_glaciers', 'effect_aurora', 'effect_butterflies'],
    unlockedEasterEgg: false,
    equipped: {
        avatar: 'avatar_seed',
        theme: 'theme-default',
        effect: 'effect_none'
    },
    lastVisit: Date.now(),
    dailyStreak: 0,
    audioMuted: true,
    compactMode: false, // Modo de baixo desempenho — reduz partículas
    pageTransitions: true, // Transições suaves ao navegar
    isLoggedIn: false,
    googleUser: null // Armazena { name, email, picture }
};

// --- Google Auth Configuration ---
const GOOGLE_CLIENT_ID = "230988263001-3qm1suf4lq2mohdqig6tuq48bbtglsm7.apps.googleusercontent.com";
let _googleInitRetries = 0;

function initGoogleAuth() {
    // Renderiza imediatamente usando o estado salvo no localStorage sem delay
    renderGoogleButton();

    if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
        if (_googleInitRetries < 20) {
            _googleInitRetries++;
            setTimeout(initGoogleAuth, 300);
        }
        return;
    }

    try {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleLogin,
            auto_select: true,
            cancel_on_tap_outside: true
        });

        // Se ainda não estiver logado, exibe One-Tap se disponível
        if (!userProfile.isLoggedIn) {
            google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // One-Tap ignorado pelo usuário ou navegador
                }
            });
        }
    } catch (e) {
        console.warn("Google Auth initialize error:", e);
    }

    renderGoogleButton();
}

function renderGoogleButton() {
    const btnContainer = document.getElementById('googleLoginBtn');
    const img = document.getElementById('userProfileImg');
    if (!btnContainer && !img) return;

    if (userProfile.isLoggedIn && userProfile.googleUser) {
        if (btnContainer) {
            btnContainer.style.display = 'none';
        }
        if (img) {
            if (userProfile.googleUser.picture) {
                img.src = userProfile.googleUser.picture;
            }
            img.style.display = 'block';
            img.title = `Guardião: ${userProfile.googleUser.name} (${userProfile.googleUser.email}) - Clique para ver o perfil`;
            img.onclick = () => openProfile();
        }
    } else {
        if (img) {
            img.style.display = 'none';
        }
        if (btnContainer) {
            btnContainer.style.display = 'block';
            if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
                try {
                    google.accounts.id.renderButton(
                        btnContainer,
                        { 
                            theme: "filled_blue", 
                            size: "large", 
                            type: "standard", 
                            shape: "rectangular",
                            text: "signin_with",
                            logo_alignment: "left",
                            width: 200
                        }
                    );
                } catch (e) {
                    console.warn("Erro ao renderizar botão do Google:", e);
                }
            }
        }
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

    localStorage.setItem('eco_last_logged_email', payload.email);

    // Migra o XP local para o perfil do Google se for a primeira vez
    // Ou carrega o XP específico desse e-mail se já existir
    const accountProgressKey = `eco_progress_${userProfile.googleUser.email}`;
    const savedAccountData = localStorage.getItem(accountProgressKey);

    if (savedAccountData) {
        try {
            const parsed = JSON.parse(savedAccountData);
            userProfile = { ...userProfile, ...parsed, isLoggedIn: true, googleUser: userProfile.googleUser };
        } catch (e) {
            console.error("Erro ao ler save da conta Google:", e);
        }
    }

    saveProgress();
    renderGoogleButton();
    showToast(`Bem-vindo, ${userProfile.googleUser.name}! 🌟`);
    updateHud();
}

function logoutGoogle() {
    if (confirm("Deseja sair da sua conta Google? Seu progresso local continuará salvo neste navegador.")) {
        userProfile.isLoggedIn = false;
        userProfile.googleUser = null;
        localStorage.removeItem('eco_last_logged_email');
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            try {
                google.accounts.id.disableAutoSelect();
            } catch (_) {}
        }
        saveProgress();
        renderGoogleButton();
        updateHud();
        showToast("Você saiu da conta.");
        const modal = document.getElementById('ecoProfileModal');
        if (modal) modal.remove();
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
        if (effect === 'effect_leaves' || effect === 'effect_gold_leaves' || effect === 'effect_glaciers' || effect === 'effect_snowflakes' || effect === 'effect_aurora') return 'wind';
        if (effect === 'effect_windmill') return 'wind';
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
    if (document.getElementById('audioToggle')) {
        updateAudioUI();
        return;
    }
    
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
        try {
            const savedData = JSON.parse(saved);
            userProfile = { ...userProfile, ...savedData };
        } catch (e) {
            console.error("Erro ao ler eco_progress:", e);
        }
        // Garante que itens padrão sempre estejam desbloqueados,
        // mesmo em saves antigos que não os tinham
        const defaultUnlocked = ['avatar_seed', 'theme-default', 'theme-ice', 'effect_snowflakes', 'effect_glaciers', 'effect_aurora', 'effect_butterflies'];
        defaultUnlocked.forEach(item => {
            if (!userProfile.unlockedItems.includes(item)) {
                userProfile.unlockedItems.push(item);
            }
        });
        // Se estava com tema legado de deltarune, restaura para o padrão
        if (userProfile.equipped && userProfile.equipped.theme === 'theme-deltarune') {
            userProfile.equipped.theme = 'theme-default';
        }
        userProfile.unlockedItems = (userProfile.unlockedItems || []).filter(item => item !== 'theme-deltarune');
    }

    // Se houver uma conta Google conectada, sincroniza com o save específico do e-mail para não perder a sessão ao trocar de abas
    const emailToSync = (userProfile.googleUser && userProfile.googleUser.email) || localStorage.getItem('eco_last_logged_email');
    if (emailToSync) {
        const accountProgressKey = `eco_progress_${emailToSync}`;
        const savedAccountData = localStorage.getItem(accountProgressKey);
        if (savedAccountData) {
            try {
                const parsed = JSON.parse(savedAccountData);
                userProfile = { 
                    ...userProfile, 
                    ...parsed, 
                    isLoggedIn: true, 
                    googleUser: userProfile.googleUser || parsed.googleUser 
                };
            } catch (e) {
                console.warn("Erro ao sincronizar dados da conta:", e);
            }
        }
    }

    if (!userProfile.completedQuizzes) userProfile.completedQuizzes = [];
    checkDailyVisit();
    updateHud();
    applyTheme();
    renderGoogleButton(); // Exibe a foto do usuário ou botão instantaneamente sem delay
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

    if (icon) {
        const equippedAvatarId = userProfile.equipped.avatar || 'avatar_seed';
        const equippedAvatar = SHOP_ITEMS.avatars.find(a => a.id === equippedAvatarId);
        icon.textContent = equippedAvatar ? equippedAvatar.icon : currentLevelData.icon;
        
        if (userProfile.isLoggedIn) {
            icon.classList.add('google-active');
        } else {
            icon.classList.remove('google-active');
        }
    }

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
    renderGoogleButton();
}

// --- Shop & Customization ---

const SHOP_ITEMS = {
    avatars: [
        { id: 'avatar_seed', name: 'Semente Curiosa', icon: '🌱', reqLevel: 1 },
        { id: 'avatar_sprout', name: 'Brotinho Verde', icon: '🌿', reqLevel: 2 },
        { id: 'avatar_young_tree', name: 'Árvore Jovem', icon: '🌳', reqLevel: 3 },
        { id: 'avatar_live_forest', name: 'Floresta Viva', icon: '🌲', reqLevel: 4 },
        { id: 'avatar_gaia_guardian', name: 'Guardião Gaia', icon: '🌍', reqLevel: 5 },
        { id: 'avatar_water_defender', name: 'Defensor das Águas', icon: '💧', reqLevel: 6 },
        { id: 'avatar_recycling_master', name: 'Mestre da Reciclagem', icon: '♻️', reqLevel: 7 },
        { id: 'avatar_fauna_protector', name: 'Protetor da Fauna', icon: '🦊', reqLevel: 8 },
        { id: 'avatar_solar_ally', name: 'Aliado Solar', icon: '☀️', reqLevel: 9 },
        { id: 'avatar_eco_hero', name: 'Herói Sustentável', icon: '🦸', reqLevel: 10 },
        { id: 'avatar_eco_legend', name: 'Lenda Ecológica', icon: '🏆', reqLevel: 15 },
        { id: 'avatar_capy_supreme', name: 'Capivara Suprema', icon: '👑', reqLevel: 20 },
        { id: 'avatar_cat', name: 'Gatinho Reciclador', icon: '🐱', reqLevel: 5 },
        { id: 'avatar_robot', name: 'Robô G.A.I.A.', icon: '🤖', reqLevel: 10 }
    ],
    effects: [
        { id: 'effect_none', name: 'Nenhum', icon: '🚫', reqLevel: 1 },
        { id: 'effect_leaves', name: 'Chuva de Folhas', icon: '🍂', reqLevel: 3 },
        { id: 'effect_rain', name: 'Chuva Refrescante', icon: '🌧️', reqLevel: 4 },
        { id: 'effect_storm', name: 'Tempestade Feroz', icon: '⛈️', reqLevel: 9 },
        { id: 'effect_vagalume', name: 'Vagalumes', icon: '✨', reqLevel: 7 },
        { id: 'effect_windmill', name: 'Brisa Suave', icon: '🌀', reqLevel: 1, reqEnergyQuizzes: ['eolica', 'solar', 'cidades_verdes'] },
        { id: 'effect_gold_leaves', name: 'Folhas de Ouro', icon: '💰', reqLevel: 1, reqAllQuizzes: true },
        { id: 'effect_digital_rain', name: 'Chuva de Dados', icon: '💾', reqLevel: 20, reqTheme: 'theme-future', isSpecial: true },
        { id: 'effect_matrix_rain', name: 'G.A.I.A. Matrix', icon: '🕶️', reqLevel: 1, isEasterEgg: true },
        { id: 'effect_star_blazing', name: 'Star Blazing', icon: '🌠', reqLevel: 1, isEasterEgg: true },
        { id: 'effect_snowflakes', name: 'Flocos de Neve', icon: '❄️', reqLevel: 1 },
        { id: 'effect_glaciers', name: 'Mar Glacial', icon: '🏔️', reqLevel: 1 },
        { id: 'effect_aurora', name: 'Aurora Boreal', icon: '🌌', reqLevel: 1 },
        { id: 'effect_butterflies', name: 'Jardim de Borboletas', icon: '🦋', reqLevel: 1 }
    ],
    themes: [
        { id: 'theme-default', name: 'Ambiental', icon: '🌿', reqLevel: 1 },
        { id: 'theme-ice', name: 'Resfriamento Global', icon: '🧊', reqLevel: 1 },
        { id: 'theme-windstock', name: 'Oásis Eólico', icon: '🌬️', reqLevel: 1, reqEnergyQuizzes: ['eolica', 'solar', 'cidades_verdes'] },
        { id: 'theme-future', name: 'G.A.I.A. Core', icon: '🌌', reqLevel: 20 }
    ]
};

function applyTheme() {
    let themeId = userProfile.equipped.theme || 'theme-default';
    if (themeId === 'theme-deltarune') {
        themeId = 'theme-default';
        userProfile.equipped.theme = 'theme-default';
        saveProgress();
    }
    document.body.classList.remove('theme-future', 'theme-windstock', 'theme-deltarune', 'theme-ice');
    
    if (themeId === 'theme-future') {
        // Ao equipar/iniciar com o G.A.I.A. Core, ativa compulsoriamente o modo escuro
        if (!document.body.classList.contains('dark-mode')) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            const icon = document.querySelector('#darkModeToggle i');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
        document.body.classList.add('theme-future');
    } else if (themeId === 'theme-windstock') {
        document.body.classList.add('theme-windstock');
    } else if (themeId === 'theme-ice') {
        document.body.classList.add('theme-ice');
    }

    if (typeof window.onThemeApplied === 'function') {
        window.onThemeApplied(themeId);
    }
}

function openProfile() {
    const modal = document.createElement('div');
    modal.className = 'eco-modal-overlay';
    modal.id = 'ecoProfileModal';
    const currentLevel = LEVELS.find(l => l.level === userProfile.level) || LEVELS[0];

    const equippedAvatarId = userProfile.equipped.avatar || 'avatar_seed';
    const equippedAvatar = SHOP_ITEMS.avatars.find(a => a.id === equippedAvatarId);
    const avatarIcon = equippedAvatar ? equippedAvatar.icon : currentLevel.icon;

    const nextLevelData = LEVELS.find(l => l.level === userProfile.level + 1);
    let percentage = 100;
    if (nextLevelData) {
        let min = currentLevel.minXp;
        let max = nextLevelData.minXp;
        let current = userProfile.xp;
        percentage = Math.max(0, Math.min(100, Math.floor(((current - min) / (max - min)) * 100)));
    }

    modal.innerHTML = `
    <div class="eco-modal">
        <div class="eco-modal-header">
            <div class="eco-modal-header-bg"></div>
            <h2>🏆 Seu Perfil de Guardião</h2>
            <button class="eco-close-modal">&times;</button>
        </div>
        <div class="eco-modal-content">
            <div class="eco-profile-summary">
                <div class="eco-profile-avatar-big">${avatarIcon}</div>
                <div class="eco-profile-info">
                    <h3>${currentLevel.name}</h3>
                    <p class="eco-profile-level">Nível ${userProfile.level}</p>
                    <div class="profile-xp-progress">
                        <div class="profile-xp-labels">
                            <span>${userProfile.xp} XP</span>
                            <span>${nextLevelData ? nextLevelData.minXp + ' XP' : 'MAX'}</span>
                        </div>
                        <div class="profile-xp-bar-container">
                            <div class="profile-xp-bar-fill" style="width: ${percentage}%;"></div>
                        </div>
                        <p class="profile-xp-needed-text">
                            ${nextLevelData 
                                ? `Faltam <strong>${nextLevelData.minXp - userProfile.xp} XP</strong> para o nível ${userProfile.level + 1} (${nextLevelData.name})`
                                : 'Você alcançou o nível máximo como Lenda Suprema! 🌟'}
                        </p>
                    </div>
                </div>
            </div>
            <div class="eco-shop-tabs">
                <button class="eco-tab-btn active" data-tab="shop-effects">✨ Efeitos</button>
                <button class="eco-tab-btn" data-tab="shop-avatars">😊 Avatares</button>
                <button class="eco-tab-btn" data-tab="shop-themes">🎨 Temas</button>
                <button class="eco-tab-btn" data-tab="shop-settings">⚙️ Config</button>
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
            const tab = btn.dataset.tab.split('-')[1];
            if (tab === 'settings') renderSettings();
            else renderShop(tab);
        };
    });
}

function renderSettings() {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;

    const currentTrackName = {
        'forest': userProfile.equipped.effect === 'effect_butterflies' ? 'Bosque das Borboletas 🦋' : 'Bosque & Floresta 🌲',
        'wind': userProfile.equipped.effect === 'effect_aurora' ? 'Ventos Polares & Noite Ártica 🌌' : 'Brisa dos Ventos 🍃',
        'rain': 'Chuva Suave 🌧️',
        'storm': 'Tempestade com Trovões ⛈️',
        'crickets': 'Noite dos Vagalumes 🦗',
        'digital': 'Matriz Digital G.A.I.A. 💾',
        'matrix': 'Matrix Hacker Terminal 🕶️',
        'scifi': 'Frequência Futurista 🤖'
    }[getAmbienceType()] || 'Sons da Natureza 🌿';

    grid.innerHTML = `
        <div class="eco-settings-grid">
            <div class="eco-setting-card">
                <div class="eco-setting-info">
                    <span class="eco-setting-title">⚡ Modo Compacto / Alto Desempenho</span>
                    <span class="eco-setting-desc">Reduz a intensidade de partículas e taxas de atualização dos efeitos visuais. Ideal para celulares ou computadores com lentidão.</span>
                </div>
                <label class="eco-switch" title="Ativar/desativar modo compacto">
                    <input type="checkbox" id="settingCompactMode" ${userProfile.compactMode ? 'checked' : ''}>
                    <span class="eco-switch-slider"></span>
                </label>
            </div>

            <div class="eco-setting-card">
                <div class="eco-setting-info">
                    <span class="eco-setting-title">📻 Rádio Ecológica (Som Ambiente)</span>
                    <span class="eco-setting-desc">Áudio relaxante sincronizado com o efeito ativo. <br><small style="color:var(--primary, #10b981);">Trilha para este efeito: <strong>${currentTrackName}</strong></small></span>
                </div>
                <label class="eco-switch" title="Ligar/desligar áudio ambiente">
                    <input type="checkbox" id="settingAudioMuted" ${!userProfile.audioMuted ? 'checked' : ''}>
                    <span class="eco-switch-slider"></span>
                </label>
            </div>

            <div class="eco-setting-card">
                <div class="eco-setting-info">
                    <span class="eco-setting-title">✨ Transições Suaves entre Páginas</span>
                    <span class="eco-setting-desc">Fade elegante ao alternar entre as abas e páginas do portal para uma experiência mais fluida.</span>
                </div>
                <label class="eco-switch" title="Ativar/desativar transições suaves">
                    <input type="checkbox" id="settingPageTransitions" ${userProfile.pageTransitions !== false ? 'checked' : ''}>
                    <span class="eco-switch-slider"></span>
                </label>
            </div>

            <div class="eco-setting-card" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 15px;">
                <div class="eco-setting-info">
                    <span class="eco-setting-title">👤 Conta Google & Sincronização</span>
                    <span class="eco-setting-desc">${userProfile.isLoggedIn && userProfile.googleUser ? `Conectado como <strong>${userProfile.googleUser.name}</strong> (${userProfile.googleUser.email}). Seu XP e desbloqueios estão sincronizados.` : 'Nenhuma conta Google conectada. Conecte pelo botão no topo da página para salvar seus pontos em múltiplos aparelhos.'}</span>
                </div>
                ${userProfile.isLoggedIn ? `<button type="button" class="eco-logout-btn" onclick="logoutGoogle()" style="background:#ef4444; color:white; border:none; padding:8px 16px; border-radius:10px; font-weight:700; cursor:pointer; font-size:0.85rem; transition:transform 0.2s, background 0.2s;">Sair da Conta</button>` : ''}
            </div>
        </div>
    `;

    const compactToggle = document.getElementById('settingCompactMode');
    if (compactToggle) {
        compactToggle.onchange = () => {
            userProfile.compactMode = compactToggle.checked;
            saveProgress();
            applyEffects();
            showToast(userProfile.compactMode ? "Modo Compacto Ativado! ⚡" : "Efeitos em Qualidade Total! 🌿");
        };
    }

    const audioToggleInput = document.getElementById('settingAudioMuted');
    if (audioToggleInput) {
        audioToggleInput.onchange = () => {
            toggleMute();
            audioToggleInput.checked = !userProfile.audioMuted;
        };
    }

    const transToggle = document.getElementById('settingPageTransitions');
    if (transToggle) {
        transToggle.onchange = () => {
            userProfile.pageTransitions = transToggle.checked;
            saveProgress();
            showToast(userProfile.pageTransitions ? "Transições Suaves Ativadas! ✨" : "Transições Imediatas!");
        };
    }
}

function renderShop(category) {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;
    const items = SHOP_ITEMS[category] || [];
    grid.innerHTML = items.map(item => {
        const levelUnlocked = userProfile.level >= item.reqLevel;
        let themeUnlocked = item.reqTheme ? userProfile.equipped.theme === item.reqTheme : true;
        let quizzesUnlocked = item.reqAllQuizzes ? userProfile.completedQuizzes.length >= (userProfile.totalQuizzes || 7) : (item.reqQuizzes ? userProfile.completedQuizzes.length >= item.reqQuizzes : true);

        if (item.reqEnergyQuiz) {
            const hasEnergy = userProfile.completedQuizzes && userProfile.completedQuizzes.includes('energia');
            const totalDone = userProfile.completedQuizzes ? userProfile.completedQuizzes.length : 0;
            const hasMinQuizzes = totalDone >= (item.reqMinQuizzes || 3);
            if (!hasEnergy || !hasMinQuizzes) {
                quizzesUnlocked = false;
            }
        }

        // Easter eggs remain hidden until found
        const isCurrentEquipped = (category === 'effects' ? userProfile.equipped.effect === item.id : userProfile.equipped.theme === item.id);
        if (item.isDeltarune && !localStorage.getItem('drThemeUnlocked') && !isCurrentEquipped) return '';
        if (item.isEasterEgg && !item.isDeltarune && !userProfile.unlockedEasterEgg && !isCurrentEquipped) return '';

        // FORCE UNLOCK FOR AVATARS (User Request)
        // Now avatars unlock when the user rises in levels
        const isAvatar = category === 'avatars';
        const isUnlocked = isAvatar ? levelUnlocked : (levelUnlocked && quizzesUnlocked && themeUnlocked);

        const isEquipped = category === 'effects' ? userProfile.equipped.effect === item.id : (category === 'avatars' ? userProfile.equipped.avatar === item.id : userProfile.equipped.theme === item.id);

        let statusText = isEquipped ? 'Equipado' : 'Usar';
        if (!isUnlocked) {
            if (item.reqEnergyQuiz) {
                const hasEnergy = userProfile.completedQuizzes && userProfile.completedQuizzes.includes('energia');
                const totalDone = userProfile.completedQuizzes ? userProfile.completedQuizzes.length : 0;
                if (!hasEnergy) statusText = `🔒 Quiz Energia`;
                else if (totalDone < (item.reqMinQuizzes || 3)) statusText = `🔒 ${totalDone}/${item.reqMinQuizzes || 3} Quizzes`;
                else if (!levelUnlocked) statusText = `🔒 Nvl ${item.reqLevel}`;
            } else if (!levelUnlocked) statusText = `🔒 Nvl ${item.reqLevel}`;
            else if (item.reqTheme && !themeUnlocked) statusText = `🔒 Tema G.A.I.A.`;
            else statusText = `🔒 Bloqueado`;
        }

        const specialBadge = item.isSpecial ? `<span class="item-special-tag">ESPECIAL</span>` : '';

        return `<div class="eco-shop-item ${item.isSpecial ? 'special-item' : ''} ${!isUnlocked ? 'locked' : ''} ${isEquipped ? 'equipped' : ''}" 
                     onclick="equipItem('${category}', '${item.id}', ${isUnlocked})">
                    ${specialBadge}
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
    else if (category === 'themes') {
        userProfile.equipped.theme = itemId;
        // Desequipa efeito se exigir um tema específico diferente do novo
        const currentEffectObj = SHOP_ITEMS.effects.find(e => e.id === userProfile.equipped.effect);
        if (currentEffectObj && currentEffectObj.reqTheme && currentEffectObj.reqTheme !== itemId) {
            userProfile.equipped.effect = 'effect_none';
        }
        applyTheme();
    }
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
    const modal = document.createElement('div');
    modal.className = 'eco-modal-overlay';
    modal.id = 'stormWarningModal';

    modal.innerHTML = `
    <div class="eco-warning-modal">
        <div class="eco-warning-ambient"></div>
        <button class="eco-warning-close" id="closeStormModal" title="Fechar">&times;</button>
        <div class="eco-warning-icon-wrapper">
            <svg viewBox="0 0 24 24" class="eco-warning-svg">
                <path fill="currentColor" d="M7 2v11h3v9l7-12h-4l4-8z"/>
            </svg>
        </div>
        <div class="eco-warning-badge">
            <span>⚠️ AVISO DE FOTOSSENSIBILIDADE</span>
        </div>
        <h3 class="eco-warning-title">Tempestade Feroz</h3>
        <div class="eco-warning-desc">
            <p>Este efeito visual inclui <strong>relâmpagos e clarões de luz intensos</strong> durante a navegação.</p>
            <p class="eco-warning-sub">Pode causar desconforto ou crises em pessoas com <strong>fotossensibilidade ou epilepsia fotossensível</strong>.</p>
        </div>
        <p class="eco-warning-prompt">Deseja prosseguir com a ativação?</p>
        <div class="eco-warning-actions">
            <button class="eco-warning-btn-cancel" id="cancelStorm">Cancelar</button>
            <button class="eco-warning-btn-confirm" id="confirmStorm">Sim, Ativar</button>
        </div>
    </div>`;

    document.body.appendChild(modal);

    const closeModal = () => modal.remove();

    modal.querySelector('#closeStormModal').onclick = closeModal;
    modal.querySelector('#cancelStorm').onclick = closeModal;
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    modal.querySelector('#confirmStorm').onclick = () => {
        closeModal();
        onConfirm();
    };
}

// Helper — retorna configurações ajustadas pelo modo compacto
function ecoCompact(normal, reduced) {
    return userProfile.compactMode ? reduced : normal;
}

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

    // Para o Star Blazing se o efeito mudou para outro
    if (effect !== 'effect_star_blazing' && typeof window.stopStarBlazing === 'function') {
        window.stopStarBlazing();
    }

    if (!effect || effect === 'effect_none') {
        updateAmbience();
        return;
    }

    // ── JARDIM DE BORBOLETAS ────────────────────────────────────
    if (effect === 'effect_butterflies') {
        const butterflyLayer = document.createElement('div');
        butterflyLayer.id = 'ecoEffectLayer';
        butterflyLayer.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;overflow:hidden;';
        document.body.appendChild(butterflyLayer);

        const SPECIES = [
            { id: 'monarch', name: 'Monarca', grad: ['#ea580c', '#f97316'], accent: '#18181b', spot: '#ffffff' },
            { id: 'morpho', name: 'Azul Morfo', grad: ['#0284c7', '#38bdf8'], accent: '#0c4a6e', spot: '#bae6fd' },
            { id: 'emerald', name: 'Esmeralda', grad: ['#059669', '#34d399'], accent: '#064e3b', spot: '#a7f3d0' },
            { id: 'amethyst', name: 'Ametista', grad: ['#7c3aed', '#ec4899'], accent: '#4c1d95', spot: '#fbcfe8' },
            { id: 'solar', name: 'Dourada Solar', grad: ['#d97706', '#facc15'], accent: '#78350f', spot: '#fef08a' }
        ];

        function createButterflySVG(species, id) {
            return `
            <svg viewBox="0 0 54 44" class="eco-butterfly-svg">
                <defs>
                    <linearGradient id="bfGrad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${species.grad[0]}" />
                        <stop offset="100%" stop-color="${species.grad[1]}" />
                    </linearGradient>
                </defs>
                <!-- Asa Esquerda -->
                <g class="wing-left">
                    <path d="M 26,19 C 24,10 13,2 4,6 C -1,8 1,18 10,22 C 18,25 24,23 26,19 Z" fill="url(#bfGrad_${id})" stroke="${species.accent}" stroke-width="0.8" />
                    <path d="M 25,21 C 21,26 12,36 6,34 C 2,32 5,24 14,21 C 20,19 23,20 25,21 Z" fill="url(#bfGrad_${id})" stroke="${species.accent}" stroke-width="0.7" opacity="0.92" />
                    <circle cx="5" cy="8" r="1" fill="${species.spot}" opacity="0.85" />
                    <circle cx="8" cy="13" r="0.8" fill="${species.spot}" opacity="0.85" />
                    <circle cx="7" cy="32" r="0.8" fill="${species.spot}" opacity="0.85" />
                    <line x1="26" y1="19" x2="8" y2="10" stroke="${species.accent}" stroke-width="0.6" opacity="0.6" />
                </g>
                <!-- Asa Direita -->
                <g class="wing-right">
                    <path d="M 28,19 C 30,10 41,2 50,6 C 55,8 53,18 44,22 C 36,25 30,23 28,19 Z" fill="url(#bfGrad_${id})" stroke="${species.accent}" stroke-width="0.8" />
                    <path d="M 29,21 C 33,26 42,36 48,34 C 52,32 49,24 40,21 C 34,19 31,20 29,21 Z" fill="url(#bfGrad_${id})" stroke="${species.accent}" stroke-width="0.7" opacity="0.92" />
                    <circle cx="49" cy="8" r="1" fill="${species.spot}" opacity="0.85" />
                    <circle cx="46" cy="13" r="0.8" fill="${species.spot}" opacity="0.85" />
                    <circle cx="47" cy="32" r="0.8" fill="${species.spot}" opacity="0.85" />
                    <line x1="28" y1="19" x2="46" y2="10" stroke="${species.accent}" stroke-width="0.6" opacity="0.6" />
                </g>
                <!-- Corpo Central da Borboleta -->
                <g class="butterfly-body">
                    <ellipse cx="27" cy="20" rx="1.6" ry="7" fill="#1e293b" />
                    <circle cx="27" cy="12" r="1.8" fill="#0f172a" />
                    <!-- Antenas -->
                    <path d="M 26,11 Q 23,6 20,7" stroke="#1e293b" stroke-width="0.6" fill="none" stroke-linecap="round" />
                    <path d="M 28,11 Q 31,6 34,7" stroke="#1e293b" stroke-width="0.6" fill="none" stroke-linecap="round" />
                    <circle cx="20" cy="7" r="0.6" fill="#334155" />
                    <circle cx="34" cy="7" r="0.6" fill="#334155" />
                </g>
            </svg>`;
        }

        let bfIdCounter = 0;

        function spawnButterfly() {
            if (!document.getElementById('ecoEffectLayer')) return;
            const maxButterflies = ecoCompact(8, 4);
            if (document.querySelectorAll('.eco-butterfly-wrapper').length >= maxButterflies) return;

            bfIdCounter++;
            const species = SPECIES[Math.floor(Math.random() * SPECIES.length)];
            const size = Math.random() * 24 + 58; // 58px a 82px (maiores e mais imponentes)
            const duration = (Math.random() * 5 + 9).toFixed(1); // 9s a 14s (voo sereno)

            const wrapper = document.createElement('div');
            wrapper.className = 'eco-butterfly-wrapper';

            // Escolhe entre 3 trajetórias: L->R (45%), R->L (40%), ou Ascendente (15%)
            const trajectoryRand = Math.random();
            let animName, startTop, startLeft;

            if (trajectoryRand < 0.45) {
                animName = 'flyLeftToRight';
                startTop = (10 + Math.random() * 70) + 'vh';
                startLeft = '0';
                wrapper.style.top = startTop;
                wrapper.style.left = startLeft;
            } else if (trajectoryRand < 0.85) {
                animName = 'flyRightToLeft';
                startTop = (10 + Math.random() * 70) + 'vh';
                startLeft = '0';
                wrapper.style.top = startTop;
                wrapper.style.left = startLeft;
            } else {
                animName = 'flyAscendSpiral';
                startTop = '0';
                startLeft = (15 + Math.random() * 70) + 'vw';
                wrapper.style.top = startTop;
                wrapper.style.left = startLeft;
            }

            wrapper.style.animation = `${animName} ${duration}s cubic-bezier(0.35, 0, 0.25, 1) forwards`;

            const butterflyEl = document.createElement('div');
            const speedClass = Math.random() < 0.35 ? 'speed-fast' : (Math.random() < 0.5 ? 'speed-gentle' : '');
            butterflyEl.className = `eco-butterfly ${speedClass}`;
            butterflyEl.style.width = size + 'px';
            butterflyEl.style.height = (size * 0.82) + 'px';
            butterflyEl.innerHTML = createButterflySVG(species, bfIdCounter);

            wrapper.appendChild(butterflyEl);
            butterflyLayer.appendChild(wrapper);

            // Rastro de pólen cintilante ocasional
            if (Math.random() < 0.6) {
                const pollenInterval = setInterval(() => {
                    if (!wrapper.parentNode) {
                        clearInterval(pollenInterval);
                        return;
                    }
                    const rect = butterflyEl.getBoundingClientRect();
                    if (rect.x > -50 && rect.x < window.innerWidth + 50 && rect.y > -50 && rect.y < window.innerHeight + 50) {
                        const pollen = document.createElement('div');
                        pollen.className = 'eco-butterfly-pollen';
                        pollen.style.left = (rect.x + rect.width / 2) + 'px';
                        pollen.style.top = (rect.y + rect.height / 2) + 'px';
                        pollen.style.setProperty('--pollen-dx', (Math.random() * 12 - 6) + 'px');
                        document.body.appendChild(pollen);
                        setTimeout(() => { if (pollen.parentNode) pollen.remove(); }, 1200);
                    }
                }, 400);
            }

            wrapper.addEventListener('animationend', () => {
                if (wrapper.parentNode) wrapper.remove();
            });
            setTimeout(() => {
                if (wrapper.parentNode) wrapper.remove();
            }, parseFloat(duration) * 1000 + 1000);
        }

        // Spawn inicial suave
        const initialCount = ecoCompact(2, 1);
        for (let i = 0; i < initialCount; i++) {
            setTimeout(spawnButterfly, i * 1400);
        }

        window.ecoEffectInterval = setInterval(spawnButterfly, ecoCompact(3400, 6000));
        updateAmbience();
        return;
    }

    // ── FLOCOS DE NEVE ────────────────────────────────────────
    if (effect === 'effect_snowflakes') {
        const snowLayer = document.createElement('div');
        snowLayer.id = 'ecoEffectLayer';
        snowLayer.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;overflow:hidden;';
        document.body.appendChild(snowLayer);
        const SNOWFLAKES = ['❄', '❅', '❆', '✦', '·'];

        function createFlake(initialY) {
            if (document.querySelectorAll('.eco-snowflake').length >= ecoCompact(35, 15)) return;
            const flake = document.createElement('span');
            flake.className = 'eco-snowflake';
            flake.textContent = SNOWFLAKES[Math.floor(Math.random() * SNOWFLAKES.length)];
            const size = Math.random() * 18 + 12;
            const drift = (Math.random() - 0.5) * 140;
            const duration = Math.random() * 4 + 4;
            const startY = (typeof initialY === 'number') ? initialY : -40;

            flake.style.left = (Math.random() * 100) + 'vw';
            flake.style.top = startY + 'px';
            flake.style.fontSize = size + 'px';
            flake.style.color = `rgba(255, 255, 255, ${(Math.random() * 0.4 + 0.6).toFixed(2)})`;
            flake.style.textShadow = '0 0 8px rgba(186, 230, 253, 0.9), 0 0 16px rgba(56, 189, 248, 0.6)';
            flake.style.animation = `snowfall ${duration}s linear forwards`;
            flake.style.setProperty('--drift', `${drift}px`);

            snowLayer.appendChild(flake);
            flake.addEventListener('animationend', () => {
                if (flake.parentNode) flake.remove();
            });
        }

        // Spawn inicial imediato para não demorar
        for (let i = 0; i < ecoCompact(15, 6); i++) {
            createFlake(Math.random() * window.innerHeight * 0.85);
        }

        window.ecoEffectInterval = setInterval(() => {
            createFlake();
        }, ecoCompact(220, 500));
        return;
    }

    // ── AURORA BOREAL ──────────────────────────────────────────
    if (effect === 'effect_aurora') {
        const auroraLayer = document.createElement('div');
        auroraLayer.id = 'ecoEffectLayer';
        auroraLayer.className = 'eco-aurora-sky';

        auroraLayer.innerHTML = `
            <div class="eco-aurora-curtain-layer">
                <!-- Ribbon 1: Grande Arco Esmeralda — Morfologia Dinâmica Contínua -->
                <svg viewBox="0 0 1600 900" preserveAspectRatio="none" class="eco-aurora-ribbon eco-aurora-ribbon-1">
                    <defs>
                        <linearGradient id="auroraGrad1" x1="0%" y1="20%" x2="100%" y2="80%">
                            <stop offset="0%" stop-color="#10b981" stop-opacity="0" />
                            <stop offset="20%" stop-color="#059669" stop-opacity="0.25" />
                            <stop offset="48%" stop-color="#34d399" stop-opacity="0.52" />
                            <stop offset="75%" stop-color="#06b6d4" stop-opacity="0.32" />
                            <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="M -80,560 C 260,220 580,120 900,290 C 1220,460 1420,340 1680,190 L 1680,360 C 1420,510 1220,630 900,460 C 580,290 260,390 -80,720 Z" fill="url(#auroraGrad1)">
                        <animate attributeName="d" dur="22s" repeatCount="indefinite" values="
                            M -80,560 C 260,220 580,120 900,290 C 1220,460 1420,340 1680,190 L 1680,360 C 1420,510 1220,630 900,460 C 580,290 260,390 -80,720 Z;
                            M -80,410 C 240,550 560,380 920,520 C 1240,640 1440,410 1680,280 L 1680,450 C 1440,580 1240,780 920,670 C 560,540 240,700 -80,580 Z;
                            M -80,280 C 280,340 600,560 940,380 C 1260,210 1460,320 1680,480 L 1680,640 C 1460,480 1260,370 940,530 C 600,720 280,500 -80,440 Z;
                            M -80,490 C 300,160 640,240 980,180 C 1280,120 1480,290 1680,340 L 1680,510 C 1480,450 1280,280 980,340 C 640,400 300,320 -80,650 Z;
                            M -80,560 C 260,220 580,120 900,290 C 1220,460 1420,340 1680,190 L 1680,360 C 1420,510 1220,630 900,460 C 580,290 260,390 -80,720 Z
                        " />
                    </path>
                </svg>

                <!-- Ribbon 2: Véu Ciano Cruzado — Morfologia Dinâmica em S -->
                <svg viewBox="0 0 1600 900" preserveAspectRatio="none" class="eco-aurora-ribbon eco-aurora-ribbon-2">
                    <defs>
                        <linearGradient id="auroraGrad2" x1="0%" y1="30%" x2="100%" y2="70%">
                            <stop offset="0%" stop-color="#0284c7" stop-opacity="0" />
                            <stop offset="25%" stop-color="#06b6d4" stop-opacity="0.26" />
                            <stop offset="52%" stop-color="#38bdf8" stop-opacity="0.45" />
                            <stop offset="78%" stop-color="#22d3ee" stop-opacity="0.28" />
                            <stop offset="100%" stop-color="#0891b2" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="M -100,290 C 240,520 620,690 960,480 C 1300,280 1480,500 1680,390 L 1680,550 C 1480,660 1300,440 960,640 C 620,830 240,680 -100,450 Z" fill="url(#auroraGrad2)">
                        <animate attributeName="d" dur="27s" repeatCount="indefinite" values="
                            M -100,290 C 240,520 620,690 960,480 C 1300,280 1480,500 1680,390 L 1680,550 C 1480,660 1300,440 960,640 C 620,830 240,680 -100,450 Z;
                            M -100,460 C 280,310 660,180 1000,340 C 1320,490 1460,360 1680,240 L 1680,400 C 1460,520 1320,650 1000,500 C 660,340 280,470 -100,620 Z;
                            M -100,380 C 220,240 580,480 920,310 C 1260,140 1480,380 1680,490 L 1680,650 C 1480,540 1260,300 920,470 C 580,640 220,400 -100,540 Z;
                            M -100,520 C 300,640 680,450 1020,580 C 1340,690 1480,440 1680,320 L 1680,480 C 1480,600 1340,840 1020,740 C 680,610 300,790 -100,680 Z;
                            M -100,290 C 240,520 620,690 960,480 C 1300,280 1480,500 1680,390 L 1680,550 C 1480,660 1300,440 960,640 C 620,830 240,680 -100,450 Z
                        " />
                    </path>
                </svg>

                <!-- Ribbon 3: Coroa Violeta & Magenta — Morfologia Fluida Superior -->
                <svg viewBox="0 0 1600 900" preserveAspectRatio="none" class="eco-aurora-ribbon eco-aurora-ribbon-3">
                    <defs>
                        <linearGradient id="auroraGrad3" x1="0%" y1="15%" x2="100%" y2="85%">
                            <stop offset="0%" stop-color="#7c3aed" stop-opacity="0" />
                            <stop offset="25%" stop-color="#a855f7" stop-opacity="0.28" />
                            <stop offset="50%" stop-color="#ec4899" stop-opacity="0.40" />
                            <stop offset="76%" stop-color="#c084fc" stop-opacity="0.22" />
                            <stop offset="100%" stop-color="#9333ea" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="M -60,410 C 320,130 720,250 1080,140 C 1380,70 1520,260 1680,160 L 1680,290 C 1520,390 1380,200 1080,270 C 720,380 320,260 -60,540 Z" fill="url(#auroraGrad3)">
                        <animate attributeName="d" dur="31s" repeatCount="indefinite" values="
                            M -60,410 C 320,130 720,250 1080,140 C 1380,70 1520,260 1680,160 L 1680,290 C 1520,390 1380,200 1080,270 C 720,380 320,260 -60,540 Z;
                            M -60,260 C 300,380 680,520 1020,330 C 1320,160 1500,290 1680,380 L 1680,510 C 1500,420 1320,290 1020,460 C 680,650 300,510 -60,390 Z;
                            M -60,480 C 260,280 620,180 960,350 C 1300,510 1480,330 1680,220 L 1680,350 C 1480,460 1300,640 960,480 C 620,310 260,410 -60,610 Z;
                            M -60,350 C 280,460 640,320 980,440 C 1300,540 1500,210 1680,120 L 1680,250 C 1500,340 1300,670 980,570 C 640,450 280,590 -60,480 Z;
                            M -60,410 C 320,130 720,250 1080,140 C 1380,70 1520,260 1680,160 L 1680,290 C 1520,390 1380,200 1080,270 C 720,380 320,260 -60,540 Z
                        " />
                    </path>
                </svg>

                <!-- Raios Difusos Inclinados com o Campo Magnético -->
                <div class="eco-aurora-rays"></div>
            </div>
        `;

        document.body.appendChild(auroraLayer);

        // Estrelas cintilantes no céu polar centralizado
        const starCount = ecoCompact(15, 6);
        for (let s = 0; s < starCount; s++) {
            const star = document.createElement('div');
            star.className = 'eco-aurora-star';
            const size = Math.random() * 2 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.left = (Math.random() * 98) + 'vw';
            star.style.top = (15 + Math.random() * 65) + 'vh';
            star.style.animationDelay = (Math.random() * 5).toFixed(1) + 's';
            star.style.animationDuration = (Math.random() * 3 + 3).toFixed(1) + 's';
            auroraLayer.appendChild(star);
        }

        updateAmbience();
        return;
    }

    const layer = document.createElement('div');
    layer.id = 'ecoEffectLayer';
    layer.className = `eco-effect-${effect}`;
    document.body.appendChild(layer);

    const VESSELS_SVG = {
        // 1. Veleiro Clássico Elegante
        sailboat: `<svg viewBox="0 0 110 85" class="vessel-svg">
            <defs>
                <linearGradient id="hullGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="60%" stop-color="#f1f5f9"/>
                    <stop offset="100%" stop-color="#cbd5e1"/>
                </linearGradient>
                <linearGradient id="sailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#e2e8f0"/>
                </linearGradient>
            </defs>
            <!-- Casco -->
            <path d="M12 62 Q 55 82 98 62 L 88 74 Q 55 84 20 74 Z" fill="url(#hullGrad)" stroke="#334155" stroke-width="1.5" />
            <path d="M12 62 Q 55 82 98 62" fill="none" stroke="#2563eb" stroke-width="3" />
            <!-- Mastro e Estais -->
            <line x1="52" y1="8" x2="52" y2="65" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
            <line x1="52" y1="8" x2="14" y2="62" stroke="#94a3b8" stroke-width="1" />
            <line x1="52" y1="8" x2="96" y2="62" stroke="#94a3b8" stroke-width="1" />
            <!-- Velas Encurvadas -->
            <path d="M50 12 L 18 58 Q 36 54 49 58 Z" fill="url(#sailGrad)" stroke="#cbd5e1" stroke-width="1" />
            <path d="M54 16 L 94 56 Q 74 52 54 60 Z" fill="url(#sailGrad)" stroke="#cbd5e1" stroke-width="1" />
            <!-- Flâmula -->
            <polygon points="52,8 52,14 42,11" fill="#ef4444" />
        </svg>`,

        // 2. Moto Aquática Esportiva (Jet-Ski)
        jetski: `<svg viewBox="0 0 110 55" class="vessel-svg">
            <defs>
                <linearGradient id="jetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8"/>
                    <stop offset="60%" stop-color="#2563eb"/>
                    <stop offset="100%" stop-color="#1e3a8a"/>
                </linearGradient>
            </defs>
            <!-- Spray de Água -->
            <path d="M5 45 Q 12 30 2 20 Q 15 32 10 46" fill="#93c5fd" opacity="0.75" />
            <!-- Casco Aerodinâmico -->
            <path d="M10 42 L 85 42 L 104 34 L 88 24 L 52 24 L 40 32 L 10 35 Z" fill="url(#jetGrad)" stroke="#0f172a" stroke-width="1.5" />
            <path d="M55 24 L 75 16 L 82 24 Z" fill="#0f172a" />
            <path d="M38 24 L 58 24 L 52 30 L 32 30 Z" fill="#1e293b" />
            <!-- Guidão e Piloto Estilizado -->
            <circle cx="50" cy="14" r="5" fill="#facc15" />
            <path d="M46 19 L 56 19 L 52 25 L 44 25 Z" fill="#ef4444" />
            <line x1="68" y1="18" x2="62" y2="23" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`,

        // 3. Galeão Pirata Fantasma das Tempestades
        pirate: `<svg viewBox="0 0 170 130" class="vessel-svg">
            <defs>
                <linearGradient id="pirateHull" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#5d4037"/>
                    <stop offset="50%" stop-color="#3e2723"/>
                    <stop offset="100%" stop-color="#1c100b"/>
                </linearGradient>
                <linearGradient id="blackSail" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#3f3f46"/>
                    <stop offset="50%" stop-color="#27272a"/>
                    <stop offset="100%" stop-color="#18181b"/>
                </linearGradient>
                <filter id="lanternGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <!-- Borrifos de Onda na Proa -->
            <path d="M145 105 Q 165 95 152 82 Q 150 96 138 100" fill="#ffffff" opacity="0.8" />
            <!-- Casco Robusto de Madeira Negra -->
            <path d="M12 72 Q 40 68 85 70 Q 130 68 156 62 L 142 105 Q 85 118 24 105 Z" fill="url(#pirateHull)" stroke="#090503" stroke-width="2" />
            <!-- Detalhes de Madeira e Canhões Iluminados -->
            <line x1="20" y1="84" x2="148" y2="78" stroke="#1c100b" stroke-width="2" />
            <line x1="24" y1="94" x2="140" y2="90" stroke="#1c100b" stroke-width="2" />
            <!-- Canhoneiras com Luz Âmbar -->
            <circle cx="45" cy="88" r="3.5" fill="#f59e0b" filter="url(#lanternGlow)" />
            <circle cx="70" cy="86" r="3.5" fill="#f59e0b" filter="url(#lanternGlow)" />
            <circle cx="95" cy="84" r="3.5" fill="#f59e0b" filter="url(#lanternGlow)" />
            <circle cx="120" cy="82" r="3.5" fill="#f59e0b" filter="url(#lanternGlow)" />
            <!-- Castelo de Popa e Lanterna -->
            <path d="M12 72 L 32 54 L 32 74 Z" fill="#2d1810" stroke="#090503" stroke-width="1.5" />
            <circle cx="10" cy="68" r="4" fill="#fbbf24" filter="url(#lanternGlow)" />
            <!-- Bauprés (Pau de Gurupés) -->
            <line x1="140" y1="68" x2="168" y2="48" stroke="#3e2723" stroke-width="3" stroke-linecap="round"/>
            <!-- 3 Mastros Principais -->
            <line x1="48" y1="20" x2="48" y2="76" stroke="#2d1810" stroke-width="3.5" stroke-linecap="round"/>
            <line x1="88" y1="10" x2="88" y2="76" stroke="#2d1810" stroke-width="4" stroke-linecap="round"/>
            <line x1="124" y1="24" x2="124" y2="76" stroke="#2d1810" stroke-width="3.5" stroke-linecap="round"/>
            <!-- Velames Rasgados da Tempestade -->
            <!-- Mastro da Frente (Trinquete) -->
            <path d="M110 32 Q 124 24 138 32 L 134 56 Q 124 48 112 56 Z" fill="url(#blackSail)" stroke="#18181b" stroke-width="1.2" />
            <!-- Mastro Grande (Principal) -->
            <path d="M72 18 Q 88 10 104 18 L 102 42 Q 88 34 74 42 Z" fill="url(#blackSail)" stroke="#18181b" stroke-width="1.2" />
            <path d="M70 46 Q 88 38 106 46 L 102 68 Q 88 60 74 68 Z" fill="url(#blackSail)" stroke="#18181b" stroke-width="1.2" />
            <!-- Mastro da Popa (Mezena) -->
            <path d="M34 28 Q 48 20 62 28 L 60 52 Q 48 44 36 52 Z" fill="url(#blackSail)" stroke="#18181b" stroke-width="1.2" />
            <!-- Bandeira Pirata Jolly Roger (Caveira) -->
            <path d="M88 10 L 64 6 L 68 18 Z" fill="#090503" />
            <circle cx="75" cy="11" r="2.5" fill="#f8fafc" />
            <line x1="72" y1="14" x2="78" y2="14" stroke="#f8fafc" stroke-width="1" />
        </svg>`,

        // 4. Barco de Resgate / Traineira na Tempestade
        trawler: `<svg viewBox="0 0 130 75" class="vessel-svg">
            <defs>
                <linearGradient id="trawlHull" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="50%" stop-color="#0f172a"/>
                    <stop offset="100%" stop-color="#020617"/>
                </linearGradient>
            </defs>
            <!-- Borrifo frontal -->
            <path d="M110 58 Q 128 48 118 36 Q 116 50 104 55" fill="#ffffff" opacity="0.8" />
            <!-- Casco Robusto com Faixa Laranja de Resgate -->
            <path d="M12 42 L 115 42 L 102 64 Q 60 72 18 64 Z" fill="url(#trawlHull)" stroke="#090d16" stroke-width="1.5" />
            <path d="M12 42 L 115 42 L 111 48 L 14 48 Z" fill="#ea580c" />
            <!-- Cabine de Navegação -->
            <path d="M42 20 L 78 20 L 82 42 L 38 42 Z" fill="#f1f5f9" stroke="#334155" stroke-width="1.5" />
            <!-- Janelas Iluminadas -->
            <rect x="46" y="24" width="8" height="8" rx="1.5" fill="#fde047" stroke="#334155" stroke-width="1" />
            <rect x="58" y="24" width="8" height="8" rx="1.5" fill="#fde047" stroke="#334155" stroke-width="1" />
            <rect x="70" y="24" width="8" height="8" rx="1.5" fill="#fde047" stroke="#334155" stroke-width="1" />
            <!-- Mastro de Radar e Antena -->
            <line x1="60" y1="8" x2="60" y2="20" stroke="#475569" stroke-width="2.5" />
            <circle cx="60" cy="7" r="2.5" fill="#ef4444" />
            <!-- Bóia Salva-vidas -->
            <circle cx="28" cy="48" r="4.5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
        </svg>`,

        // 5. Jangada Heróica do Link
        link: `<svg viewBox="0 0 110 85" class="vessel-svg">
            <defs>
                <linearGradient id="woodLog" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="#854d0e"/>
                    <stop offset="50%" stop-color="#a16207"/>
                    <stop offset="100%" stop-color="#713f12"/>
                </linearGradient>
            </defs>
            <!-- Troncos Amarrados -->
            <rect x="8" y="58" width="94" height="10" rx="5" fill="url(#woodLog)" stroke="#451a03" stroke-width="1.5" />
            <rect x="14" y="54" width="82" height="9" rx="4.5" fill="url(#woodLog)" stroke="#451a03" stroke-width="1.5" />
            <!-- Mastro e Vela com Triforce -->
            <line x1="45" y1="12" x2="45" y2="56" stroke="#5c2c0e" stroke-width="3" stroke-linecap="round"/>
            <path d="M45 16 L 82 48 Q 64 45 45 52 Z" fill="#fef3c7" stroke="#d97706" stroke-width="1.2" />
            <!-- Símbolo Triforce na Vela -->
            <polygon points="56,36 64,36 60,29" fill="#f59e0b" />
            <!-- Barril de Suprimentos -->
            <ellipse cx="28" cy="52" rx="6" ry="7" fill="#92400e" stroke="#451a03" stroke-width="1" />
            <!-- Link com Gorro Verde e Escudo -->
            <circle cx="65" cy="44" r="5" fill="#fed7aa" />
            <path d="M60 42 L 72 42 L 68 33 Z" fill="#16a34a" />
            <ellipse cx="71" cy="47" rx="3.5" ry="5.5" fill="#1d4ed8" stroke="#f59e0b" stroke-width="1" />
        </svg>`,

        // 6. Tubarão-Branco Predador das Tempestades
        shark: `<svg viewBox="0 0 130 52" class="vessel-svg">
            <defs>
                <linearGradient id="sharkBack" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#334155"/>
                    <stop offset="60%" stop-color="#475569"/>
                    <stop offset="100%" stop-color="#f8fafc"/>
                </linearGradient>
            </defs>
            <!-- Cauda Caudal -->
            <path d="M12 26 C 2 12, 0 4, 4 2 C 8 16, 18 20, 26 24 C 18 28, 8 32, 6 48 C 2 46, 4 36, 12 26 Z" fill="#334155" />
            <!-- Barbatana Dorsal Afiada -->
            <path d="M62 18 C 66 6, 74 0, 78 2 C 78 10, 76 16, 70 20 Z" fill="#334155" />
            <!-- Corpo Hidrodinâmico com Degradê -->
            <path d="M18 25 C 34 22, 65 16, 108 20 C 122 22, 128 26, 124 30 C 112 36, 75 40, 36 34 C 24 32, 18 28, 18 25 Z" fill="url(#sharkBack)" stroke="#1e293b" stroke-width="1" />
            <!-- Barbatana Peitoral -->
            <path d="M78 30 C 82 42, 88 48, 92 48 C 92 42, 88 34, 86 30 Z" fill="#475569" />
            <!-- Fendas Branquiais (5 guelras) -->
            <line x1="88" y1="24" x2="87" y2="30" stroke="#1e293b" stroke-width="1" stroke-linecap="round"/>
            <line x1="91" y1="24" x2="90" y2="30" stroke="#1e293b" stroke-width="1" stroke-linecap="round"/>
            <line x1="94" y1="24" x2="93" y2="30" stroke="#1e293b" stroke-width="1" stroke-linecap="round"/>
            <!-- Olho Predador -->
            <circle cx="112" cy="24" r="2.2" fill="#0f172a" />
            <circle cx="112.6" cy="23.4" r="0.8" fill="#ffffff" />
            <!-- Mandíbula e Dentes Afiados -->
            <path d="M106 31 Q 115 32 118 30" fill="none" stroke="#0f172a" stroke-width="1.2" />
            <polygon points="110,31 112,29 114,31" fill="#ffffff" />
            <polygon points="114,31 116,29 117,31" fill="#ffffff" />
        </svg>`,

        // 7. Peixe Dourado / Tropical Vibrante
        fish: `<svg viewBox="0 0 65 38" class="vessel-svg">
            <defs>
                <linearGradient id="fishBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fb923c"/>
                    <stop offset="45%" stop-color="#ea580c"/>
                    <stop offset="85%" stop-color="#c2410c"/>
                    <stop offset="100%" stop-color="#fde047"/>
                </linearGradient>
                <linearGradient id="finGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#fed7aa"/>
                    <stop offset="100%" stop-color="#f97316"/>
                </linearGradient>
            </defs>
            <!-- Barbatana Caudal Ondulada -->
            <path d="M16 19 C 4 8, 2 2, 6 2 C 10 10, 14 15, 18 16 C 14 20, 10 24, 6 34 C 2 34, 4 28, 16 19 Z" fill="url(#finGrad)" opacity="0.9" />
            <!-- Barbatana Dorsal com Raios -->
            <path d="M26 12 C 34 2, 44 2, 48 8 C 42 10, 34 11, 26 12 Z" fill="url(#finGrad)" />
            <!-- Corpo Hidrodinâmico com Reflexo -->
            <path d="M16 19 C 24 10, 42 8, 56 16 C 60 19, 60 21, 56 24 C 42 32, 24 30, 16 19 Z" fill="url(#fishBody)" stroke="#9a3412" stroke-width="0.8" />
            <!-- Faixa Refletiva Suave -->
            <path d="M38 12 Q 41 20 38 28" fill="none" stroke="#fef08a" stroke-width="2" opacity="0.75" />
            <!-- Barbatana Peitoral Translúcida -->
            <path d="M36 21 C 42 24, 44 28, 42 30 C 38 30, 36 26, 36 21 Z" fill="url(#finGrad)" opacity="0.85" />
            <!-- Olho Expressivo -->
            <circle cx="50" cy="18" r="3.2" fill="#ffffff" />
            <circle cx="50.8" cy="18" r="2" fill="#0f172a" />
            <circle cx="51.4" cy="17.4" r="0.8" fill="#ffffff" />
            <!-- Linha da Guelra -->
            <path d="M45 15 Q 47 19 45 23" fill="none" stroke="#7c2d12" stroke-width="1" stroke-linecap="round" />
        </svg>`,

        // 8. Água-viva Bioluminescente das Profundezas
        jellyfish: `<svg viewBox="0 0 55 70" class="vessel-svg">
            <defs>
                <linearGradient id="jellyBell" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8"/>
                    <stop offset="50%" stop-color="#818cf8"/>
                    <stop offset="100%" stop-color="#c084fc"/>
                </linearGradient>
                <filter id="jellyGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
            </defs>
            <!-- Tentáculos Ondulantes Fluorescentes -->
            <path d="M16 28 Q 12 44 18 64" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />
            <path d="M22 28 Q 28 42 20 66" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" opacity="0.85" />
            <path d="M28 28 Q 24 45 32 68" fill="none" stroke="#e879f9" stroke-width="2" stroke-linecap="round" opacity="0.9" />
            <path d="M34 28 Q 40 44 32 66" fill="none" stroke="#a855f7" stroke-width="1.8" stroke-linecap="round" opacity="0.85" />
            <path d="M40 28 Q 36 44 42 64" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />
            <!-- Cúpula Translúcida Brilhante -->
            <path d="M10 26 C 10 10, 46 10, 46 26 C 40 28, 34 25, 28 27 C 22 25, 16 28, 10 26 Z" fill="url(#jellyBell)" opacity="0.75" filter="url(#jellyGlow)" />
            <!-- Núcleo Radiante Interno -->
            <ellipse cx="28" cy="20" rx="9" ry="6" fill="#ffffff" opacity="0.7" filter="url(#jellyGlow)" />
        </svg>`,

        // 9. Iceberg Gigante Cristalino
        icebergLarge: `<svg viewBox="0 0 150 110" class="vessel-svg">
            <defs>
                <linearGradient id="icePeakLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="50%" stop-color="#e0f2fe"/>
                    <stop offset="100%" stop-color="#bae6fd"/>
                </linearGradient>
                <linearGradient id="icePeakShadow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7dd3fc"/>
                    <stop offset="60%" stop-color="#38bdf8"/>
                    <stop offset="100%" stop-color="#0284c7"/>
                </linearGradient>
                <linearGradient id="iceCrevasse" x1="0%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8"/>
                    <stop offset="70%" stop-color="#0284c7"/>
                    <stop offset="100%" stop-color="#075985"/>
                </linearGradient>
                <linearGradient id="iceSubmerged" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#0284c7" stop-opacity="0.85"/>
                    <stop offset="100%" stop-color="#082f49" stop-opacity="0.2"/>
                </linearGradient>
            </defs>
            <polygon points="18,72 45,102 105,105 132,72" fill="url(#iceSubmerged)"/>
            <polygon points="75,10 32,48 72,74" fill="url(#icePeakShadow)"/>
            <polygon points="115,32 90,58 135,74" fill="url(#icePeakShadow)"/>
            <polygon points="72,74 90,58 135,74" fill="url(#iceCrevasse)"/>
            <polygon points="75,10 115,32 90,58 72,74" fill="url(#icePeakLight)"/>
            <polygon points="32,48 12,72 72,74" fill="url(#icePeakLight)"/>
            <polygon points="12,72 72,74 135,74 120,78 22,78" fill="#f0f9ff" opacity="0.95"/>
            <polygon points="75,10 64,28 84,26" fill="#ffffff"/>
            <polygon points="115,32 106,44 122,42" fill="#ffffff"/>
        </svg>`,

        // 10. Iceberg com Pinguim Explorador
        icebergPenguin: `<svg viewBox="0 0 120 85" class="vessel-svg">
            <defs>
                <linearGradient id="floeLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="60%" stop-color="#e0f2fe"/>
                    <stop offset="100%" stop-color="#7dd3fc"/>
                </linearGradient>
                <linearGradient id="floeSub" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#0284c7" stop-opacity="0.8"/>
                    <stop offset="100%" stop-color="#0c4a6e" stop-opacity="0.25"/>
                </linearGradient>
            </defs>
            <polygon points="15,54 35,74 90,72 105,54" fill="url(#floeSub)"/>
            <polygon points="18,44 95,40 110,54 10,56" fill="url(#floeLight)" stroke="#bae6fd" stroke-width="1.2"/>
            <polygon points="18,44 48,37 82,38 95,40 10,56" fill="#ffffff" opacity="0.95"/>
            <!-- Pinguim no bloco de gelo -->
            <g transform="translate(54, 14)">
                <ellipse cx="12" cy="18" rx="7.5" ry="12" fill="#0f172a"/>
                <ellipse cx="12" cy="19" rx="4.8" ry="9" fill="#ffffff"/>
                <ellipse cx="4" cy="18" rx="2" ry="7" fill="#0f172a" transform="rotate(15 4 18)"/>
                <ellipse cx="20" cy="18" rx="2" ry="7" fill="#0f172a" transform="rotate(-15 20 18)"/>
                <circle cx="10" cy="12" r="1.4" fill="#ffffff"/><circle cx="10.5" cy="12" r="0.8" fill="#000000"/>
                <circle cx="14" cy="12" r="1.4" fill="#ffffff"/><circle cx="14.5" cy="12" r="0.8" fill="#000000"/>
                <polygon points="11,14 13,14 12,17" fill="#f59e0b"/>
                <ellipse cx="9" cy="30" rx="3" ry="1.5" fill="#f97316"/>
                <ellipse cx="15" cy="30" rx="3" ry="1.5" fill="#f97316"/>
            </g>
        </svg>`,

        // 11. Pico de Gelo Angular
        icebergMedium: `<svg viewBox="0 0 115 80" class="vessel-svg">
            <defs>
                <linearGradient id="iceMedL" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="50%" stop-color="#e0f2fe"/>
                    <stop offset="100%" stop-color="#7dd3fc"/>
                </linearGradient>
                <linearGradient id="iceMedS" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#38bdf8"/>
                    <stop offset="100%" stop-color="#0284c7"/>
                </linearGradient>
            </defs>
            <polygon points="22,54 48,74 78,72 98,54" fill="#0284c7" opacity="0.45"/>
            <polygon points="42,12 18,54 58,54" fill="url(#iceMedL)"/>
            <polygon points="42,12 58,54 78,26" fill="url(#iceMedS)"/>
            <polygon points="78,26 58,54 100,54" fill="url(#iceMedL)"/>
            <polygon points="42,12 48,24 38,24" fill="#ffffff"/>
            <polygon points="78,26 84,36 74,35" fill="#ffffff"/>
        </svg>`,

        // 12. Orca das Águas Polares (Orientada para a direita por padrão)
        orca: `<svg viewBox="0 0 110 50" class="vessel-svg">
            <defs>
                <linearGradient id="orcaBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#1e293b"/>
                    <stop offset="100%" stop-color="#090d16"/>
                </linearGradient>
            </defs>
            <g transform="translate(110, 0) scale(-1, 1)">
                <path d="M10 24 C 25 14, 60 12, 90 22 C 98 25, 105 20, 108 16 C 106 24, 106 28, 108 34 C 104 30, 96 26, 88 28 C 65 35, 30 34, 10 24 Z" fill="url(#orcaBody)"/>
                <path d="M50 14 Q 56 2 62 6 Q 58 10 58 14 Z" fill="#090d16"/>
                <ellipse cx="25" cy="18" rx="6" ry="3.2" fill="#ffffff" transform="rotate(-10 25 18)"/>
                <path d="M35 28 Q 55 33 75 27 Q 60 25 35 28 Z" fill="#ffffff"/>
            </g>
        </svg>`
    };

    const runBoatSpawner = (waterEl) => {
        const isStorm = effect === 'effect_storm';

        const spawnBoat = () => {
            if (userProfile.equipped.effect !== effect || !waterEl.parentNode) return;
            
            const boat = document.createElement('div');
            if (isStorm) {
                const roll = Math.random();
                if (roll < 0.50) {
                    boat.className = 'eco-pirate';
                    boat.innerHTML = `<div class="boat-icon">${VESSELS_SVG.pirate}</div>`;
                } else if (roll < 0.80) {
                    boat.className = 'eco-trawler';
                    boat.innerHTML = `<div class="boat-icon">${VESSELS_SVG.trawler}</div>`;
                } else {
                    boat.className = 'eco-link-wood';
                    boat.innerHTML = `<div class="boat-icon">${VESSELS_SVG.link}</div>`;
                }
            } else {
                if (Math.random() > 0.5) {
                    boat.className = 'eco-jetski';
                    boat.innerHTML = `<div class="boat-icon">${VESSELS_SVG.jetski}</div>`;
                } else {
                    boat.className = 'eco-boat';
                    boat.innerHTML = `<div class="boat-icon">${VESSELS_SVG.sailboat}</div>`;
                }
            }

            const fromLeft = Math.random() > 0.5;
            const duration = isStorm ? (10 + Math.random() * 5) : (14 + Math.random() * 7);
            boat.style.left = fromLeft ? '-190px' : '102vw';
            boat.style.animation = `${fromLeft ? 'drift-right' : 'drift-left'} ${duration}s linear forwards`;
            if (!fromLeft) boat.style.transform = 'scaleX(-1)';
            waterEl.appendChild(boat);
            setTimeout(() => { if (boat.parentNode) boat.remove(); }, (duration + 1) * 1000);
        };

        // Spawn first boat immediately so user doesn't wait
        spawnBoat();
        window.ecoBoatTimer = setInterval(spawnBoat, isStorm ? 3500 : 4500);
    };

    const runSeaLifeSpawner = (waterEl) => {
        const isStorm = effect === 'effect_storm';

        const spawnCreature = () => {
            if (userProfile.equipped.effect !== effect || !waterEl.parentNode) return;
            
            const creature = document.createElement('div');
            const roll = Math.random();

            if (isStorm) {
                if (roll < 0.45) {
                    creature.className = 'eco-shark';
                    creature.innerHTML = `<div class="creature-icon">${VESSELS_SVG.shark}</div>`;
                } else if (roll < 0.75) {
                    creature.className = 'eco-fish';
                    creature.innerHTML = `<div class="creature-icon">${VESSELS_SVG.fish}</div>`;
                } else {
                    creature.className = 'eco-jellyfish';
                    creature.innerHTML = `<div class="creature-icon">${VESSELS_SVG.jellyfish}</div>`;
                }
            } else {
                if (roll < 0.7) {
                    creature.className = 'eco-fish';
                    creature.innerHTML = `<div class="creature-icon">${VESSELS_SVG.fish}</div>`;
                } else {
                    creature.className = 'eco-jellyfish';
                    creature.innerHTML = `<div class="creature-icon">${VESSELS_SVG.jellyfish}</div>`;
                }
            }

            const fromLeft = Math.random() > 0.5;
            const duration = 7 + Math.random() * 5;
            creature.style.left = fromLeft ? '-120px' : '102vw';
            creature.style.top = `${15 + Math.random() * 65}%`;
            creature.style.animation = `${fromLeft ? 'drift-right' : 'drift-left'} ${duration}s linear forwards`;
            if (!fromLeft) creature.style.transform = 'scaleX(-1)';
            waterEl.appendChild(creature);
            setTimeout(() => { if (creature.parentNode) creature.remove(); }, (duration + 1) * 1000);
        };

        // Spawn first creature immediately and second shortly after
        spawnCreature();
        setTimeout(() => {
            if (userProfile.equipped.effect === effect && waterEl.parentNode) spawnCreature();
        }, 800);
        window.ecoSeaLifeTimer = setInterval(spawnCreature, isStorm ? 2200 : 2800);
    };

    const runIcebergSpawner = (waterEl) => {
        const spawnIceberg = () => {
            if (userProfile.equipped.effect !== effect || !waterEl.parentNode) return;
            const iceberg = document.createElement('div');
            const roll = Math.random();
            if (roll < 0.40) {
                iceberg.className = 'eco-iceberg eco-iceberg-large';
                iceberg.innerHTML = `<div class="iceberg-icon">${VESSELS_SVG.icebergLarge}</div>`;
            } else if (roll < 0.75) {
                iceberg.className = 'eco-iceberg eco-iceberg-penguin';
                iceberg.innerHTML = `<div class="iceberg-icon">${VESSELS_SVG.icebergPenguin}</div>`;
            } else {
                iceberg.className = 'eco-iceberg eco-iceberg-medium';
                iceberg.innerHTML = `<div class="iceberg-icon">${VESSELS_SVG.icebergMedium}</div>`;
            }

            const fromLeft = Math.random() > 0.5;
            const duration = 16 + Math.random() * 8; // Geleiras derivam lentamente e majestosamente
            iceberg.style.left = fromLeft ? '-190px' : '102vw';
            iceberg.style.animation = `${fromLeft ? 'drift-right' : 'drift-left'} ${duration}s linear forwards`;
            if (!fromLeft) iceberg.style.transform = 'scaleX(-1)';
            waterEl.appendChild(iceberg);
            setTimeout(() => { if (iceberg.parentNode) iceberg.remove(); }, (duration + 1) * 1000);
        };

        spawnIceberg();
        window.ecoBoatTimer = setInterval(spawnIceberg, 4800);
    };

    const runArcticLifeSpawner = (waterEl) => {
        const spawnOrca = () => {
            if (userProfile.equipped.effect !== effect || !waterEl.parentNode) return;
            const orca = document.createElement('div');
            orca.className = 'eco-orca';
            orca.innerHTML = `<div class="creature-icon">${VESSELS_SVG.orca}</div>`;

            const fromLeft = Math.random() > 0.5;
            const duration = 10 + Math.random() * 4;
            orca.style.left = fromLeft ? '-130px' : '102vw';
            orca.style.top = `${20 + Math.random() * 45}%`;
            orca.style.animation = `${fromLeft ? 'drift-right' : 'drift-left'} ${duration}s linear forwards`;
            if (!fromLeft) orca.style.transform = 'scaleX(-1)';
            waterEl.appendChild(orca);
            setTimeout(() => { if (orca.parentNode) orca.remove(); }, (duration + 1) * 1000);
        };

        setTimeout(spawnOrca, 1500);
        window.ecoSeaLifeTimer = setInterval(spawnOrca, 4200);
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
        }, ecoCompact(isStorm ? 15 : 40, isStorm ? 35 : 85));

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
    } else if (effect === 'effect_glaciers') {
        // ── NEVE CAINDO SUAVEMENTE ──
        window.ecoEffectInterval = setInterval(() => {
            if (!document.getElementById('ecoEffectLayer')) return;
            if (document.querySelectorAll('.eco-snowflake').length >= ecoCompact(26, 12)) return;
            const flake = document.createElement('span');
            flake.className = 'eco-snowflake';
            const SNOW = ['❄', '❅', '❆', '·', '✦'];
            flake.textContent = SNOW[Math.floor(Math.random() * SNOW.length)];
            const size = Math.random() * 16 + 10;
            const drift = (Math.random() - 0.5) * 110;
            const duration = Math.random() * 4 + 4.5;
            flake.style.left = (Math.random() * 100) + 'vw';
            flake.style.top = '-35px';
            flake.style.fontSize = size + 'px';
            flake.style.color = 'rgba(255, 255, 255, 0.85)';
            flake.style.textShadow = '0 0 8px rgba(186, 230, 253, 0.9)';
            flake.style.animation = `snowfall ${duration}s linear forwards`;
            flake.style.setProperty('--drift', `${drift}px`);
            layer.appendChild(flake);
            flake.addEventListener('animationend', () => { if (flake.parentNode) flake.remove(); });
        }, ecoCompact(180, 420));

        // ── ÁGUA GLACIAL COM GELEIRAS E ICEBERGS ──
        const water = document.createElement('div');
        water.className = 'eco-flood-water ice-water';
        water.innerHTML = `<div class="water-wave-layer wave-3"></div><div class="water-wave-layer wave-2"></div><div class="water-wave-layer wave-1"></div><div class="wave-shine"></div>`;
        document.body.appendChild(water);
        let level = 1;
        const maxLevel = 7;
        window.ecoFloodTimer = setInterval(() => {
            if (level < maxLevel) { level += 0.5; water.style.height = level + 'vh'; }
            else { water.style.height = (maxLevel + Math.sin(Date.now() / 1200) * 0.5) + 'vh'; }
        }, 50);

        runIcebergSpawner(water);
        runArcticLifeSpawner(water);
    } else if (effect === 'effect_leaves' || effect === 'effect_gold_leaves') {
        const isGold = effect === 'effect_gold_leaves';
        const types = ['maple', 'ginkgo', 'monstera', 'lance', 'oak'];

        const spawnLeaf = () => {
            if (!document.getElementById('ecoEffectLayer')) return;
            const randomType = types[Math.floor(Math.random() * types.length)];
            const leaf = document.createElement('div');
            
            // Varied natural speeds: 7s to 12s
            const duration = isGold ? (7.5 + Math.random() * 4.5) : (7 + Math.random() * 5);
            const scale = (0.9 + Math.random() * 0.45).toFixed(2);
            // Wide horizontal drift: 100px to 280px in wind direction
            const windDir = Math.random() > 0.5 ? 1 : -1;
            const swayX = (windDir * (100 + Math.random() * 180)).toFixed(0);
            // Full screen coverage with safety margin
            const startX = (Math.random() * 100).toFixed(1);

            leaf.className = `eco-leaf eco-leaf-${randomType} ${isGold ? 'eco-leaf-gold' : ''}`;
            leaf.style.left = startX + 'vw';
            leaf.style.setProperty('--sway-x', swayX + 'px');
            leaf.style.setProperty('--leaf-scale', scale);
            leaf.style.animationDuration = `${duration.toFixed(1)}s`;
            
            // Remove ONLY when the CSS animation genuinely completes past the bottom of the screen
            leaf.addEventListener('animationend', () => {
                if (leaf.parentNode) leaf.remove();
            });

            layer.appendChild(leaf);

            // Gold sparkle particles attached to the leaf
            if (isGold && Math.random() > 0.4) {
                const sparkle = document.createElement('div');
                sparkle.className = 'eco-gold-sparkle';
                sparkle.style.left = (Math.random() * 30 - 15) + 'px';
                sparkle.style.top = (Math.random() * 30 - 15) + 'px';
                leaf.appendChild(sparkle);
                setTimeout(() => { if (sparkle.parentNode) sparkle.remove(); }, 1800);
            }
        };

        // Spawn first leaf immediately
        spawnLeaf();

        window.ecoEffectInterval = setInterval(() => {
            spawnLeaf();
        }, ecoCompact(isGold ? 600 : 700, isGold ? 1200 : 1400));
    } else if (effect === 'effect_vagalume') {
        window.ecoEffectInterval = setInterval(() => {
            const glow = document.createElement('div');
            glow.className = 'eco-vagalume';
            glow.style.left = Math.random() * 100 + 'vw';
            glow.style.top = Math.random() * 100 + 'vh';
            layer.appendChild(glow);
            setTimeout(() => glow.remove(), 10000);
        }, ecoCompact(800, 1600));
    } else if (effect === 'effect_digital_rain' || effect === 'effect_matrix_rain') {
        const isMatrix = effect === 'effect_matrix_rain';
        const GLYPHS = isMatrix
            ? ['0', '1', '0', '1', '1', '0', '0', '1']
            : ['0', '1', '101', 'GAIA', 'ECO', '0x1F', '0101', 'RECYCLE', '1', '0', 'AI', 'CO2:0', 'SOLAR', 'NET:OK', 'λ', 'Ω', '{}'];

        window.ecoEffectInterval = setInterval(() => {
            const stream = document.createElement('div');
            stream.className = `eco-data-bit ${isMatrix ? 'matrix-style' : 'cyber-stream'}`;

            const isMultiLine = !isMatrix && Math.random() < 0.4;
            if (isMultiLine) {
                const len = Math.floor(Math.random() * 3) + 2;
                let text = '';
                for (let i = 0; i < len; i++) {
                    const char = Math.random() > 0.5 ? '1' : '0';
                    text += (i === len - 1) ? `<span class="data-head">${char}</span>` : `${char}<br>`;
                }
                stream.innerHTML = text;
                stream.style.lineHeight = '1.05';
            } else {
                stream.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            }

            const speed = (Math.random() * 2.2 + 1.8).toFixed(1);
            const size = (Math.random() * 0.6 + 0.85).toFixed(2);

            stream.style.left = (Math.random() * 97) + 'vw';
            stream.style.fontSize = size + 'rem';
            stream.style.animationDuration = speed + 's';

            layer.appendChild(stream);
            setTimeout(() => {
                if (stream.parentNode) stream.remove();
            }, speed * 1000 + 200);
        }, ecoCompact(isMatrix ? 50 : 120, isMatrix ? 120 : 250));
    } else if (effect === 'effect_windmill') {
        const spawnWindStream = () => {
            if (!document.getElementById('ecoEffectLayer')) return;
            const isFlower = Math.random() < 0.35; // 35% chance to spawn a flower carrying on the wind
            const particle = document.createElement('div');
            
            const startY = (5 + Math.random() * 85).toFixed(1);
            const duration = (3 + Math.random() * 3).toFixed(1);
            const fromLeft = Math.random() > 0.3; // Most wind flows left to right
            
            particle.className = isFlower ? 'eco-wind-flower' : 'eco-wind-line';
            particle.style.top = `${startY}vh`;
            // Posição inicial estática — a animação cuida do movimento via translateX
            particle.style.left = fromLeft ? '-5px' : 'calc(100vw + 5px)';
            particle.style.animation = `${fromLeft ? 'windGustRight' : 'windGustLeft'} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;

            if (isFlower) {
                const flowerColor = Math.random() > 0.5 ? '#ff5252' : '#facc15';
                const flowerSize = (22 + Math.random() * 16).toFixed(0);
                particle.style.width = `${flowerSize}px`;
                particle.style.height = `${flowerSize}px`;
                particle.innerHTML = `
                    <svg viewBox="0 0 40 40" class="wind-flower-svg">
                        <g class="flower-spin">
                            <!-- 4 Petals retro -->
                            <circle cx="20" cy="10" r="7" fill="${flowerColor}" opacity="0.9" />
                            <circle cx="30" cy="20" r="7" fill="${flowerColor}" opacity="0.9" />
                            <circle cx="20" cy="30" r="7" fill="${flowerColor}" opacity="0.9" />
                            <circle cx="10" cy="20" r="7" fill="${flowerColor}" opacity="0.9" />
                            <!-- Center -->
                            <circle cx="20" cy="20" r="5" fill="#ffffff" />
                            <circle cx="20" cy="20" r="2.5" fill="#ea580c" />
                        </g>
                    </svg>
                `;
            } else {
                const lineWidth = (80 + Math.random() * 140).toFixed(0);
                const lineThickness = (2 + Math.random() * 3).toFixed(1);
                particle.style.width = `${lineWidth}px`;
                particle.style.height = `${lineThickness}px`;
                particle.style.opacity = (0.4 + Math.random() * 0.45).toFixed(2);
            }

            layer.appendChild(particle);
            particle.addEventListener('animationend', () => {
                if (particle.parentNode) particle.remove();
            });
            // Fallback — garante remoção mesmo se animationend não disparar
            setTimeout(() => { if (particle.parentNode) particle.remove(); }, parseFloat(duration) * 1000 + 500);
        };

        spawnWindStream();
        window.ecoEffectInterval = setInterval(spawnWindStream, ecoCompact(350, 700));
    } else if (effect === 'effect_star_blazing') {
        // Star Blazing é gerenciado pelo canvas em theme_deltarune.js
        // Garante que a layer padrão não atrapalha
        if (typeof window.startStarBlazing === 'function') {
            window.startStarBlazing();
        } else {
            setTimeout(() => {
                if (typeof window.startStarBlazing === 'function') {
                    window.startStarBlazing();
                }
            }, 300);
        }
        return; // Não cria ecoEffectLayer para esse efeito
    }

    // Sincroniza som ambiente sempre que o efeito é aplicado
    updateAmbience();
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

function initPageTransitions() {
    // Intercepta cliques em links locais para fazer fade-out suave antes de navegar
    document.addEventListener('click', (e) => {
        if (userProfile.pageTransitions === false) return;

        const anchor = e.target.closest('a');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href) return;

        // Ignora links de âncoras na mesma página, javascript, mailto, etc.
        if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (anchor.target === '_blank') return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        // Verifica se é link interno no mesmo domínio
        try {
            const targetUrl = new URL(anchor.href, window.location.href);
            if (targetUrl.origin === window.location.origin) {
                // Não transiciona se for exatamente a mesma página + mesma query
                if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search && !targetUrl.hash) {
                    return;
                }
                e.preventDefault();
                document.body.classList.add('page-transitioning');
                setTimeout(() => {
                    window.location.href = anchor.href;
                }, 180);
            }
        } catch (_) {
            // Em caso de falha no parse, deixa a navegação padrão acontecer
        }
    });

    // Se o usuário voltar pelo histórico (bfcache), remove o fade-out
    window.addEventListener('pageshow', () => {
        document.body.classList.remove('page-transitioning');
    });
}

// --- Confetti Effect ---

function launchConfetti(isPerfect = false) {
    const COUNT = isPerfect ? 130 : 70;
    const DURATION = isPerfect ? 4500 : 3000;

    // Paleta eco: verde, amarelo, azul, laranja, branco, esmeralda
    const COLORS = isPerfect
        ? ['#FFD700', '#FFA500', '#FF6B6B', '#C0F560', '#7BDFFF', '#ffffff', '#FF69B4', '#A78BFA']
        : ['#4CAF50', '#8BC34A', '#FFD54F', '#29B6F6', '#ffffff', '#80CBC4'];

    const SHAPES = ['square', 'circle', 'ribbon'];

    for (let i = 0; i < COUNT; i++) {
        const el = document.createElement('div');
        el.className = 'eco-confetti-piece';

        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        el.dataset.shape = shape;

        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size = 7 + Math.random() * 9; // 7–16px
        const startX = 10 + Math.random() * 80; // % da tela
        const delay = Math.random() * 600;       // ms de delay no início
        const totalTime = DURATION * (0.7 + Math.random() * 0.6); // cada peça tem vida levemente diferente

        // Drift horizontal: ± 60-200px durante a queda
        const driftX = (Math.random() - 0.5) * 280;
        // Rotação inicial e velocidade
        const rotateStart = Math.random() * 360;
        const rotateDelta = (Math.random() - 0.5) * 900;

        el.style.cssText = `
            left: ${startX}vw;
            top: -20px;
            width: ${shape === 'ribbon' ? Math.round(size * 0.45) : size}px;
            height: ${shape === 'ribbon' ? size * 2.5 : size}px;
            background: ${color};
            border-radius: ${shape === 'circle' ? '50%' : shape === 'ribbon' ? '2px' : '1px'};
            animation-delay: ${delay}ms;
            animation-duration: ${totalTime}ms;
            --drift-x: ${driftX}px;
            --rotate-start: ${rotateStart}deg;
            --rotate-delta: ${rotateDelta}deg;
            opacity: 1;
        `;

        document.body.appendChild(el);

        // Remove após a animação terminar
        setTimeout(() => el.remove(), delay + totalTime + 200);
    }

    // Disparo extra de "estrelinhas" se gabaritou
    if (isPerfect) {
        setTimeout(() => launchConfettiBurst(), 400);
        setTimeout(() => launchConfettiBurst(), 1100);
    }
}

function launchConfettiBurst() {
    // Pequeno burst radial saindo do centro da tela (para gabarito perfeito)
    const BURST_COUNT = 18;
    const COLORS = ['#FFD700', '#FFA500', '#ffffff', '#C0F560', '#FF69B4'];
    for (let i = 0; i < BURST_COUNT; i++) {
        const el = document.createElement('div');
        el.className = 'eco-confetti-piece eco-confetti-burst';
        const angle = (i / BURST_COUNT) * 360;
        const distance = 80 + Math.random() * 100;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size = 6 + Math.random() * 6;
        el.style.cssText = `
            left: 50vw;
            top: 40vh;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            --burst-angle: ${angle}deg;
            --burst-distance: ${distance}px;
            animation: ecoConfettiBurst 900ms ease-out forwards;
            opacity: 1;
            transform-origin: center;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1100);
    }
}

// --- Initialization ---

window.gamification = { addXp, markQuizComplete, updateTotalQuizzes, get userProfile() { return userProfile; }, loadProgress, openProfile, launchConfetti };

window.addEventListener('beforeunload', () => {
    saveProgress();
});

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    applyEffects();
    initPageTransitions();
    
    // Inicializa o Google Auth imediatamente com retry automático resiliente
    initGoogleAuth();

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
            const compactChanged = newData.compactMode !== userProfile.compactMode;

            userProfile = newData;
            updateHud();

            if (themeChanged) applyTheme();
            if (effectChanged || themeChanged || muteChanged || compactChanged) {
                applyEffects();
                updateAmbience();
                updateAudioUI();
            }

            if (document.getElementById('ecoProfileModal')) {
                const activeTabBtn = document.querySelector('.eco-tab-btn.active');
                if (activeTabBtn) {
                    const tab = activeTabBtn.dataset.tab.split('-')[1];
                    if (tab === 'settings') renderSettings();
                    else renderShop(tab);
                }
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
