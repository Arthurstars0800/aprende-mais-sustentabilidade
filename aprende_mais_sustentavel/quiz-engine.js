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
                q: "Quais materiais compõem a definição de lixo orgânico?",
                options: [
                    "Cascas de frutas, plástico e pilhas",
                    "Restos de comida, cascas de frutas, dejetos de animais, papéis sujos e aparas de lápis",
                    "Aparas de lápis, dejetos de animais e plástico",
                    "Pilhas, baterias e vidro"
                ],
                correct: 1
            },
            {
                q: "Por que o lixo orgânico pode ser perigoso para o planeta?",
                options: [
                    "Pois polui o ar com gás metano (efeito estufa) e a terra/água com o chorume",
                    "Ele não é perigoso em nenhuma circunstância",
                    "Pois o lixo orgânico atrai apenas animais domésticos",
                    "Pois emite gases que fazem a atmosfera entrar em combustão"
                ],
                correct: 0
            },
            {
                q: "Além da poluição, qual outro perigo o lixo orgânico mal tratado oferece?",
                options: [
                    "Melhora a estética das ruas",
                    "Proliferação de causadores de doenças como ratos, mosquitos e baratas",
                    "Geração de energia solar gratuita",
                    "Não oferece nenhum perigo à saúde"
                ],
                correct: 1
            },
            {
                q: "O que pode ser feito para 'reciclar' o lixo orgânico de forma útil?",
                options: [
                    "Queimar o lixo para beneficiar o ar com fumaça",
                    "Descartar em lixos comuns para os coletores",
                    "Fazer compostagem, enriquecer o solo ou alimentar animais cuidadosamente",
                    "Jogar na rua para fortalecer o asfalto"
                ],
                correct: 2
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
                q: "Quais os perigos de descartar incorretamente as pilhas e baterias?",
                options: [
                    "Não há perigos no descarte comum",
                    "Os metais em sua composição poluem o solo causando apenas mau cheiro",
                    "Quando sua queima acontece elas explodem sem liberar gases",
                    "Seus gases e metais poluentes são extremamente prejudiciais à água, solo e ar"
                ],
                correct: 3
            },
            {
                q: "Como deve se descartar corretamente pilhas e baterias?",
                options: [
                    "Descartando no lixo comum ou reciclável de papel",
                    "Devolvendo ao local de compra ou procurando locais de coleta seletiva",
                    "Queimando pois os metais podem ser vendidos no futuro",
                    "Enterrando no quintal para não poluir os rios"
                ],
                correct: 1
            },
            {
                q: "O que acontece se as pilhas forem queimadas?",
                options: [
                    "Elas desaparecem sem deixar resíduos",
                    "Liberam metais pesados como mercúrio e chumbo no ar",
                    "Transformam-se em cinzas orgânicas úteis",
                    "Ajudam a purificar a fumaça de incêndios"
                ],
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
                q: "Quais materiais compõem a definição de lixo seco?",
                options: ["Papel, Papelão e Plástico", "Cascas de Frutas, Papelão e Plástico", "Papel, Vidro, Metais, Papelão e Plástico", "Vidro, Papel e Papelão"],
                correct: 2
            },
            {
                q: "Qual deste é um perigo do lixo seco descartado incorretamente?",
                options: ["Geração de adubo orgânico", "Obstrução de canais de drenagem", "Melhora da qualidade do ar", "Aumento da biodiversidade local"],
                correct: 1
            },
            {
                q: "Qual a melhor forma de tratar caixas e tampas de lixo seco?",
                options: ["Queimar para reduzir o volume", "Praticar o artesanato e fazer brinquedos", "Enterrar para decomposição", "Descartar sem lavar ou tratar"],
                correct: 1
            },
            {
                q: "Neste quiz, qual o foco principal para evitar confusão com outros resíduos?",
                options: ["Apenas Plásticos", "Apenas Metais", "Papel e Papelão", "Apenas Vidros"],
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
                q: "Quantas vezes o vidro pode ser reciclado?",
                options: ["Apenas 2 vezes", "Cerca de 10 vezes", "Infinitas vezes", "O vidro não é reciclável"],
                correct: 2
            },
            {
                q: "Qual a forma mais segura de descartar um copo quebrado?",
                options: ["Jogar livremente na lixeira", "Envolver em papel jornal ou colocar dentro de uma embalagem protetora", "Enterrar no jardim", "Queimar para derreter o vidro"],
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
                q: "Qual vantagem principal de reciclar o alumínio?",
                options: ["Deixa as latas mais pesadas", "Economiza até 95% da energia de produção", "Faz o metal brilhar mais", "Não há vantagem real"],
                correct: 1
            },
            {
                q: "O que deve ser feito com latas de conserva antes do descarte?",
                options: ["Nada, pode descartar suja", "Esvaziar e passar uma água para retirar resíduos", "Pintar para proteger do sol", "Amassar sem lavar"],
                correct: 1
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
                q: "Quanto tempo o plástico pode levar para se decompor na natureza?",
                options: ["10 anos", "50 anos", "Até 500 anos", "1 mês"],
                correct: 2
            },
            {
                q: "O que são microplásticos?",
                options: ["Plásticos pequenos feitos para brinquedos", "Partículas minúsculas que poluem a água e entram na cadeia alimentar", "Um tipo de adubo plástico", "Pedaços de plástico usados na construção civil"],
                correct: 1
            }
        ]
    }
};

const urlParams = new URLSearchParams(window.location.search);
const quizType = urlParams.get('type') || 'organico';
const quiz = quizzes[quizType];

// Atualizar total de quizes dinamicamente para a gamificação
if (window.gamification) {
    gamification.updateTotalQuizzes(Object.keys(quizzes).length);
}

let currentIntroSlide = 0;
let currentQuestion = 0;
let score = 0;

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

    qData.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, btn);
        optionsGrid.appendChild(btn);
    });
}

function checkAnswer(index, btn) {
    const qData = quiz.questions[currentQuestion];
    const allButtons = optionsGrid.querySelectorAll('.option-btn');

    allButtons.forEach(b => b.style.pointerEvents = 'none');

    if (index === qData.correct) {
        btn.classList.add('correct');
        score++;
    } else {
        btn.classList.add('wrong');
        allButtons[qData.correct].classList.add('correct');
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
