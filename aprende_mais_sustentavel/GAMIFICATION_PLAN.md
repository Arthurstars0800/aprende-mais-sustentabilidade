# Plano de Implementação de Gamificação: Aprende Mais

## 1. Conceito Central: "Jornada do Guardião Gaia"
Transformar a navegação educativa em um jogo de RPG (Role Playing Game) ecológico, onde o usuário evolui de uma "Semente" até se tornar um "Guardião da Natureza" através de ações sustentáveis no site.

---

## 2. Sistema de Pontuação (EcoPoints 🌿)
O usuário acumula **EcoPoints** ao interagir com o site. Como não temos um banco de dados (backend) complexo no momento, usaremos o `localStorage` do navegador para salvar o progresso localmente.

### Tabela de Pontos
| Ação | Pontos (XP) | Condição |
| :--- | :---: | :--- |
| **Completar um Quiz** | +100 | Ao finalizar qualquer quiz. |
| **Mestre do Quiz** | +50 | Bônus por acertar 100% das perguntas. |
| **Leitura Consciente** | +20 | Ao rolar até o final de uma página de conteúdo (Ex: Guia de Reciclagem). |
| **Visitante Diário** | +10 | Acessar o site uma vez por dia (Daily Streak). |
| **Explorador** | +50 | Clicar em links externos ou ferramentas (Ex: "Ver na Loja"). |
| **Easter Egg Dev** | +500 | Descobrir o segredo no nome do desenvolvedor. |

---

## 3. Sistema de Níveis (Ranks)
Conforme ganha pontos, o usuário sobe de nível e desbloqueia novos títulos visuais na barra de navegação.

1.  🌱 **Semente Curiosa** (0 - 499 XP)
2.  🌿 **Brotinho Verde** (500 - 999 XP)
3.  🌳 **Árvore Jovem** (1.000 - 2.499 XP)
4.  🌲 **Floresta Viva** (2.500 - 4.999 XP)
5.  🌍 **Guardião Gaia** (5.000+ XP) - *Nível Máximo*

---

## 4. Conquistas (Badges 🏅)
Medalhas visuais que aparecem em um "Perfil do Usuário" (Modal).

*   **"Primeiros Passos"**: Completar o primeiro quiz.
*   **"Enciclopédia Viva"**: Ler todas as seções do Guia de Reciclagem.
*   **"Hacker do Bem"**: Achar o Easter Egg do desenvolvedor.
*   **"Coruja Noturna"**: Usar o site no Modo Escuro por 10 minutos.

---

## 5. Implementação Técnica

### A. Interface (UI)
1.  **Barra de Progresso (Navbar)**:
    *   Adicionar um pequeno ícone de folha com o Nível atual e uma barra de XP ao lado do botão de Dark Mode.
    *   *Exemplo:* `🌱 Nvl 1 [====..] 120 XP`

2.  **Notificações (Toasts)**:
    *   Pequenos pop-ups no canto da tela quando ganhar pontos.
    *   *Visual:* "+100 EcoPoints! 🌿" (Com som suave opcional).

3.  **Modal de Perfil**:
    *   Um botão na navbar que abre uma janela mostrando:
        *   Avatar (pode ser gerado ou escolhido).
        *   Total de Pontos.
        *   Lista de Conquistas (Desbloqueadas e Bloqueadas).

### B. Lógica (JavaScript)
Criar um estúdio de gamificação em `gamification.js`:
```javascript
const userProfile = {
    xp: 0,
    level: 1,
    badges: [],
    unlockedItems: ['avatar_seed', 'theme_default'],
    equipped: {
        avatar: 'avatar_seed',
        theme: 'theme_default',
        effect: 'none' // 'leaves', 'fireflies', etc.
    },
    lastVisit: Date.now()
};

function addXp(amount) {
    userProfile.xp += amount;
    checkLevelUp();
    saveProgress();
    showToast(`+${amount} EcoPoints! 🌿`);
}
```

---

## 6. Eco-Shop & Customização (Estilo Waze) 🛍️
O usuário usa seus **EcoPoints** ou desbloqueia por **Nível** itens cosméticos para personalizar a experiência. Tudo é 100% opcional e pode ser ativado/desativado no Perfil.

### A. Efeitos Visuais (FX)
1.  **Chuva de Folhas (Falling Leaves)** 🍂
    *   *Descrição:* Folhas caindo suavemente no fundo da tela (como no design original do Canva).
    *   *Desbloqueio:* Nível 3 (Árvore Jovem).
    *   *Custo:* Grátis ao desbloquear.
    *   *Opção:* Botão Toggle ON/OFF no Perfil.

2.  **Modo "Natureza Invadindo" (Overgrown Mode)** 🌿
    *   *Descrição:* Trepadeiras e plantas crescem nos cantos da tela, sobre a navbar e bordas dos cards.
    *   *Desbloqueio:* Conquista "Guardião Gaia" (Nível Máximo).
    *   *Visual:* Dá um aspecto de "ruína ecológica chic" ou floresta encantada.

3.  **Vagalumes Noturnos** ✨
    *   *Descrição:* Pequenos pontos de luz flutuando aleatoriamente (apenas no Dark Mode).
    *   *Desbloqueio:* Conquista "Coruja Noturna".

### B. Skins de Interface
1.  **Avatares de Perfil**:
    *   Nível 1: Semente 🌱
    *   Nível 5: Gatinho Reciclador 🐱
    *   Nível 10: Robô G.A.I.A. 🤖
    *   Loja: Capivara Suprema (1.000 XP).

2.  **Temas de Cores (Paletas)**:
    *   **Padrão**: Verde Sustentável.
    *   **Oceano**: Tons de Azul Profundo (500 XP).
    *   **Pôr do Sol**: Gradiente Roxo/Laranja (1.500 XP).

---

## 7. Próximos Passos (Plano de Execução)
1.  **Fase 1 (Core)**:
    *   Criar `gamification.js` com lógica de XP, Níveis e Save Local.
    *   Criar componente de Notificação (Toast).

2.  **Fase 2 (UI Básica)**:
    *   Adicionar Barra de XP na Navbar.
    *   Criar Modal de Perfil simples.

3.  **Fase 3 (Integração)**:
    *   Dar pontos por Quizzes, Leitura e Easter Eggs.

4.  **Fase 4 (Eco-Shop)**:
    *   Implementar aba de "Loja/Customização" no Modal.
    *   Criar o efeito "Falling Leaves" (JS + CSS Animation).
    *   Criar o efeito "Overgrown Mode" (Imagens PNG fixas nos cantos com `pointer-events: none`).

5.  **Fase 5 (Refinamento)**:
    *   Balancear os pontos.
    *   Adicionar mais skins.

