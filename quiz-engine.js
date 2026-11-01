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
    },
    energia: {
        title: "Energia Renovável e Sustentável",
        intro: [
            {
                title: "O que é Energia Renovável?",
                content: "Energia renovável vem de fontes <strong>naturais que se regeneram</strong> constantemente — o sol sempre nasce, o vento nunca para e os rios continuam fluindo. Ao contrário dos combustíveis fósseis, essas fontes não se esgotam e emitem muito menos gases poluentes.",
                icon: "fas fa-sun"
            },
            {
                title: "Exemplos de Energia Renovável",
                content: "<strong>☀️ Solar:</strong> painéis fotovoltaicos convertem luz em eletricidade.<br><strong>💨 Eólica:</strong> turbinas e cataventos capturam a força do vento.<br><strong>💧 Hidrelétrica:</strong> a correnteza dos rios move turbinas gigantes.<br><strong>🌿 Biomassa:</strong> matéria orgânica (como cana-de-açúcar) é transformada em biocombustível.<br><strong>🌋 Geotérmica:</strong> calor do interior da Terra aquece casas em países como a Islândia.",
                icon: "fas fa-bolt"
            },
            {
                title: "O que é Energia Não Renovável?",
                content: "São fontes que levaram <strong>milhões de anos</strong> para se formar e não podem ser repostas no tempo de uma vida humana. Incluem <strong>petróleo, gás natural, carvão mineral e energia nuclear</strong> (urânio). Sua extração e queima liberam CO₂ e outros poluentes que aceleram as mudanças climáticas.",
                icon: "fas fa-industry"
            },
            {
                title: "Exemplos de Energia Não Renovável",
                content: "<strong>🛢️ Petróleo:</strong> base da gasolina, diesel e plásticos.<br><strong>⛏️ Carvão Mineral:</strong> ainda é a principal fonte elétrica em vários países, mas é o mais poluente.<br><strong>🔥 Gás Natural:</strong> menos poluente que o carvão, mas ainda emite CO₂.<br><strong>☢️ Nuclear:</strong> não emite CO₂ na geração, mas produz lixo radioativo de difícil descarte.",
                icon: "fas fa-oil-can"
            },
            {
                title: "Por que a Transição Energética Importa?",
                content: "Hoje, <strong>80% da energia global</strong> ainda vem de fontes fósseis. Migrar para renováveis reduz o aquecimento global, melhora a qualidade do ar e cria empregos. O Brasil já é um dos líderes mundiais em energia renovável — mais de <strong>85% da nossa eletricidade</strong> vem de fontes limpas, principalmente hidrelétricas e solar.",
                icon: "fas fa-globe-americas"
            }
        ],
        questions: [
            {
                q: "Qual característica define uma fonte de energia como 'renovável'?",
                options: [
                    "É produzida por uma empresa pública",
                    "Se regenera naturalmente e não se esgota",
                    "É mais barata que o petróleo",
                    "Precisa de combustível para funcionar"
                ],
                correct: 1
            },
            {
                q: "A energia eólica é gerada pela força de qual elemento natural?",
                options: ["Calor do sol", "Movimento das marés", "Força do vento", "Queda d'água"],
                correct: 2
            },
            {
                q: "Qual destas fontes de energia é classificada como NÃO renovável?",
                options: ["Energia solar", "Biomassa de cana-de-açúcar", "Energia hidrelétrica", "Carvão mineral"],
                correct: 3
            },
            {
                q: "Qual o maior problema ambiental associado ao uso de combustíveis fósseis?",
                options: [
                    "Produzem muito ruído nas cidades",
                    "Emitem CO₂ e aceleram o aquecimento global",
                    "Gastam muita água no processo",
                    "São difíceis de transportar"
                ],
                correct: 1
            },
            {
                q: "A energia geotérmica utiliza como fonte primária:",
                options: [
                    "Calor emitido pelo sol diretamente",
                    "Fermentação de resíduos orgânicos",
                    "Calor natural do interior da Terra",
                    "Energia cinética das ondas do mar"
                ],
                correct: 2
            },
            {
                q: "Sobre a energia nuclear, qual afirmação é correta?",
                options: [
                    "É renovável pois o urânio se regenera",
                    "Não emite CO₂ na geração, mas gera lixo radioativo",
                    "É a fonte mais limpa e sem riscos do planeta",
                    "Usa a força do vento para mover os reatores"
                ],
                correct: 1
            },
            {
                q: "O Brasil se destaca no cenário energético mundial porque:",
                options: [
                    "É o maior exportador de petróleo do mundo",
                    "Tem mais de 85% da eletricidade gerada por fontes limpas",
                    "Possui o maior reator nuclear do continente",
                    "Proibiu o uso de combustíveis fósseis"
                ],
                correct: 1
            },
            {
                q: "A biomassa como fonte de energia utiliza principalmente:",
                options: [
                    "Rochas aquecidas pelo sol",
                    "Ventos de alta altitude",
                    "Matéria orgânica como cana-de-açúcar e resíduos",
                    "Água do lençol freático"
                ],
                correct: 2
            }
        ]
    }
,
    eolica: {
        "title": "Energia Eólica",
        "intro": [
                {
                        "title": "A Força dos Ventos",
                        "content": "A energia eólica é gerada a partir da <strong>energia cinética das massas de ar</strong> (o vento). Grandes aerogeradores (turbinas eólicas) captam essa força e a transformam em energia mecânica e, em seguida, em eletricidade 100% limpa e renovável.",
                        "icon": "fas fa-wind"
                },
                {
                        "title": "Como Funciona um Aerogerador?",
                        "content": "O vento sopra e faz as pás girarem. Esse movimento aciona um rotor ligado a um multiplicador de velocidade e a um gerador elétrico no alto da torre. A eletricidade desce por cabos até uma subestação e vai direto para a rede de distribuição.",
                        "icon": "fas fa-fan"
                },
                {
                        "title": "Parques Onshore e Offshore",
                        "content": "Os parques eólicos podem ser <strong>Onshore</strong> (em terra firme, comuns no Nordeste brasileiro) ou <strong>Offshore</strong> (instalados no mar, onde os ventos são mais fortes, constantes e sem obstáculos geográficos).",
                        "icon": "fas fa-water"
                },
                {
                        "title": "Vantagens e Desafios",
                        "content": "<strong>Vantagens:</strong> zero emissão de gases estufa na operação, fonte inesgotável e baixo custo operacional.<br><strong>Desafios:</strong> intermitência (vento não sopra o tempo todo com a mesma força), impacto visual/sonoro e rota de aves que exige estudos ambientais prévios.",
                        "icon": "fas fa-leaf"
                }
        ],
        "questions": [
                {
                        "q": "Qual tipo de energia presente no vento é capturada pelas pás dos aerogeradores?",
                        "options": [
                                "Energia térmica",
                                "Energia cinética",
                                "Energia nuclear",
                                "Energia química"
                        ],
                        "correct": 1
                },
                {
                        "q": "Como são chamados os parques eólicos instalados dentro do oceano/mar?",
                        "options": [
                                "Parques Onshore",
                                "Parques Marítimos Costeiros",
                                "Parques Offshore",
                                "Parques Subaquáticos"
                        ],
                        "correct": 2
                },
                {
                        "q": "No Brasil, qual região lidera a produção de energia eólica graças aos seus ventos fortes e constantes?",
                        "options": [
                                "Região Sul",
                                "Região Sudeste",
                                "Região Nordeste",
                                "Região Centro-Oeste"
                        ],
                        "correct": 2
                },
                {
                        "q": "Qual é um dos principais desafios técnicos da energia eólica na rede elétrica?",
                        "options": [
                                "A água do mar corrói os postes em terra firme",
                                "A intermitência dos ventos (não ventar com a mesma força o tempo todo)",
                                "A emissão de dióxido de carbono durante o giro das pás",
                                "A necessidade de queimar carvão para iniciar o movimento"
                        ],
                        "correct": 1
                }
        ]
},
    solar: {
        "title": "Energia Solar",
        "intro": [
                {
                        "title": "O Poder da Luz Solar",
                        "content": "O Sol envia para a Terra em uma hora mais energia do que a humanidade consome em um ano inteiro. A energia solar aproveita a luz e a radiação do sol para gerar eletricidade limpa ou aquecer fluidos.",
                        "icon": "fas fa-sun"
                },
                {
                        "title": "Solar Fotovoltaica vs. Solar Térmica",
                        "content": "<strong>Fotovoltaica:</strong> placas solares feitas de silício convertem diretamente fótons da luz em corrente elétrica contínua via o <em>efeito fotovoltaico</em>.<br><strong>Térmica:</strong> coletores solares usam o calor do sol para aquecer água para chuveiros, piscinas e processos industriais.",
                        "icon": "fas fa-solar-panel"
                },
                {
                        "title": "Sistemas On-Grid e Off-Grid",
                        "content": "<strong>On-Grid:</strong> conectado à rede pública de energia (o excesso de energia gerado vira créditos na conta).<br><strong>Off-Grid:</strong> isolado da rede, armazenando a energia em baterias (muito usado em áreas rurais remotas e barcos).",
                        "icon": "fas fa-network-wired"
                },
                {
                        "title": "Sustentabilidade e Vida Útil",
                        "content": "Os painéis solares têm vida útil superior a 25 anos, exigem pouquíssima manutenção e suas placas são amplamente recicláveis (vidro, alumínio e silício).",
                        "icon": "fas fa-recycle"
                }
        ],
        "questions": [
                {
                        "q": "Qual fenômeno físico permite às placas de silício converter luz solar diretamente em eletricidade?",
                        "options": [
                                "Efeito Estufa",
                                "Efeito Fotovoltaico",
                                "Efeito Doppler",
                                "Fissão Solar"
                        ],
                        "correct": 1
                },
                {
                        "q": "Qual a principal diferença entre um sistema solar On-Grid e um Off-Grid?",
                        "options": [
                                "On-Grid é conectado à rede elétrica da cidade; Off-Grid usa baterias isoladas",
                                "On-Grid só funciona à noite; Off-Grid só funciona de dia",
                                "On-Grid aquece água; Off-Grid gera eletricidade",
                                "Off-Grid necessita de cabos submarinos"
                        ],
                        "correct": 0
                },
                {
                        "q": "Qual material semicondutor é o mais utilizado na fabricação de células fotovoltaicas?",
                        "options": [
                                "Cobre",
                                "Ferro fundido",
                                "Silício",
                                "Plástico reciclado"
                        ],
                        "correct": 2
                },
                {
                        "q": "Em média, qual é a vida útil esperada de um módulo solar fotovoltaico de qualidade?",
                        "options": [
                                "2 a 3 anos",
                                "5 anos",
                                "Mais de 25 anos",
                                "100 anos"
                        ],
                        "correct": 2
                }
        ]
},
    aquecimento_global: {
        title: "Aquecimento Global e Mudanças Climáticas",
        intro: [
            {
                title: "O que é o Aquecimento Global?",
                content: "O aquecimento global é o aumento progressivo da <strong>temperatura média da Terra</strong> causado principalmente pelo acúmulo de gases de efeito estufa (GEE) na atmosfera — como CO₂, metano e vapor d'água. Esses gases formam uma 'cobertura' que retém o calor solar e impede que ele escape para o espaço.",
                icon: "fas fa-temperature-high"
            },
            {
                title: "Quais são as Principais Causas?",
                content: "<strong>🏭 Queima de combustíveis fósseis:</strong> petróleo, carvão e gás natural liberam CO₂ em grande escala.<br><strong>🌳 Desmatamento:</strong> florestas absorvem CO₂; destruí-las piora o problema e libera o carbono armazenado.<br><strong>🐄 Pecuária intensiva:</strong> o gado libera metano — um gás 25x mais potente que o CO₂.<br><strong>🗑️ Aterros sanitários:</strong> a decomposição de lixo orgânico libera metano e CO₂.",
                icon: "fas fa-industry"
            },
            {
                title: "Quais são as Consequências?",
                content: "Cada décimo de grau a mais impacta milhões de vidas:<br>• <strong>Derretimento de geleiras</strong> → elevação do nível dos oceanos<br>• <strong>Eventos climáticos extremos</strong> → secas, enchentes e furacões mais intensos<br>• <strong>Extinção de espécies</strong> → perda de biodiversidade e equilíbrio ecológico<br>• <strong>Insegurança alimentar</strong> → colheitas menores e deslocamento de populações",
                icon: "fas fa-exclamation-triangle"
            },
            {
                title: "O que Podemos Fazer?",
                content: "O <strong>Acordo de Paris (2015)</strong> comprometeu 196 países a limitar o aquecimento a <strong>1,5°C acima dos níveis pré-industriais</strong>. Individualmente: reduzir consumo de carne, usar transporte limpo, evitar desperdício de energia e apoiar energias renováveis fazem diferença real.",
                icon: "fas fa-globe-americas"
            }
        ],
        questions: [
            {
                q: "O efeito estufa natural é:",
                options: [
                    "Um fenômeno totalmente artificial criado pela indústria",
                    "Essencial para a vida na Terra, pois mantém o planeta aquecido",
                    "Exclusivamente causado pelo CO₂ humano",
                    "Um fenômeno que só ocorre nos polos"
                ],
                correct: 1
            },
            {
                q: "Qual gás de efeito estufa liberado pela pecuária é especialmente preocupante?",
                options: ["Dióxido de carbono (CO₂)", "Nitrogênio (N₂)", "Metano (CH₄)", "Oxigênio (O₂)"],
                correct: 2
            },
            {
                q: "Por que o desmatamento agrava o aquecimento global?",
                options: [
                    "Porque as árvores produzem metano ao crescer",
                    "Porque remove vegetação que absorve CO₂ e libera o carbono armazenado",
                    "Porque aumenta a umidade do ar e o efeito estufa",
                    "Porque impede a formação de chuvas ácidas"
                ],
                correct: 1
            },
            {
                q: "O Acordo de Paris estabelece como meta limitar o aquecimento a:",
                options: ["0,5°C acima dos níveis pré-industriais", "1,5°C acima dos níveis pré-industriais", "3°C acima dos níveis pré-industriais", "5°C acima dos níveis pré-industriais"],
                correct: 1
            },
            {
                q: "Qual das alternativas representa uma consequência direta do derretimento das geleiras polares?",
                options: [
                    "Redução da salinidade do ar",
                    "Diminuição da temperatura dos oceanos",
                    "Elevação do nível do mar, ameaçando cidades costeiras",
                    "Aumento das reservas de água potável subterrânea"
                ],
                correct: 2
            },
            {
                q: "Entre as opções abaixo, qual atitude individual mais contribui para reduzir a pegada de carbono?",
                options: [
                    "Usar mais sacolas plásticas descartáveis",
                    "Substituir transporte individual por bicicleta ou transporte público",
                    "Aumentar o consumo de carne vermelha",
                    "Deixar aparelhos em standby permanentemente"
                ],
                correct: 1
            }
        ]
    },

    eletrodomesticos: {
        title: "Descarte de Eletrodomésticos e Eletrônicos (REEE)",
        intro: [
            {
                title: "O que é o Lixo Eletrônico (e-lixo)?",
                content: "O <strong>Resíduo de Equipamentos Elétricos e Eletrônicos (REEE)</strong>, ou e-lixo, engloba todo aparelho descartado que usa eletricidade: geladeiras, celulares, TVs, computadores, micro-ondas, baterias e até cabos. É um dos tipos de resíduo <strong>que mais crescem no mundo</strong> — o planeta gerou mais de 62 milhões de toneladas de e-lixo em 2023.",
                icon: "fas fa-tv"
            },
            {
                title: "Por que é tão Perigoso?",
                content: "O e-lixo contém substâncias altamente tóxicas:<br>• <strong>Chumbo e mercúrio</strong> (monitores e lâmpadas)<br>• <strong>Cádmio</strong> (baterias recarregáveis)<br>• <strong>Cromo hexavalente</strong> (placas de circuito)<br>• <strong>Retardantes de chama bromados</strong> (plásticos internos)<br>Quando jogados em aterros comuns, esses elementos contaminam o solo e os lençóis freáticos por décadas.",
                icon: "fas fa-skull-crossbones"
            },
            {
                title: "A Lei no Brasil",
                content: "A <strong>Política Nacional de Resíduos Sólidos (PNRS — Lei 12.305/2010)</strong> obriga fabricantes e importadores a implementarem sistemas de <strong>logística reversa</strong> para eletrodomésticos e eletrônicos. Ou seja: a empresa que vende o produto é responsável por recolhê-lo ao fim da vida útil.",
                icon: "fas fa-gavel"
            },
            {
                title: "Como Descartar Corretamente?",
                content: "<strong>✅ Pontos de coleta</strong> em lojas de eletroeletrônicos (a maioria é obrigada por lei a aceitar).<br><strong>✅ Ecopontos municipais</strong> — verifique o site da prefeitura.<br><strong>✅ Fabricante / assistência técnica</strong> — programas de devolução.<br><strong>❌ Nunca</strong> jogue no lixo comum, queime ou deixe na rua — além de ilegal, é crime ambiental.",
                icon: "fas fa-recycle"
            }
        ],
        questions: [
            {
                q: "A sigla REEE significa:",
                options: [
                    "Reciclagem Especial de Entulho Eletrônico",
                    "Resíduo de Equipamentos Elétricos e Eletrônicos",
                    "Regulamento Estatal de Emissões Elétricas",
                    "Rede Estadual de Energia Eficiente"
                ],
                correct: 1
            },
            {
                q: "Qual metal pesado, presente em monitores e lâmpadas antigas, é especialmente tóxico no e-lixo?",
                options: ["Ferro", "Alumínio", "Mercúrio", "Titânio"],
                correct: 2
            },
            {
                q: "Pela legislação brasileira (PNRS), quem é o principal responsável pela logística reversa de eletrodomésticos?",
                options: [
                    "Somente o consumidor final",
                    "O governo municipal de cada cidade",
                    "Os fabricantes e importadores do produto",
                    "As cooperativas de catadores voluntários"
                ],
                correct: 2
            },
            {
                q: "Qual dessas ações é a CORRETA ao descartar um celular velho?",
                options: [
                    "Jogar no lixo orgânico para decompor naturalmente",
                    "Queimar para destruir os dados pessoais com segurança",
                    "Levar a um ponto de coleta de e-lixo ou devolver ao fabricante",
                    "Enterrar no quintal para evitar contaminação de aterros"
                ],
                correct: 2
            },
            {
                q: "O cádmio, encontrado em baterias recarregáveis, representa risco ambiental porque:",
                options: [
                    "Produz calor excessivo quando em contato com a água",
                    "Contamina solo e lençóis freáticos e é altamente tóxico para organismos vivos",
                    "Emite radiação ionizante que contamina o ar",
                    "Reage com o oxigênio e forma gás carbônico em grande quantidade"
                ],
                correct: 1
            },
            {
                q: "De acordo com dados globais recentes, o e-lixo é:",
                options: [
                    "Um tipo de resíduo em declínio graças ao avanço da reciclagem",
                    "Menos perigoso que o lixo orgânico por não criar chorume",
                    "Um dos fluxos de resíduos que mais crescem no mundo",
                    "Totalmente biodegradável em até 5 anos"
                ],
                correct: 2
            }
        ]
    },

    alimentacao: {
        title: "Alimentação Sustentável e Desperdício de Alimentos",
        intro: [
            {
                title: "O Tamanho do Problema",
                content: "Cerca de <strong>1/3 de todos os alimentos produzidos no mundo</strong> são desperdiçados — isso equivale a aproximadamente <strong>1,3 bilhão de toneladas por ano</strong>. Enquanto isso, mais de 700 milhões de pessoas passam fome. O desperdício alimentar é responsável por cerca de <strong>8–10% das emissões globais de gases de efeito estufa</strong>.",
                icon: "fas fa-utensils"
            },
            {
                title: "De onde vem o Desperdício?",
                content: "O desperdício acontece em toda a cadeia:<br>• <strong>🌾 Campo:</strong> colheita inadequada, transporte ruim, padrões estéticos rígidos (frutas 'feias' rejeitadas)<br>• <strong>🏪 Varejo:</strong> validade vencida, estoque excessivo, embalagens danificadas<br>• <strong>🏠 Consumidor:</strong> compras em excesso, mau armazenamento, não aproveitar cascas e talos",
                icon: "fas fa-store"
            },
            {
                title: "O que é Alimentação Sustentável?",
                content: "Uma dieta sustentável tem <strong>baixo impacto ambiental</strong>, é nutritiva e acessível. Principais práticas:<br>• Preferir alimentos <strong>locais e sazonais</strong> (menos transporte e energia)<br>• Reduzir o consumo de <strong>carne vermelha</strong> (pecuária = alto carbono)<br>• Valorizar a <strong>agricultura familiar</strong> e orgânica<br>• Aproveitar <strong>cascas, talos e sementes</strong> nas receitas",
                icon: "fas fa-leaf"
            },
            {
                title: "Como Reduzir o Desperdício em Casa?",
                content: "<strong>🛒 Planeje as compras:</strong> faça lista e compre só o necessário.<br><strong>🧊 Armazene corretamente:</strong> cada alimento tem a temperatura e local ideais.<br><strong>📅 Consuma por ordem de validade:</strong> coloque os mais velhos na frente da geladeira.<br><strong>🥗 Reaproveite sobras:</strong> cascas de legumes viram caldo; pão velho vira torrada ou farinha.<br><strong>🌱 Composte:</strong> restos inevitáveis viram adubo.",
                icon: "fas fa-seedling"
            }
        ],
        questions: [
            {
                q: "Qual percentual aproximado dos alimentos produzidos no mundo é desperdiçado?",
                options: ["Cerca de 5%", "Cerca de 1/3 (33%)", "Cerca de 60%", "Menos de 1%"],
                correct: 1
            },
            {
                q: "Qual etapa da cadeia alimentar NÃO é uma fonte comum de desperdício?",
                options: [
                    "Colheita e transporte inadequados no campo",
                    "Estoque excessivo no varejo com validade vencendo",
                    "A digestão natural dos alimentos no corpo humano",
                    "Compras em excesso e mau armazenamento pelo consumidor"
                ],
                correct: 2
            },
            {
                q: "Por que reduzir o consumo de carne vermelha está ligado à sustentabilidade?",
                options: [
                    "Porque carnes vermelhas estragam mais rápido e geram mais lixo",
                    "Porque a pecuária intensiva libera grandes quantidades de metano e usa muita água e terra",
                    "Porque a carne vermelha contém corantes artificiais prejudiciais ao meio ambiente",
                    "Porque os animais emitem CO₂ na respiração, poluindo o ar das cidades"
                ],
                correct: 1
            },
            {
                q: "O que significa preferir alimentos 'sazonais' do ponto de vista da sustentabilidade?",
                options: [
                    "Comprar apenas alimentos em promoção nos supermercados",
                    "Consumir frutas e vegetais que estão em sua época natural de colheita, reduzindo energia e transporte",
                    "Preferir alimentos enlatados, que têm maior durabilidade",
                    "Escolher alimentos produzidos em outros países para diversificar a dieta"
                ],
                correct: 1
            },
            {
                q: "Qual prática doméstica ajuda a reduzir o desperdício de alimentos E ainda beneficia o solo?",
                options: [
                    "Jogar cascas e restos no lixo comum em sacos bem fechados",
                    "Guardar tudo no freezer por tempo indeterminado",
                    "Fazer compostagem com os resíduos orgânicos inevitáveis",
                    "Comprar sempre em grandes quantidades para ter estoque"
                ],
                correct: 2
            },
            {
                q: "O desperdício de alimentos contribui para o aquecimento global porque:",
                options: [
                    "Alimentos desperdiçados emitem fumaça visível ao apodrecer",
                    "A decomposição em aterros libera metano, e toda a energia usada para produzir o alimento foi em vão",
                    "Supermercados precisam ligar o ar condicionado por mais tempo para conservar o excesso",
                    "Alimentos jogados fora formam chorume que evapora e entra na atmosfera"
                ],
                correct: 1
            }
        ]
    },

    cidades_verdes: {
        "title": "Cidades Verdes e Sustentáveis",
        "intro": [
                {
                        "title": "O que é uma Cidade Verde?",
                        "content": "Uma <strong>Cidade Verde</strong> (ou ecocidade) é um centro urbano projetado para integrar desenvolvimento socioeconômico com preservação ambiental, eficiência energética, mobilidade ativa e redução drástica da pegada ecológica.",
                        "icon": "fas fa-tree"
                },
                {
                        "title": "Critérios para ser Considerada Verde",
                        "content": "Para ser considerada verde, a cidade deve apresentar:<br>• <strong>Áreas verdes:</strong> parques, praças e arborização que garantam conforto térmico e absorção de chuvas.<br>• <strong>Mobilidade sustentável:</strong> ciclovias conectadas, calçadas acessíveis e transporte público elétrico ou de baixa emissão.<br>• <strong>Gestão de resíduos:</strong> alta taxa de reciclagem, compostagem e erradicação de lixões a céu aberto.",
                        "icon": "fas fa-city"
                },
                {
                        "title": "Eficiência e Resiliência Climática",
                        "content": "Cidades verdes investem em <em>construções sustentáveis</em> (prédios com painéis solares e reaproveitamento de água da chuva), calçadas permeáveis contra enchentes e planejamento para resistir a ondas de calor e eventos climáticos extremos.",
                        "icon": "fas fa-building"
                },
                {
                        "title": "Exemplos no Brasil e no Mundo",
                        "content": "Cidades como <strong>Copenhague</strong> (meta de carbono neutro e 60% de uso de bikes), <strong>Singapura</strong> (cidade-jardim vertical) e <strong>Curitiba</strong> (referência histórica nacional em planejamento urbano e transporte coletivo) são modelos de cidades sustentáveis.",
                        "icon": "fas fa-globe"
                }
        ],
        "questions": [
                {
                        "q": "Qual é um dos pilares essenciais na mobilidade de uma autêntica Cidade Verde?",
                        "options": [
                                "Aumentar o número de pistas para carros individuais",
                                "Priorizar transporte coletivo de baixa emissão e ciclovias integradas",
                                "Eliminar calçadas para ampliar o estacionamento",
                                "Substituir ônibus por veículos a diesel pesados"
                        ],
                        "correct": 1
                },
                {
                        "q": "Como a ampla presença de parques, telhados verdes e árvores ajuda diretamente as cidades?",
                        "options": [
                                "Aumenta a poeira e o calor urbano",
                                "Combate as ilhas de calor e ajuda na drenagem das águas da chuva",
                                "Dificulta a circulação de pedestres",
                                "Gera excesso de gás carbônico"
                        ],
                        "correct": 1
                },
                {
                        "q": "Em termos de gestão de resíduos, o que caracteriza uma ecocidade?",
                        "options": [
                                "Incineração de todo o lixo sem triagem",
                                "Envio de todo o lixo direto para lixões a céu aberto",
                                "Coleta seletiva abrangente, alta reciclagem e compostagem de orgânicos",
                                "Proibição do uso de lixeiras públicas"
                        ],
                        "correct": 2
                },
                {
                        "q": "O que significa o conceito de resiliência climática urbana em uma cidade verde?",
                        "options": [
                                "A capacidade da cidade de se antecipar, resistir e se recuperar de eventos climáticos extremos",
                                "Manter o ar condicionado ligado o tempo todo",
                                "Evitar qualquer tipo de vegetação nas áreas centrais",
                                "Paralisar todas as obras e atividades econômicas"
                        ],
                        "correct": 0
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

// Atualizar total de Quizzes dinamicamente para a gamificação
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
    const isPerfect = score === quiz.questions.length;

    if (window.gamification) {
        const baseXP = 300;
        const perfectBonus = 500;

        gamification.addXp(baseXP, "(Quiz Finalizado!");
        if (isPerfect) {
            gamification.addXp(perfectBonus, "(GABARITOU! Mestre da Sustentabilidade 🏆)");
        }
        // Marcar este quiz como completo no perfil do usuário
        gamification.markQuizComplete(quizType);

        // 🎉 Confetes de celebração!
        setTimeout(() => {
            if (gamification.launchConfetti) gamification.launchConfetti(isPerfect);
        }, 300);
    }

    progressFill.style.width = "100%";
    questionContainer.style.display = "none";
    introSection.style.display = "none";
    resultContainer.style.display = "block";
    scoreText.innerText = `Você acertou ${score} de ${quiz.questions.length} perguntas!`;

    const gaiaTitle = document.getElementById('gaia-msg-title');
    const gaiaText = document.getElementById('gaia-msg-text');

    if (!isPerfect) {
        // Se errou alguma questão
        gaiaTitle.innerText = "Ficou com dúvidas?";
        gaiaText.innerHTML = "Aprenda mais com a <strong>G.A.I.A.</strong>! Com ela é só perguntar como e onde descartar e você já consegue as suas respostas.";
    } else {
        // Se acertou tudo (Gabaritou)
        gaiaTitle.innerText = "Próximo Passo?";
        gaiaText.innerHTML = "Agora que você aprendeu como descartar, <strong>converse com a G.A.I.A.</strong> para saber qual é o ponto de coleta mais próximo de você!";
    }
}if (nextIntroBtn) {
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
    const isPerfect = score === quiz.questions.length;

    if (window.gamification) {
        const baseXP = 300;
        const perfectBonus = 500;

        gamification.addXp(baseXP, "(Quiz Finalizado!");
        if (isPerfect) {
            gamification.addXp(perfectBonus, "(GABARITOU! Mestre da Sustentabilidade 🏆)");
        }
        // Marcar este quiz como completo no perfil do usuário
        gamification.markQuizComplete(quizType);

        // 🎉 Confetes de celebração!
        setTimeout(() => {
            if (gamification.launchConfetti) gamification.launchConfetti(isPerfect);
        }, 300);
    }

    progressFill.style.width = "100%";
    questionContainer.style.display = "none";
    introSection.style.display = "none";
    resultContainer.style.display = "block";
    scoreText.innerText = `Você acertou ${score} de ${quiz.questions.length} perguntas!`;

    const gaiaTitle = document.getElementById('gaia-msg-title');
    const gaiaText = document.getElementById('gaia-msg-text');

    if (!isPerfect) {
        // Se errou alguma questão
        gaiaTitle.innerText = "Ficou com dúvidas?";
        gaiaText.innerHTML = "Aprenda mais com a <strong>G.A.I.A.</strong>! Com ela é só perguntar como e onde descartar e você já consegue as suas respostas.";
    } else {
        // Se acertou tudo (Gabaritou)
        gaiaTitle.innerText = "Próximo Passo?";
        gaiaText.innerHTML = "Agora que você aprendeu como descartar, <strong>converse com a G.A.I.A.</strong> para saber qual é o ponto de coleta mais próximo de você!";
    }
}if (nextIntroBtn) {
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
    const isPerfect = score === quiz.questions.length;

    if (window.gamification) {
        const baseXP = 300;
        const perfectBonus = 500;

        gamification.addXp(baseXP, "(Quiz Finalizado!");
        if (isPerfect) {
            gamification.addXp(perfectBonus, "(GABARITOU! Mestre da Sustentabilidade 🏆)");
        }
        // Marcar este quiz como completo no perfil do usuário
        gamification.markQuizComplete(quizType);

        // 🎉 Confetes de celebração!
        setTimeout(() => {
            if (gamification.launchConfetti) gamification.launchConfetti(isPerfect);
        }, 300);
    }

    progressFill.style.width = "100%";
    questionContainer.style.display = "none";
    introSection.style.display = "none";
    resultContainer.style.display = "block";
    scoreText.innerText = `Você acertou ${score} de ${quiz.questions.length} perguntas!`;

    const gaiaTitle = document.getElementById('gaia-msg-title');
    const gaiaText = document.getElementById('gaia-msg-text');

    if (!isPerfect) {
        // Se errou alguma questão
        gaiaTitle.innerText = "Ficou com dúvidas?";
        gaiaText.innerHTML = "Aprenda mais com a <strong>G.A.I.A.</strong>! Com ela é só perguntar como e onde descartar e você já consegue as suas respostas.";
    } else {
        // Se acertou tudo (Gabaritou)
        gaiaTitle.innerText = "Próximo Passo?";
        gaiaText.innerHTML = "Agora que você aprendeu como descartar, <strong>converse com a G.A.I.A.</strong> para saber qual é o ponto de coleta mais próximo de você!";
    }
}if (nextIntroBtn) {
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
    const isPerfect = score === quiz.questions.length;

    if (window.gamification) {
        const baseXP = 300;
        const perfectBonus = 500;

        gamification.addXp(baseXP, "(Quiz Finalizado!");
        if (isPerfect) {
            gamification.addXp(perfectBonus, "(GABARITOU! Mestre da Sustentabilidade 🏆)");
        }
        // Marcar este quiz como completo no perfil do usuário
        gamification.markQuizComplete(quizType);

        // 🎉 Confetes de celebração!
        setTimeout(() => {
            if (gamification.launchConfetti) gamification.launchConfetti(isPerfect);
        }, 300);
    }

    progressFill.style.width = "100%";
    questionContainer.style.display = "none";
    introSection.style.display = "none";
    resultContainer.style.display = "block";
    scoreText.innerText = `Você acertou ${score} de ${quiz.questions.length} perguntas!`;

    const gaiaTitle = document.getElementById('gaia-msg-title');
    const gaiaText = document.getElementById('gaia-msg-text');

    if (!isPerfect) {
        // Se errou alguma questão
        gaiaTitle.innerText = "Ficou com dúvidas?";
        gaiaText.innerHTML = "Aprenda mais com a <strong>G.A.I.A.</strong>! Com ela é só perguntar como e onde descartar e você já consegue as suas respostas.";
    } else {
        // Se acertou tudo (Gabaritou)
        gaiaTitle.innerText = "Próximo Passo?";
        gaiaText.innerHTML = "Agora que você aprendeu como descartar, <strong>converse com a G.A.I.A.</strong> para saber qual é o ponto de coleta mais próximo de você!";
    }
}
