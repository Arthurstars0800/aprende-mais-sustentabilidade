const quizzes = {
    organico: {
        title: "Lixo Orgânico e Compostagem",
        intro: [
            {
                title: "O que é Lixo Orgânico?",
                content: "Resíduos orgânicos são de origem biológica. Aqui no Aprende Mais, classificamos como: restos de comida, cascas de frutas, dejetos de animais, papéis sujos e até aparas de lápis!",
                icon: "fas fa-apple-whole"
            },
            {
                title: "Por que é perigoso?",
                content: "O lixo orgânico mal tratado emite <strong>gás metano</strong> (que agrava o efeito estufa) e produz o <strong>chorume</strong>, que contamina a terra e a água. Além disso, atrai ratos e insetos transmissores de doenças.",
                icon: "fas fa-exclamation-triangle"
            },
            {
                title: "Como Reciclar / Tratar?",
                content: "A melhor forma é a <strong>Compostagem</strong>! Ela transforma o lixo em adubo rico para enriquecer o solo. Também pode ser usado (com cuidado) para alimentar animais.",
                icon: "fas fa-seedling"
            }
        ],
        questions: [
            {
                q: "Qual destes itens não alimentares é classificado como orgânico pelo projeto?",
                options: ["Aparas de lápis", "Papel higiênico limpo", "Resíduos de metal", "Plásticos pequenos"],
                correct: 0
            },
            {
                q: "O lixo orgânico descartado a céu aberto contribui para o efeito estufa através de qual gás?",
                options: ["Oxigênio puro", "Gás Metano", "Gás Carbônico", "Nitrogênio"],
                correct: 1
            },
            {
                q: "Sobre a compostagem, qual afirmação é tecnicamente correta?",
                options: ["É a queima de lixo", "É um fertilizante químico", "Transforma matéria orgânica em solo fértil", "Serve para reciclar pilhas"],
                correct: 2
            },
            {
                q: "Qual destes subprodutos perigosos é gerado pelo lixo orgânico em decomposição?",
                options: ["Lodo tóxico", "Ar seco", "Fumaça preta", "Chorume escuro"],
                correct: 3
            }
        ]
    },
    pilhas: {
        title: "Pilhas e Baterias",
        intro: [
            {
                title: "O Perigo das Substâncias Químicas",
                content: "As pilhas e baterias possuem substâncias químicas altamente tóxicas. Se descartadas incorretamente, elas liberam metais pesados como <strong>mercúrio e chumbo</strong>.",
                icon: "fas fa-skull-crossbones"
            },
            {
                title: "Contaminação em Massa",
                content: "O descarte errado polui gravemente a água e o solo. Se forem queimadas, liberam metais poluentes que são extremamente prejudiciais à saúde através do ar.",
                icon: "fas fa-biohazard"
            },
            {
                title: "Como Descartar Corretamente?",
                content: "Nunca jogue no lixo comum! O ideal é devolver para o local onde você comprou (logística reversa) ou procurar pontos de coleta seletiva específicos em sua cidade.",
                icon: "fas fa-store-alt"
            }
        ],
        questions: [
            {
                q: "Quais metais pesados são o maior perigo no interior de pilhas e baterias?",
                options: ["Ferro e Cobre", "Prata e Ouro", "Mercúrio e Chumbo", "Alumínio e Zinco"],
                correct: 2
            },
            {
                q: "A devolução do produto ao fabricante para descarte chama-se:",
                options: ["Reciclagem Simples", "Logística Reversa", "Entrega Grátis", "Venda de Lixo"],
                correct: 1
            },
            {
                q: "Ao queimar pilhas, o maior risco para a saúde humana é:",
                options: ["Calor excessivo", "Inalação de metais pesados voláteis", "Brilho intenso", "Ruído alto das explosões"],
                correct: 1
            }
        ]
    },
    seco: {
        title: "Papel, Papelão e Recicláveis",
        intro: [
            {
                title: "Foco deste Quiz",
                content: "Neste quiz será abordado apenas sobre o <strong>papel e o papelão</strong>. O metal e o vidro terão seus próprios questionários agora mesmo!",
                icon: "fas fa-info-circle"
            },
            {
                title: "Quais os Perigos?",
                content: "O lixo seco pode causar poluição do ar (se queimado), obstruir canais de drenagem (causando enchentes) e a falta de reciclagem gera desperdício de recursos naturais.",
                icon: "fas fa-exclamation-circle"
            },
            {
                title: "Como Reciclar Criativamente?",
                content: "Você pode praticar o artesanato! Use caixas e tampas para criar arte, utensílios ou brinquedos. E claro, sempre descarte corretamente no lixo reciclável.",
                icon: "fas fa-paint-brush"
            }
        ],
        questions: [
            {
                q: "Como o descarte de papel e papelão afeta as cidades durante chuvas fortes?",
                options: ["Fertilizam o gramado", "Entopem canais de drenagem", "Limpam as poças", "Melhoram a aderência"],
                correct: 1
            },
            {
                q: "A reciclagem de papel beneficia o meio ambiente pois:",
                options: ["Cria árvores novas", "Pupa árvores e economiza água", "O papel vira plástico", "Purifica a água suja"],
                correct: 1
            },
            {
                q: "Qual item de papel NÃO deve ir para a lixeira reciclável comum?",
                options: ["Jornais velhos", "Revistas limpas", "Papel higiênico usado", "Cartazes de papel"],
                correct: 2
            }
        ]
    },
    vidro: {
        title: "Reciclagem de Vidro",
        intro: [
            {
                title: "Reciclagem Infinita",
                content: "O vidro é um dos materiais mais incríveis: ele pode ser reciclado <strong>infinitas vezes</strong> sem perder a qualidade ou a transparência!",
                icon: "fas fa-wine-glass"
            },
            {
                title: "Segurança em Primeiro Lugar",
                content: "Vidros quebrados são perigosos para os coletores. Sempre embale em jornal ou coloque dentro de uma caixa ou garrafa PET cortada para proteger quem manuseia.",
                icon: "fas fa-shield-heart"
            }
        ],
        questions: [
            {
                q: "Sobre a vida útil da reciclagem do vidro, é correto afirmar:",
                options: ["Sempre perde a qualidade", "Recicla até 7 vezes", "Dura 10 ciclos", "Recicla infinitas vezes"],
                correct: 3
            },
            {
                q: "Como proteger coletores ao descartar um objeto cortante de vidro?",
                options: ["Jogar no saco preto", "Embalar em jornal ou caixa", "Enterrar para cimentar", "Deixar visível no chão"],
                correct: 1
            }
        ]
    },
    metal: {
        title: "Objetos Metálicos",
        intro: [
            {
                title: "Líder em Reciclagem",
                content: "O Brasil é um dos líderes mundiais na reciclagem de latas de alumínio. Reciclar metal economiza até 95% da energia necessária para extrair metal virgem!",
                icon: "fas fa-faucet"
            },
            {
                title: "Metais Diversos",
                content: "Além de latas, pregos, fios, panelas e tampinhas de garrafa também devem ser reciclados. Lembre-se de retirar restos de comida para evitar insetos.",
                icon: "fas fa-tools"
            }
        ],
        questions: [
            {
                q: "Qual a economia de energia gerada pela reciclagem de uma lata de alumínio?",
                options: ["Poupa 20% de luz", "Até 95% de economia", "Usa mais energia", "Gera energia solar"],
                correct: 1
            },
            {
                q: "Retirar restos de comida das latas serve principalmente para:",
                options: ["Não atrair vetores e cheiro", "Facilitar a solda", "A lata ficar mais cara", "Evitar explosões"],
                correct: 0
            }
        ]
    },
    plastico: {
        title: "Cuidados com o Plástico",
        intro: [
            {
                title: "O Inimigo Invisível",
                content: "O plástico pode levar até <strong>500 anos</strong> para se decompor. Quando se quebra, ele vira microplástico, que contamina os oceanos e entra na nossa comida.",
                icon: "fas fa-fish"
            },
            {
                title: "Reduzir é a Chave",
                content: "Existem vários tipos de plásticos (PET, PVC, PP). Nem todos são fáceis de reciclar, por isso o mais importante é reduzir o uso de plásticos descartáveis.",
                icon: "fas fa-leaf"
            }
        ],
        questions: [
            {
                q: "Quanto tempo o plástico leva para se decompor?",
                options: ["1 ano", "10 mil anos", "Até 500 anos", "Nunca se decompõe"],
                correct: 2
            },
            {
                q: "O perigo sistêmico dos plásticos quebrados no mar chama-se:",
                options: ["Nano-metais", "Nano-artesanato", "Bio-degradação", "Microplásticos"],
                correct: 3
            }
        ]
    }
};

const urlParams = new URLSearchParams(window.location.search);
const quizType = urlParams.get('type') || 'organico';
const quiz = quizzes[quizType];

// --- Auxiliary Function: Shuffle ---
function shuffleArray(array, correctIndex) {
    const arr = [...array];
    const originalCorrect = arr[correctIndex];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const newCorrect = arr.indexOf(originalCorrect);
    return { shuffledOptions: arr, newCorrectIndex: newCorrect };
}

// Atualizar total de quizes dinamicamente para a gamificação
if (window.gamification) {
    gamification.updateTotalQuizzes(Object.keys(quizzes).length);
}

let currentIntroSlide = 0;
let currentQuestion = 0;
let score = 0;
let currentCorrectIndex = -1; // New state to track correct index after shuffle

const introSection = document.getElementById('intro-section');
const questionContainer = document.getElementById('question-container');
const introTitle = document.getElementById('intro-title');
const introContent = document.getElementById('intro-content');
const introIcon = document.getElementById('intro-icon');
const nextIntroBtn = document.getElementById('next-intro-btn');

const questionText = document.getElementById('question-text');
const optionsGrid = document.getElementById('options-grid');
const progressFill = document.getElementById('progress-fill');
const resultContainer = document.getElementById('result-container');
const scoreText = document.getElementById('score-text');

if (quiz) {
    document.title = `${quiz.title} - Quiz Aprende Mais`;
    startIntro();
}

function startIntro() {
    if (quiz.intro && quiz.intro.length > 0) {
        introSection.style.display = 'block';
        questionContainer.style.display = 'none';
        showIntroSlide();
    } else {
        startQuiz();
    }
}

function showIntroSlide() {
    const slide = quiz.intro[currentIntroSlide];
    introTitle.innerText = slide.title;
    introContent.innerHTML = slide.content;
    introIcon.className = `${slide.icon} intro-slide-icon`;

    // Update progress slightly for intro
    const totalSteps = quiz.intro.length + quiz.questions.length;
    const progress = ((currentIntroSlide + 1) / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
}

if (nextIntroBtn) {
    nextIntroBtn.onclick = () => {
        currentIntroSlide++;
        if (currentIntroSlide < quiz.intro.length) {
            showIntroSlide();
        } else {
            startQuiz();
        }
    };
}

function startQuiz() {
    introSection.style.display = 'none';
    questionContainer.style.display = 'block';
    loadQuestion();
}

function loadQuestion() {
    const qData = quiz.questions[currentQuestion];
    questionText.innerText = qData.q;
    optionsGrid.innerHTML = "";

    // Update progress (counting intros already done)
    const totalSteps = quiz.intro.length + quiz.questions.length;
    const currentStep = quiz.intro.length + currentQuestion;
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;

    // Shuffle options
    const { shuffledOptions, newCorrectIndex } = shuffleArray(qData.options, qData.correct);
    currentCorrectIndex = newCorrectIndex;

    shuffledOptions.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, btn);
        optionsGrid.appendChild(btn);
    });
}

function checkAnswer(index, btn) {
    const allButtons = optionsGrid.querySelectorAll('.option-btn');

    allButtons.forEach(b => b.style.pointerEvents = 'none');

    if (index === currentCorrectIndex) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        allButtons[currentCorrectIndex].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quiz.questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    // Gamification Integration
    if (window.gamification) {
        const baseXP = 300;
        const perfectBonus = 500;

        gamification.addXp(baseXP, "(Quiz Finalizado!");
        if (score === quiz.questions.length) {
            gamification.addXp(perfectBonus, "(GABARITOU! Mestre da Sustentabilidade 🏆)");
        }
        // Marcar este quiz como completo no perfil do usuário
        gamification.markQuizComplete(quizType);
    }

    progressFill.style.width = "100%";
    questionContainer.style.display = "none";
    introSection.style.display = "none";
    resultContainer.style.display = "block";
    scoreText.innerText = `Você acertou ${score} de ${quiz.questions.length} perguntas!`;

    const gaiaTitle = document.getElementById('gaia-msg-title');
    const gaiaText = document.getElementById('gaia-msg-text');

    if (score < quiz.questions.length) {
        // Se errou alguma questão
        gaiaTitle.innerText = "Ficou com dúvidas?";
        gaiaText.innerHTML = "Aprenda mais com a <strong>G.A.I.A.</strong>! Com ela é só perguntar como e onde descartar e você já consegue as suas respostas.";
    } else {
        // Se acertou tudo (Gabartinou)
        gaiaTitle.innerText = "Próximo Passo?";
        gaiaText.innerHTML = "Agora que você aprendeu como descartar, <strong>converse com a G.A.I.A.</strong> para saber qual é o ponto de coleta mais próximo de você!";
    }
}
