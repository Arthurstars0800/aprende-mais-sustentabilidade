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
    completedQuizzes: [], // Rastreamento de quizzes finalizados
    totalQuizzes: 6,      // Total de quizzes disponíveis (atualizado dinamicamente)
    unlockedItems: ['avatar_seed', 'theme-default'],
    unlockedEasterEgg: false, // Flag secreta
    equipped: {
        avatar: 'avatar_seed',
        theme: 'theme-default',
        effect: 'none'
    },
    lastVisit: Date.now(),
    dailyStreak: 0
};

// Carregar progresso
function loadProgress() {
    const saved = localStorage.getItem('eco_progress');
    if (saved) {
        const savedData = JSON.parse(saved);
        userProfile = { ...userProfile, ...savedData };
    }

    // Garantir que arrays novos existam em saves antigos
    if (!userProfile.completedQuizzes) userProfile.completedQuizzes = [];

    checkDailyVisit();
    updateHud();
    applyTheme();
}

// Salvar progresso
function saveProgress() {
    localStorage.setItem('eco_progress', JSON.stringify(userProfile));
    updateHud();
}

// Adicionar XP
function addXp(amount, reason = "") {
    userProfile.xp += amount;
    checkLevelUp();
    saveProgress();
    showToast(`+${amount} EcoPoints! 🌿 ${reason}`);
}

// Verificar Level Up
function checkLevelUp() {
    // Encontrar o nível correto com base no XP atual
    // Itera reverso ou usa findLast se suportado, ou lógica simples
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
        // Aqui virão os desbloqueios da loja
    }
}

// Verificar Visita Diária
function checkDailyVisit() {
    const now = new Date();
    const last = new Date(userProfile.lastVisit);

    // Zerar horas para comparar apenas os dias
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime();

    const diffDays = (today - lastDay) / (1000 * 60 * 60 * 24);

    if (today > lastDay) {
        if (diffDays === 1) {
            // Visita consecutiva!
            userProfile.dailyStreak = (userProfile.dailyStreak || 0) + 1;
        } else {
            // Perdeu a ofensiva
            userProfile.dailyStreak = 1;
        }

        const streakBonus = Math.min(userProfile.dailyStreak * 20, 200);
        const totalVisitXp = 100 + streakBonus;

        addXp(totalVisitXp, `(Visita Diária - Ofensiva de ${userProfile.dailyStreak} dias! 🔥)`);
        userProfile.lastVisit = now.getTime();
        saveProgress();
    }
}

// Sistema de Notificação (Toast)
function showToast(message, duration = 3000) {
    // Remover toast anterior se houver p/ não empilhar demais
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

    // Animação de entrada (reflow hack)
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remover depois do tempo
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Atualizar Interface (HUD)
function updateHud() {
    const hud = document.getElementById('ecoHud');
    if (!hud) return;

    const fill = document.getElementById('ecoBarFill');
    const text = document.getElementById('ecoXpText');
    const icon = document.querySelector('.eco-level-icon');

    // Encontrar dados do nível atual
    // Como LEVELS está ordenado por minXp crescente, podemos achar o nível atual
    let currentLevelData = LEVELS.find(l => l.level === userProfile.level) || LEVELS[0];
    let nextLevelData = LEVELS.find(l => l.level === userProfile.level + 1);

    // Atualizar Ícone
    if (icon) icon.textContent = currentLevelData.icon;

    // Calcular Porcentagem
    let percentage = 100;
    if (nextLevelData) {
        let min = currentLevelData.minXp;
        let max = nextLevelData.minXp;
        let current = userProfile.xp;
        percentage = Math.max(0, Math.min(100, Math.floor(((current - min) / (max - min)) * 100)));
    }

    if (fill) fill.style.width = `${percentage}%`;
    if (text) text.textContent = `${userProfile.xp} XP`;

    // Tooltip simples com nome do nível
    hud.title = `${currentLevelData.name} (Próximo nível em ${nextLevelData ? (nextLevelData.minXp - userProfile.xp) : 0} XP)`;
}

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

    // Remova apenas os temas GLOBAIS (aqueles da Loja)
    // NÃO remova theme-craft, theme-guide etc, pois eles identificam a página!
    document.body.classList.remove('theme-future');

    if (themeId === 'theme-future') {
        document.body.classList.add('theme-future');
    }
}


function updateTotalQuizzes(count) {
    if (count && count !== userProfile.totalQuizzes) {
        userProfile.totalQuizzes = count;
        saveProgress();
    }
}

function markQuizComplete(quizType) {
    if (!userProfile.completedQuizzes.includes(quizType)) {
        userProfile.completedQuizzes.push(quizType);
        saveProgress();

        const total = userProfile.totalQuizzes || 6;
        if (userProfile.completedQuizzes.length >= total) {
            showToast("✨ RECOMPENSA LENDÁRIA: Você completou todos os quizzes disponíveis! Folhas de Ouro desbloqueadas na Loja!", 8000);
        }
    }
}

// ... (existing helper functions)

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
                
                <div class="eco-shop-grid" id="shopGrid">
                    <!-- Itens renderizados via JS -->
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    renderShop('effects');

    // Eventos
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

function showStormWarning(onConfirm) {
    const warningModal = document.createElement('div');
    warningModal.className = 'eco-modal-overlay';
    warningModal.style.zIndex = '10000'; // Acima de tudo

    warningModal.innerHTML = `
        <div class="eco-modal" style="max-width: 500px;">
            <div class="eco-modal-header" style="background: linear-gradient(135deg, #f59e0b, #dc2626); color: white;">
                <h2>⚠️ Aviso de Acessibilidade</h2>
            </div>
            <div class="eco-modal-content" style="padding: 30px; text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 20px;">⛈️⚡</div>
                <h3 style="margin-bottom: 15px; color: var(--text-dark);">Tempestade Feroz</h3>
                <p style="margin-bottom: 20px; line-height: 1.6; color: var(--text-muted);">
                    Este efeito contém <strong>flashes de luz intensos</strong> que simulam raios.
                </p>
                <p style="margin-bottom: 25px; padding: 15px; background: rgba(239, 68, 68, 0.1); border-radius: 10px; color: #dc2626; font-weight: 600;">
                    ⚠️ Não recomendado para pessoas com fotossensibilidade ou epilepsia fotossensível.
                </p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="btn btn-outline" id="cancelStorm" style="padding: 12px 25px;">
                        Cancelar
                    </button>
                    <button class="btn btn-primary" id="confirmStorm" style="padding: 12px 25px; background: #dc2626;">
                        Entendi, continuar
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(warningModal);

    // Eventos
    const cancelBtn = warningModal.querySelector('#cancelStorm');
    const confirmBtn = warningModal.querySelector('#confirmStorm');

    cancelBtn.onclick = () => {
        warningModal.remove();
        showToast("Efeito não equipado. Sua segurança é importante! 💚");
    };

    confirmBtn.onclick = () => {
        warningModal.remove();
        onConfirm();
    };

    // Fechar ao clicar fora
    warningModal.addEventListener('click', (e) => {
        if (e.target === warningModal) {
            warningModal.remove();
            showToast("Efeito não equipado. Sua segurança é importante! 💚");
        }
    });
}

function renderShop(category) {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;

    const items = SHOP_ITEMS[category] || [];
    grid.innerHTML = items.map(item => {
        const levelUnlocked = userProfile.level >= item.reqLevel;

        let themeUnlocked = true;
        if (item.reqTheme) {
            themeUnlocked = userProfile.equipped.theme === item.reqTheme;
        }

        // Se for item secreto, só aparece se foi desbloqueado
        if (item.isEasterEgg && !userProfile.unlockedEasterEgg) return '';

        let quizzesUnlocked = true;
        if (item.reqAllQuizzes) {
            quizzesUnlocked = userProfile.completedQuizzes.length >= (userProfile.totalQuizzes || 6);
        } else if (item.reqQuizzes) {
            quizzesUnlocked = userProfile.completedQuizzes.length >= item.reqQuizzes;
        }

        const isUnlocked = levelUnlocked && quizzesUnlocked && themeUnlocked;

        let isEquipped = false;
        if (category === 'effects') isEquipped = userProfile.equipped.effect === item.id;
        else if (category === 'avatars') isEquipped = userProfile.equipped.avatar === item.id;
        else if (category === 'themes') isEquipped = userProfile.equipped.theme === item.id;

        let statusText = isEquipped ? 'Equipado' : 'Usar';
        if (!isUnlocked) {
            if (!levelUnlocked) statusText = `🔒 Nvl ${item.reqLevel}`;
            else if (item.reqTheme && !themeUnlocked) statusText = `🔒 Tema Futuro`;
            else if (item.reqAllQuizzes || item.reqQuizzes) {
                const required = item.reqAllQuizzes ? (userProfile.totalQuizzes || 6) : item.reqQuizzes;
                statusText = `🔒 Quizzes (${userProfile.completedQuizzes.length}/${required})`;
            }
        }

        return `
            <div class="eco-shop-item ${!isUnlocked ? 'locked' : ''} ${isEquipped ? 'equipped' : ''}" 
                 onclick="equipItem('${category}', '${item.id}', ${isUnlocked})">
                <div class="item-icon">${item.icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-status">${statusText}</div>
            </div>
        `;
    }).join('');
}

function equipItem(category, itemId, isUnlocked) {
    if (!isUnlocked) {
        showToast("Bloqueado! Continue ganhando XP para liberar. 🔒");
        return;
    }

    // Aviso especial para efeito de tempestade (contém flashes)
    if (category === 'effects' && itemId === 'effect_storm') {
        showStormWarning(() => {
            userProfile.equipped.effect = itemId;
            saveProgress();
            renderShop(category);
            applyEffects();
            showToast(`${category.slice(0, -1)} equipado com sucesso! ✨`);
        });
        return;
    }

    if (category === 'effects') {
        userProfile.equipped.effect = itemId;
    } else if (category === 'avatars') {
        userProfile.equipped.avatar = itemId;
    } else if (category === 'themes') {
        userProfile.equipped.theme = itemId;
        applyTheme();
    }

    saveProgress();
    renderShop(category);
    if (category === 'effects') applyEffects();
    showToast(`${category.slice(0, -1)} equipado com sucesso! ✨`);
}

function applyEffects() {
    // 1. Limpa tudo o que for antigo para evitar travamentos
    if (window.ecoEffectInterval) {
        clearInterval(window.ecoEffectInterval);
        window.ecoEffectInterval = null;
    }

    const existing = document.getElementById('ecoEffectLayer');
    if (existing) existing.remove();

    // Remove elementos extras de tempestade se existirem
    const oldWater = document.querySelector('.eco-flood-water');
    if (oldWater) oldWater.remove();
    clearTimeout(window.ecoLightningTimer);
    clearInterval(window.ecoFloodTimer);

    // 2. Verifica o que está equipado
    const effect = userProfile.equipped.effect;
    if (!effect || effect === 'effect_none') return;

    // 3. Cria a camada de efeitos
    const layer = document.createElement('div');
    layer.id = 'ecoEffectLayer';
    layer.className = `eco-effect-${effect}`;
    document.body.appendChild(layer);

    if (effect === 'effect_leaves' || effect === 'effect_gold_leaves') {
        const types = ['eco-leaf-type-1', 'eco-leaf-type-2', 'eco-leaf-type-3'];
        const isGold = effect === 'effect_gold_leaves';

        const createSingleLeaf = () => {
            // Se o efeito mudou ou foi desligado, cancela o criador
            if (userProfile.equipped.effect !== effect) {
                if (window.ecoEffectInterval) clearInterval(window.ecoEffectInterval);
                return;
            }

            const leaf = document.createElement('div');
            const isBoldo = Math.random() < 0.05;
            const randomType = isBoldo ? 'eco-leaf-boldo' : types[Math.floor(Math.random() * types.length)];

            // Atribui as classes (importante: .eco-leaf deve vir primeiro)
            leaf.className = `eco-leaf ${randomType} ${isGold ? 'eco-leaf-gold' : ''}`;

            // Posição inicial aleatória
            leaf.style.left = (Math.random() * 100) + 'vw';

            // Velocidade variada (10s a 18s)
            const duration = 10 + Math.random() * 8;
            leaf.style.animationDuration = duration + 's';

            layer.appendChild(leaf);

            // Remove o elemento após a queda para manter o código leve
            setTimeout(() => {
                if (leaf && leaf.parentNode) leaf.remove();
            }, duration * 1000);
        };

        // Cria as primeiras folhas
        for (let i = 0; i < 6; i++) {
            setTimeout(createSingleLeaf, i * 300);
        }

        // Mantém o fluxo contínuo (uma nova folha a cada 1.8 segundos)
        window.ecoEffectInterval = setInterval(createSingleLeaf, 1800);

    } else if (effect === 'effect_vagalume') {
        // Vagalumes são estáticos no nascimento, apenas 20 unidades
        for (let i = 0; i < 20; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'eco-vagalume';
            firefly.style.left = Math.random() * 100 + 'vw';
            firefly.style.top = Math.random() * 100 + 'vh';
            firefly.style.animationDuration = (Math.random() * 5 + 5) + 's';
            firefly.style.animationDelay = Math.random() * 10 + 's';
            layer.appendChild(firefly);
        }
    } else if (effect === 'effect_digital_rain' || effect === 'effect_matrix_rain') {
        const chars = ['0', '1', '♻', '♼', '♲', '☘', '0', '1'];
        const isMatrix = effect === 'effect_matrix_rain';

        const createDataBit = () => {
            if (userProfile.equipped.effect !== effect) {
                if (window.ecoEffectInterval) clearInterval(window.ecoEffectInterval);
                return;
            }
            const bit = document.createElement('div');
            bit.className = `eco-data-bit ${isMatrix ? 'matrix-style' : ''}`;
            bit.textContent = chars[Math.floor(Math.random() * chars.length)];
            bit.style.left = Math.random() * 100 + 'vw';

            const duration = 2 + Math.random() * 3;
            bit.style.animationDuration = duration + 's';
            bit.style.fontSize = (12 + Math.random() * 12) + 'px';
            bit.style.opacity = 0.4 + Math.random() * 0.6;

            layer.appendChild(bit);
            setTimeout(() => { if (bit && bit.parentNode) bit.remove(); }, duration * 1000);
        };

        window.ecoEffectInterval = setInterval(createDataBit, 150);
    } else if (effect === 'effect_rain') {
        const createRainDrop = () => {
            if (userProfile.equipped.effect !== effect) {
                if (window.ecoEffectInterval) clearInterval(window.ecoEffectInterval);
                return;
            }
            const drop = document.createElement('div');
            drop.classList.add('eco-rain-drop');
            drop.style.left = `${Math.random() * 100}vw`;

            // Variação de velocidade (0.5s a 1.2s) para parecer natural
            const duration = 0.5 + Math.random() * 0.7;
            drop.style.animationDuration = duration + 's';

            // Tamanho variado (opcional)
            drop.style.opacity = 0.3 + Math.random() * 0.7;

            layer.appendChild(drop);
            setTimeout(() => { if (drop && drop.parentNode) drop.remove(); }, duration * 1000);
        };

        // Frequência de 10ms = ~100 gotas por segundo (chuva intensa)
        window.ecoEffectInterval = setInterval(createRainDrop, 10);
    } else if (effect === 'effect_storm') {
        const createStormDrop = () => {
            if (userProfile.equipped.effect !== effect) {
                if (window.ecoEffectInterval) clearInterval(window.ecoEffectInterval);
                return;
            }
            const drop = document.createElement('div');
            drop.classList.add('eco-storm-drop');
            drop.style.left = `${Math.random() * 100}vw`;

            // Variação de velocidade (0.4s a 0.8s) - Very fast
            const duration = 0.4 + Math.random() * 0.4;
            drop.style.animationDuration = duration + 's';

            // Tamanho variado (opcional)
            drop.style.opacity = 0.5 + Math.random() * 0.5;

            layer.appendChild(drop);
            setTimeout(() => { if (drop && drop.parentNode) drop.remove(); }, duration * 1000);
        };

        // Frequência de 5ms = ~200 gotas por segundo (chuva torrencial)
        window.ecoEffectInterval = setInterval(createStormDrop, 5);

        // --- Lightning Logic ---
        const lightningFlash = () => {
            if (userProfile.equipped.effect !== effect) {
                clearTimeout(window.ecoLightningTimer);
                return;
            }

            const flash = document.createElement('div');
            flash.className = 'eco-lightning-flash';
            document.body.appendChild(flash);

            // Flash on/off
            requestAnimationFrame(() => {
                flash.style.opacity = 0.8;
                setTimeout(() => {
                    flash.style.opacity = 0;
                    setTimeout(() => flash.remove(), 200);
                }, 100);
            });

            // Reagendar próximo raio (aleatório de 2s a 8s)
            window.ecoLightningTimer = setTimeout(lightningFlash, 2000 + Math.random() * 6000);
        }
        window.ecoLightningTimer = setTimeout(lightningFlash, 3000);

        // --- Flood Logic ---
        const water = document.createElement('div');
        water.className = 'eco-flood-water';
        document.body.appendChild(water);
        window.ecoFloodElement = water; // Guarda referência p/ limpar depois

        let waterLevel = 0;
        const maxLevel = 25; // 25% da tela

        const floodRise = () => {
            if (userProfile.equipped.effect !== effect) {
                clearInterval(window.ecoFloodTimer);
                if (water) water.remove();
                return;
            }
            if (waterLevel < maxLevel) {
                waterLevel += 0.2; // Sobe devagar
                water.style.height = `${waterLevel}vh`;
            } else {
                water.style.height = `${maxLevel + Math.sin(Date.now() / 1000) * 2}vh`;
            }
        };

        window.ecoFloodTimer = setInterval(floodRise, 100); // 100ms para fluidez

        // --- Water Interaction (Mouse Inertia & Ripples) ---
        let waterOffsetX = 0;
        let waterOffsetY = 0;
        let targetOffsetX = 0;
        let targetOffsetY = 0;

        water.addEventListener('mousemove', (e) => {
            const rect = water.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // --- Electric Shock Effect (G.A.I.A. Core Theme) ---
            if (document.body.classList.contains('theme-future')) {
                // Criar faísca elétrica
                const spark = document.createElement('div');
                spark.className = 'eco-electric-spark';

                // Altura aleatória da faísca (10-40px)
                const sparkHeight = 10 + Math.random() * 30;
                spark.style.height = `${sparkHeight}px`;

                // Posição aleatória próxima ao mouse (±20px)
                const sparkX = x + (Math.random() - 0.5) * 40;
                const sparkY = y + (Math.random() - 0.5) * 40;

                spark.style.left = `${sparkX}px`;
                spark.style.top = `${sparkY}px`;
                spark.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;

                water.appendChild(spark);
                setTimeout(() => spark.remove(), 300);

                // Criar brilho elétrico (ocasionalmente)
                if (Math.random() < 0.3) {
                    const glow = document.createElement('div');
                    glow.className = 'eco-electric-glow';
                    glow.style.left = `${x}px`;
                    glow.style.top = `${y}px`;
                    water.appendChild(glow);
                    setTimeout(() => glow.remove(), 500);
                }
            }

            // Calcular deslocamento baseado na posição do mouse
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Quanto mais longe do centro, maior o deslocamento (máximo 15px)
            targetOffsetX = ((x - centerX) / centerX) * 15;
            targetOffsetY = ((y - centerY) / centerY) * 8;
        });

        water.addEventListener('mouseleave', () => {
            // Resetar quando o mouse sai
            targetOffsetX = 0;
            targetOffsetY = 0;
        });

        // Animação suave com inércia
        const animateWaterInertia = () => {
            if (userProfile.equipped.effect !== effect) return;

            // Interpolação suave (lerp) para criar inércia
            waterOffsetX += (targetOffsetX - waterOffsetX) * 0.1;
            waterOffsetY += (targetOffsetY - waterOffsetY) * 0.1;

            water.style.transform = `translate(${waterOffsetX}px, ${waterOffsetY}px)`;

            requestAnimationFrame(animateWaterInertia);
        };

        animateWaterInertia();
    }
}

// Expor globalmente
window.gamification = {
    addXp,
    markQuizComplete,
    updateTotalQuizzes,
    userProfile,
    loadProgress,
    openProfile
};

function unlockSecretMatrix() {
    if (!userProfile.unlockedEasterEgg) {
        userProfile.unlockedEasterEgg = true;
        saveProgress();
        showToast("🕵️ MODO HACKER ATIVADO: Você descobriu o segredo da G.A.I.A.! Chuva Matrix liberada na Loja!", 8000);
        // Pequeno glitch visual no HUD para dar feedback
        const hud = document.getElementById('ecoHud');
        if (hud) {
            hud.style.animation = "glitch 0.3s infinite";
            setTimeout(() => { hud.style.animation = ""; }, 1000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    applyEffects();

    // Adicionar clique no HUD para abrir perfil
    const hud = document.getElementById('ecoHud');
    let clickCount = 0;

    if (hud) {
        hud.addEventListener('click', (e) => {
            // Se clicar no ícone do HUD (Emoji) 7 vezes seguido...
            if (e.target.classList.contains('eco-level-icon')) {
                clickCount++;
                if (clickCount === 7) {
                    unlockSecretMatrix();
                    clickCount = 0;
                }
                setTimeout(() => { if (clickCount > 0) clickCount = 0; }, 3000);
            }
            openProfile();
        });
    }

    // --- Scroll Interaction with Effects (Inertia/Wind) ---
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                // Calculamos a velocidade mas com um multiplicador menor
                scrollVelocity = (currentScrollY - lastScrollY) * 0.4;
                lastScrollY = currentScrollY;

                const layer = document.getElementById('ecoEffectLayer');
                if (layer) {
                    // Aplicamos apenas um deslocamento vertical suave (Inércia)
                    const shiftY = Math.max(-20, Math.min(20, -scrollVelocity));
                    layer.style.setProperty('--eco-scroll-shift-y', `${shiftY}px`);
                }

                // Reset da posição quando o scroll para
                clearTimeout(window.ecoScrollReset);
                window.ecoScrollReset = setTimeout(() => {
                    const layer = document.getElementById('ecoEffectLayer');
                    if (layer) {
                        layer.style.setProperty('--eco-scroll-shift-y', `0px`);
                    }
                }, 100);

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // Passive true ajuda muito na performance do scroll
});
