document.addEventListener('DOMContentLoaded', () => {
    // Inicializa animações de Scroll
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // --- Glassmorphism Hover Effect ---
    const glassCards = document.querySelectorAll('.info-card, .quiz-card, .cta-card, .craft-card');

    glassCards.forEach(card => {
        card.classList.add('glass-hover');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const before = window.getComputedStyle(card, '::before');
        });
    });

    // Melhorando: Criar elemento de brilho real para seguir o mouse
    glassCards.forEach(card => {
        // Remove a classe CSS pura se formos usar JS para seguir o mouse
        card.classList.remove('glass-hover');
        card.style.position = 'relative';
        card.style.overflow = 'hidden';

        const shine = document.createElement('div');
        shine.classList.add('mouse-shine');
        card.appendChild(shine);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            shine.style.left = `${x}px`;
            shine.style.top = `${y}px`;
            shine.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            shine.style.opacity = '0';
        });

    });    // Base de Dados de Reciclagem Consciente
    const wasteData = [
        // ─── RECICLÁVEIS ───────────────────────────────────────────────────────────
        {
            name: "Caixa de Leite (Tetra Pak)",
            type: "recycle",
            icon: "fas fa-blender",
            info: "100% reciclável — feita de papel, plástico e alumínio em camadas. Pode virar telhas, ripas e material de construção sustentável.",
            tip: "Juntar e levar a cooperativas que fazem telhas de Tetra Pak é uma das melhores formas de dar destino certo a ela.",
            dispose: [
                "Lave bem por dentro com um pouco de água.",
                "Abra a caixa completamente para ficar plana e ocupar menos espaço.",
                "Descarte na lixeira amarela (plástico/metal) ou em pontos de coleta seletiva de Tetra Pak."
            ]
        },
        {
            name: "Garrafa PET",
            type: "recycle",
            icon: "fas fa-bottle-water",
            info: "Plástico que demora até 400 anos para se decompor na natureza. É o plástico mais reciclado do Brasil e pode virar roupas, tapetes e novas garrafas.",
            tip: "Não amasse a tampa junto com a garrafa — separe-as! As tampinhas têm circuito próprio de reciclagem e financiam projetos sociais.",
            dispose: [
                "Esvazie e enxágue com um pouco de água para remover resíduos.",
                "Amasse para reduzir volume e facilitar o transporte.",
                "Descarte na lixeira vermelha (plástico) ou ponto de coleta seletiva."
            ]
        },
        {
            name: "Latas de Alumínio",
            type: "recycle",
            icon: "fas fa-can-food",
            info: "O material mais reciclado do Brasil — reciclar uma lata economiza energia suficiente para manter uma TV ligada por 3 horas. Vale dinheiro nos ferros-velhos.",
            tip: "O Brasil é campeão mundial em reciclagem de latas de alumínio. Leve a cooperativas e ajude trabalhadores da reciclagem.",
            dispose: [
                "Enxágue rapidamente para tirar restos de líquido.",
                "Amasse levemente para ocupar menos espaço.",
                "Descarte na lixeira amarela ou leve a cooperativas de reciclagem."
            ]
        },
        {
            name: "Rolo de Papel Higiênico",
            type: "recycle",
            icon: "fas fa-scroll",
            info: "Papel puro de alta qualidade — totalmente reciclável sem nenhum preparo especial.",
            dispose: [
                "Pode ir direto para a lixeira azul (papel).",
                "Não precisa lavar nem umedecer.",
                "Guarde vários e leve juntos ao ponto de coleta — facilita o transporte."
            ]
        },
        {
            name: "Vidro (Garrafas e Potes)",
            type: "recycle",
            icon: "fas fa-wine-bottle",
            info: "O vidro pode ser reciclado infinitas vezes sem perder qualidade. Uma garrafa de vidro no aterro demora mais de 1 milhão de anos para se decompor.",
            tip: "Vidro colorido (verde, âmbar) e vidro transparente têm mercados diferentes. Separá-los facilita o processo industrial.",
            dispose: [
                "Esvazie e enxágue o recipiente.",
                "Remova tampas de metal ou plástico — reciclam separado.",
                "Descarte na lixeira verde (vidro) ou ponto de coleta. NUNCA quebre o vidro antes — fragmentos machucam coletores."
            ]
        },
        {
            name: "Papelão",
            type: "recycle",
            icon: "fas fa-boxes-stacked",
            info: "Altamente reciclável e com mercado consolidado nas cooperativas. Cada tonelada de papelão reciclado poupa 2,5 árvores.",
            tip: "Papelão molhado perde qualidade para reciclagem, mas pode ser compostado. Sempre prefira entregar seco.",
            dispose: [
                "Desmonte as caixas para economizar espaço.",
                "Remova fitas adesivas e grampos metálicos, se possível.",
                "Descarte na lixeira azul (papel/papelão) ou leve a cooperativas — costumam comprar papelão por peso."
            ]
        },
        {
            name: "Tampinhas Plásticas",
            type: "recycle",
            icon: "fas fa-capsules",
            info: "Plástico tipo PP ou PEAD — valorizado e aceito por cooperativas. Muitas ONGs recolhem tampinhas para financiar cadeiras de rodas e tratamentos médicos.",
            tip: "Pesquise no seu bairro se existe campanha de arrecadação de tampinhas — é uma forma de aliar reciclagem a causas sociais.",
            dispose: [
                "Não precisam ser lavadas.",
                "Junte em quantidade e guarde em saco separado.",
                "Leve a cooperativas de reciclagem, escolas, igrejas ou projetos sociais que coletam tampinhas."
            ]
        },
        {
            name: "Roupas e Tecidos",
            type: "recycle",
            icon: "fas fa-shirt",
            info: "A indústria têxtil é a 2ª mais poluente do mundo. Uma peça de roupa produzida e descartada em semanas gera toneladas de carbono.",
            tip: "Tecido rasgado vira pano de limpeza. Corte em quadrados de 30cm e substitua o papel toalha — economiza dinheiro e plástico.",
            dispose: [
                "Se em bom estado: doe para Cáritas, AVAPE, brechós sociais ou pontos de doação de shoppings.",
                "Se rasgadas ou manchadas: corte em panos de limpeza ou retalhos para artesanato.",
                "Procure caixas de coleta têxtil em shoppings (H&M, C&A têm programas de reciclagem)."
            ]
        },
        {
            name: "Papel de Presente",
            type: "recycle",
            icon: "fas fa-gift",
            info: "Papel simples é reciclável, mas papéis metalizados, brilhantes, com glitter ou laminados NÃO são aceitos pela reciclagem.",
            tip: "Substitua papéis de presente por jornais, revistas velhas ou tecidos — fica mais criativo e gera zero resíduo extra.",
            dispose: [
                "Teste amassando: se não voltou ao formato, é metalizado e vai para o lixo comum.",
                "Se for papel simples: descarte na lixeira azul (papel).",
                "Sacos de presente de tecido (furoshiki): reutilize quantas vezes quiser!"
            ]
        },
        {
            name: "Rolhas de Cortiça",
            type: "recycle",
            icon: "fas fa-wine-glass",
            info: "Cortiça é um material natural renovável, extraído da casca do sobreiro sem matar a árvore, e 100% reciclável.",
            dispose: [
                "Deixe secar completamente antes de guardar.",
                "Leve a adegas, restaurantes ou supermercados com coletores específicos para cortiça.",
                "No Brasil, a Apcor coordena pontos de coleta de rolhas em diversas cidades."
            ]
        },
        {
            name: "Óculos Antigos",
            type: "recycle",
            icon: "fas fa-glasses",
            info: "Compostos de metal, plástico e vidro óptico — materiais de alto valor. Óculos em bom estado podem ser reutilizados por quem precisa.",
            dispose: [
                "Se em boas condições, doe em óticas participantes do programa 'Ver o Brasil' — chegam a populações carentes.",
                "Se quebrados, separe a armação da lente e leve a óticas para descarte correto.",
                "Não jogue na lixeira comum — os materiais têm destinação específica."
            ]
        },
        {
            name: "Papel de Jornal e Revistas",
            type: "recycle",
            icon: "fas fa-newspaper",
            info: "Papel de boa qualidade e amplamente aceito por cooperativas. Revistas com papel couché (brilhante) também são recicláveis.",
            tip: "Papel de jornal amassado é excelente para limpar vidros e espelhos sem deixar resíduos — substitui os panos de limpeza!",
            dispose: [
                "Não precisa de nenhum preparo especial — apenas guardar seco.",
                "Junte em quantidade e leve à lixeira azul ou a cooperativas.",
                "Revistas: remova capas plásticas (se houver) antes de descartar."
            ]
        },
        {
            name: "Latas de Conserva (Aço)",
            type: "recycle",
            icon: "fas fa-utensils",
            info: "Aço reciclável que pode ser fundido e reutilizado infinitas vezes com gasto energético bem menor que o aço virgem.",
            tip: "Latas de conserva limpas são ótimos vasinhos, porta-lápis ou organizadores — reutilize antes de reciclar!",
            dispose: [
                "Esvazie completamente e enxágue com água.",
                "Cuidado com a tampa — use abridor de lata que dobre a borda para dentro, evitando cortes.",
                "Descarte na lixeira amarela (metal) ou leve a cooperativas de reciclagem."
            ]
        },
        {
            name: "Potes de Iogurte e Margarina",
            type: "recycle",
            icon: "fas fa-cup-straw",
            info: "Plástico rígido tipo PP (5) — reciclável na maioria das cidades brasileiras. São leves e fáceis de processar.",
            tip: "Potes de iogurte limpos fazem ótimos vasinhos para mudas — reutilize antes de reciclar!",
            dispose: [
                "Lave bem para remover completamente os restos de alimento.",
                "Retire a tampa de alumínio — recicla separado na lixeira amarela.",
                "Descarte o pote na lixeira vermelha (plástico)."
            ]
        },
        // ─── COMPOSTÁVEIS ──────────────────────────────────────────────────────────
        {
            name: "Cascas de Alimentos",
            type: "compost",
            icon: "fas fa-apple-whole",
            info: "Matéria orgânica rica em nutrientes — no aterro vira metano (gás de efeito estufa), na composteira vira adubo fértil.",
            tip: "Uma composteira doméstica simples cabe em apartamento, não tem cheiro e gera húmus puro em 60 dias.",
            dispose: [
                "Separe das embalagens e plásticos antes de guardar.",
                "Coloque em composteira doméstica ou entregue em pontos de compostagem comunitária.",
                "Pode ser enterrada diretamente no jardim ou vaso como adubo natural."
            ]
        },
        {
            name: "Borra e Filtro de Café",
            type: "compost",
            icon: "fas fa-mug-hot",
            info: "A borra de café é rica em nitrogênio e funciona como fertilizante e repelente natural de insetos no jardim.",
            tip: "Polvilhe borra de café ao redor das plantas — afasta lesmas, formigas e nutre o solo ao mesmo tempo.",
            dispose: [
                "A borra pode ir direto para a composteira ou ser enterrada em vasos.",
                "O filtro de papel pode acompanhar a borra na composteira — é biodegradável.",
                "Alternativamente, descarte o papel na lixeira azul e a borra no jardim."
            ]
        },
        {
            name: "Papelão de Pizza",
            type: "compost",
            icon: "fas fa-pizza-slice",
            info: "A gordura contamina o papel e impede sua reciclagem — mas a parte limpa ainda é 100% aproveitável.",
            dispose: [
                "Separe a tampa (geralmente limpa) da base (com gordura e queijo).",
                "A tampa limpa vai para a lixeira azul (papel).",
                "A base suja: rasgue em pedaços pequenos e coloque na composteira — a gordura decompõe bem no composto."
            ]
        },
        {
            name: "Bagaço de Frutas e Legumes",
            type: "compost",
            icon: "fas fa-seedling",
            info: "Resíduo orgânico rico em fibras, vitaminas e minerais que o solo precisa para ser fértil.",
            dispose: [
                "Coloque diretamente na composteira doméstica.",
                "Pode ser enterrado a 10–15cm de profundidade no jardim como adubo natural.",
                "Misture com folhas secas na composteira para equilibrar umidade e nitrogênio."
            ]
        },
        {
            name: "Palitos de Madeira",
            type: "compost",
            icon: "fas fa-lines-leaning",
            info: "Madeira natural de reflorestamento — biodegradável e rica em carbono, equilibrando composteiras úmidas.",
            dispose: [
                "Podem ir para a composteira — ajudam na aeração e absorvem excesso de umidade.",
                "Podem ser enterrados no jardim.",
                "Em grandes quantidades, leve a cooperativas de reciclagem de madeira."
            ]
        },
        {
            name: "Cabelo Humano",
            type: "compost",
            icon: "fas fa-cut",
            info: "Riquíssimo em nitrogênio e queratina — decompõe-se naturalmente no solo em meses e nutre as plantas.",
            tip: "Cabelos usados em compostagem ou jardins funcionam também como repelente de animais que escavam vasos.",
            dispose: [
                "Não precisa de coleta especial.",
                "Enterre diretamente em vasos ou jardins para fertilizar o solo.",
                "Pode ir para a composteira doméstica — misture com material seco."
            ]
        },
        // ─── DESCARTE ESPECIAL ─────────────────────────────────────────────────────
        {
            name: "Lâmpadas Fluorescentes",
            type: "special",
            icon: "fas fa-lightbulb",
            info: "⚠️ RISCO GRAVE: Contêm vapor de mercúrio — metal pesado altamente tóxico ao sistema nervoso. Uma única lâmpada quebrada pode contaminar até 30.000 litros de água subterrânea se descartada incorretamente.",
            tip: "Prefira sempre lâmpadas LED — não contêm mercúrio, duram 5x mais e consomem 80% menos energia que as fluorescentes.",
            dispose: [
                "🚫 NUNCA jogue no lixo comum, quebre intencionalmente ou descarte no chão.",
                "Transporte com MUITO cuidado dentro da embalagem original ou enrolada em jornal grosso.",
                "Entregue INTACTA em lojas de material de construção (Leroy Merlin, Telha Norte), supermercados ou pontos de coleta da prefeitura — são obrigados por lei (Res. CONAMA 401/2008) a receber.",
                "🧹 SE A LÂMPADA QUEBRAR — Procedimento de Segurança:",
                "① Saia do ambiente IMEDIATAMENTE e ventile abrindo janelas e portas por pelo menos 15 minutos.",
                "② NÃO use aspirador de pó — ele dispersa o mercúrio pelo ar. NÃO varra com vassoura seca — espalhará os fragmentos.",
                "③ Use luvas de borracha ou descartáveis. Umedeça um pano ou papel-toalha e recolha os fragmentos maiores com cuidado.",
                "④ Use fita adesiva para recolher os cacos menores e o pó fino de fósforo.",
                "⑤ Coloque TUDO (panos usados, fragmentos, fita) em um saco plástico DUPLO, feche bem e identifique 'LÂMPADA QUEBRADA — MERCÚRIO'.",
                "⑥ Descarte o saco em ponto de coleta específico para resíduos perigosos da prefeitura — nunca no lixo comum."
            ]
        },
        {
            name: "Lâmpadas de LED",
            type: "special",
            icon: "fas fa-bolt",
            info: "Não contêm mercúrio, mas possuem componentes eletrônicos (chumbo, arsênio, índio) que exigem descarte correto. São a opção mais sustentável de iluminação disponível hoje.",
            tip: "Ao comprar LEDs novos, muitas lojas aceitam a devolução das antigas — pergunte sempre no momento da compra.",
            dispose: [
                "Não vão para o lixo comum — contêm metais de reciclagem específica.",
                "Leve a lojas de material elétrico, supermercados ou pontos de coleta de e-lixo da prefeitura.",
                "Diferente das fluorescentes, se quebrar NÃO há risco de mercúrio — recolha com luvas e descarte em ponto de e-lixo."
            ]
        },
        {
            name: "Pilhas e Baterias",
            type: "special",
            icon: "fas fa-battery-half",
            info: "⚠️ RISCO GRAVE: Contêm chumbo, cádmio, lítio e mercúrio — metais pesados que contaminam o solo e a água por décadas e causam doenças graves.",
            tip: "Prefira pilhas recarregáveis — uma pilha recarregável substitui até 1.000 pilhas descartáveis, gerando muito menos resíduo.",
            dispose: [
                "NUNCA jogue no lixo comum ou enterre no solo.",
                "Guarde em saco plástico seco e separado até acumular quantidade para descarte.",
                "Leve a totens de coleta em supermercados, farmácias ou lojas de eletrônicos — são obrigados por lei (Res. CONAMA 401) a receber gratuitamente.",
                "Baterias de celular/notebook: leve às assistências técnicas ou lojas das marcas."
            ]
        },
        {
            name: "Óleo de Cozinha Usado",
            type: "special",
            icon: "fas fa-oil-can",
            info: "⚠️ IMPACTO ENORME: 1 litro de óleo lançado em bueiro ou ralo pode contaminar até 1 milhão de litros de água potável e entupir toda a rede de esgoto do bairro.",
            tip: "O óleo coletado vira biodiesel e sabão ecológico — pergunte a cooperativas próximas se produzem sabão com óleo reciclado.",
            dispose: [
                "Espere o óleo esfriar completamente antes de manusear.",
                "Armazene em garrafas PET com tampa, sem misturar com água.",
                "Leve a postos de coleta: supermercados, escolas, postos de gasolina e restaurantes participantes. Use o app 'Onde Descartar' para encontrar o ponto mais próximo.",
                "NUNCA descarte no ralo, vaso sanitário, lixo comum ou chão."
            ]
        },
        {
            name: "Medicamentos Vencidos",
            type: "special",
            icon: "fas fa-pills",
            info: "⚠️ RISCO QUÍMICO E BIOLÓGICO: Medicamentos vencidos jogados na água ou no solo liberam substâncias que afetam hormônios de animais aquáticos e contaminam o lençol freático.",
            tip: "Pesquise o programa PBEX (Programa Brasileiro de Excelência em Farmácias) — farmácias participantes coletam gratuitamente.",
            dispose: [
                "NUNCA jogue no lixo comum, ralo ou vaso sanitário.",
                "Mantenha os medicamentos nas embalagens originais com a bula quando possível.",
                "Leve a farmácias participantes do programa PBEX ou postos de saúde — o descarte é gratuito e obrigatório por lei."
            ]
        },
        {
            name: "Pneus Velhos",
            type: "special",
            icon: "fas fa-circle-dot",
            info: "⚠️ PROIBIÇÃO LEGAL: É crime ambiental descartar pneus em terrenos baldios ou lixo comum. Pneus acumulam água e são o principal criadouro do mosquito da dengue.",
            tip: "Pneus reciclados viram: borracha de playground, asfalto emborrachado, solados de sapatos e até jardins verticais criativos.",
            dispose: [
                "Leve a borracharias ou pontos de coleta da prefeitura — são obrigados a receber.",
                "Distribuidores de pneus novos devem aceitar os velhos de volta (logística reversa obrigatória pelo CONAMA 416/2009).",
                "Não deixe em terrenos baldios — além de crime, atrai vetores de doenças."
            ]
        },
        {
            name: "Embalagens de Aerossol (Spray)",
            type: "special",
            icon: "fas fa-spray-can",
            info: "⚠️ RISCO DE EXPLOSÃO: Embalagens de spray (desodorantes, tintas, inseticidas) são pressurizadas e podem explodir se perfuradas ou jogadas em caminhões compactadores de lixo.",
            tip: "Sprays de tinta e inseticida têm resíduos tóxicos — são mais perigosos que desodorantes. Prefira versões roll-on ou pastilhas.",
            dispose: [
                "NUNCA perfure, amasse ou coloque no fogo — pode explodir com violência.",
                "Use até o fim antes de descartar — embalagem completamente vazia é mais segura.",
                "Leve a postos de coleta de resíduos perigosos ou Pontos de Entrega Voluntária (PEV) da prefeitura.",
                "Embalagens de inseticida e tinta: verifique se há coleta específica de resíduos perigosos domésticos."
            ]
        },
        {
            name: "Tintas e Solventes",
            type: "special",
            icon: "fas fa-paint-roller",
            info: "⚠️ RESÍDUO PERIGOSO: Tintas, vernizes, thinner e solventes são inflamáveis e altamente tóxicos ao solo e à água. São classificados como Resíduo Classe I pela ABNT.",
            tip: "Calcule sempre a quantidade exata antes de comprar tinta — sobra de tinta é o maior problema de descarte nessa categoria.",
            dispose: [
                "NUNCA jogue no ralo, lixo comum, terreno baldio ou córrego.",
                "Deixe o recipiente aberto em local ventilado para a tinta secar completamente antes de descartar — latas secas vão para a lixeira amarela.",
                "Sobras líquidas: leve a postos de coleta de resíduos perigosos domésticos (RPDD) da prefeitura.",
                "Lojas de tintas como Suvinil e Coral têm programas de logística reversa — pergunte no ponto de venda."
            ]
        },
        {
            name: "Teclados, Mouses e Eletrônicos",
            type: "special",
            icon: "fas fa-keyboard",
            info: "Lixo eletrônico (e-lixo) contém metais pesados (chumbo, mercúrio, cádmio) e também metais preciosos (ouro, prata, cobre) que podem ser recuperados. O Brasil é o 6º maior gerador de e-lixo do mundo.",
            tip: "Cada aparelho eletrônico recuperado evita que metais preciosos e tóxicos sejam enterrados juntos em aterros.",
            dispose: [
                "Se ainda funcionar, doe ou venda em plataformas como OLX, Facebook Marketplace ou para instituições de ensino.",
                "Se quebrado, leve a pontos de coleta de e-lixo da prefeitura ou de fabricantes.",
                "Lojas de informática, operadoras de celular e grandes varejistas costumam ter caixas de coleta de e-lixo."
            ]
        },
        {
            name: "Radiografias (Raio-X)",
            type: "special",
            icon: "fas fa-x-ray",
            info: "O filme de raio-X contém prata — metal pesado de alto valor econômico que pode ser recuperado industrialmente.",
            dispose: [
                "Leve a hospitais, clínicas de imagem ou centros de saúde — possuem contratos com empresas de recuperação de prata.",
                "Não jogue no lixo comum — é crime ambiental (Lei 12.305/2010).",
                "Algumas cooperativas de metais também aceitam radiografias velhas."
            ]
        },
        {
            name: "Cápsulas de Café",
            type: "special",
            icon: "fas fa-circle",
            info: "Mistura de alumínio ou plástico com resíduo orgânico — não é aceita na reciclagem convencional. Pode levar até 500 anos para se decompor.",
            tip: "Considere migrar para cafeteiras de coador, prensa francesa ou máquinas com cápsulas reutilizáveis — eliminam o resíduo completamente.",
            dispose: [
                "Abra a cápsula e retire o pó de café — vai para composteira ou jardim.",
                "Lave bem a embalagem vazia.",
                "Leve aos pontos de coleta das marcas: Nespresso, Nescafé, Dolce Gusto — a logística reversa é obrigatória por lei."
            ]
        },
        {
            name: "Esponja de Cozinha",
            type: "special",
            icon: "fas fa-soap",
            info: "Feita de poliuretano (espuma) e fibra sintética — difícil de reciclar e demora décadas para se decompor. Acumula bactérias rapidamente.",
            tip: "Substitua por escova de madeira + cerdas naturais ou por bucha vegetal — biodegradáveis e muito mais higiênicas.",
            dispose: [
                "Quando velha, use para limpar áreas externas ou ralos antes de descartar.",
                "Pesquise o programa TerraCycle — aceita esponjas usadas para reciclagem especializada.",
                "Na falta de coleta específica, vai para o lixo comum (resíduo não reciclável)."
            ]
        },
        {
            name: "Isopor (EPS)",
            type: "special",
            icon: "fas fa-cubes",
            info: "É um tipo de plástico (número 6). Leve como ar mas ocupa enorme volume em aterros e leva mais de 500 anos para se decompor.",
            tip: "Isopor limpo de caixas de peixe ou eletrodomésticos tem bom aproveitamento nas cooperativas — leve em bom estado.",
            dispose: [
                "Limpe bem — restos de comida ou gordura impedem totalmente a reciclagem.",
                "Leve a pontos de coleta específicos para EPS — cooperativas e recicladoras especializadas aceitam.",
                "Se não houver coleta na sua cidade, vai infelizmente para o lixo comum."
            ]
        },
        {
            name: "Bitucas de Cigarro",
            type: "special",
            icon: "fas fa-smoking",
            info: "⚠️ ALTAMENTE TÓXICA: Cada bituca contamina até 40 litros de água. O filtro é feito de acetato de celulose — plástico que não se decompõe — e carrega mais de 60 substâncias cancerígenas.",
            tip: "A empresa Bibituca coleta bitucas em São Paulo e as transforma em papel e plástico reciclado. Pesquise iniciativas similares na sua cidade.",
            dispose: [
                "NUNCA jogue no chão, calçada, ralo ou vaso sanitário.",
                "Apague completamente em cinzeiro antes de qualquer descarte.",
                "Descarte no lixo comum em saquinho fechado — é a única opção disponível na maioria das cidades por enquanto."
            ]
        },
        {
            name: "Vidro Quebrado",
            type: "special",
            icon: "fas fa-burst",
            info: "Reciclável tecnicamente, mas extremamente perigoso para coletores e animais se descartado sem proteção adequada.",
            dispose: [
                "Coloque papel jornal dobrado ou pano grosso sobre os cacos ANTES de tocar.",
                "Use luvas grossas ou pegue com pinça — nunca com as mãos desprotegidas.",
                "Coloque os fragmentos dentro de uma caixa de papelão resistente ou garrafa PET e lacre com fita adesiva.",
                "Escreva 'VIDRO QUEBRADO — CUIDADO' claramente por fora com caneta permanente.",
                "Descarte na lixeira verde (vidro) ou em ponto de coleta específico."
            ]
        },
        {
            name: "Objetos Cortantes (Facas, Agulhas, Lâminas)",
            type: "special",
            icon: "fas fa-scissors",
            info: "⚠️ RISCO DE ACIDENTE GRAVE: Agulhas, lâminas e cacos causam ferimentos graves a trabalhadores da coleta e animais que vasculham o lixo.",
            dispose: [
                "NUNCA descarte soltos diretamente na lixeira — é irresponsável e perigoso.",
                "Agulhas e seringas: use descartadores rígidos (caixas amarelas) disponíveis em farmácias e postos de saúde.",
                "Facas e lâminas: embrulhe em várias camadas de papelão grosso e prenda firmemente com fita.",
                "Escreva 'OBJETO CORTANTE — CUIDADO' bem visível por fora.",
                "Coloque em caixa rígida antes de colocar no lixo especial ou ponto de coleta."
            ]
        },
        {
            name: "Móveis e Objetos Volumosos",
            type: "special",
            icon: "fas fa-chair",
            info: "Ocupam enorme volume em aterros sanitários e levam décadas para se decompor. O descarte ilegal em terrenos baldios é multado em muitas cidades.",
            tip: "Um móvel velho e feio vira um projeto de reforma criativo. Lixar, pintar e trocar puxadores pode dar nova vida a peças por menos de R$30.",
            dispose: [
                "Tente restaurar antes de descartar — pintura, lixa e verniz fazem milagres.",
                "Doe em bom estado para Cáritas, institutos sociais ou pelo OLX/Facebook Marketplace.",
                "Para descarte definitivo: ligue para a prefeitura. A coleta de entulho e móveis volumosos é gratuita na maioria das cidades.",
                "NUNCA deixe na calçada sem autorização — é infração ambiental."
            ]
        },
        {
            name: "Escova de Dentes",
            type: "special",
            icon: "fas fa-tooth",
            info: "Mistura de plásticos diferentes (PP, nylon) que não podem ser separados mecanicamente — não vai para a reciclagem comum. 4,7 bilhões de escovas são descartadas por ano no mundo.",
            tip: "Escovas de bambu com cerdas de nylon biodegradável são a alternativa mais sustentável disponível atualmente no Brasil.",
            dispose: [
                "Pesquise o programa TerraCycle para escovas de dentes — coleta e recicla de forma especializada.",
                "Antes de descartar, reutilize para limpar detalhes difíceis (cantos do banheiro, trilhos de janela).",
                "Na falta de coleta específica, vai para o lixo comum."
            ]
        },
        {
            name: "CDs e DVDs Antigos",
            type: "special",
            icon: "fas fa-compact-disc",
            info: "Material plástico e metálico complexo (policarbonato + alumínio) — não vai para reciclagem comum. Demoram centenas de anos para se decompor.",
            tip: "CDs velhos são espelhos e refletores perfeitos — artistas usam para criar mosaicos, espantalhos e decorações únicas.",
            dispose: [
                "Leve a pontos de coleta de e-lixo da prefeitura.",
                "Algumas lojas de informática e associações aceitam para descarte correto.",
                "NUNCA jogue no lixo comum — o policarbonato libera compostos tóxicos no aterro."
            ]
        },
        {
            name: "Embalagens Flexíveis (Sachês, Refis)",
            type: "special",
            icon: "fas fa-tube",
            info: "Embalagens multicamadas (plástico + alumínio + plástico) — não são aceitas na reciclagem convencional e são um dos maiores desafios do setor.",
            tip: "Pressione marcas a assumirem responsabilidade pelo fim de vida dos seus produtos — a logística reversa é obrigatória por lei.",
            dispose: [
                "Infelizmente, a maioria vai para o lixo comum no Brasil — não há infraestrutura generalizada.",
                "Procure iniciativas como o TerraCycle ou programas de marcas (Heinz, Unilever) que coletam embalagens flexíveis.",
                "Prefira comprar versões em embalagens recicláveis (vidro, plástico rígido) quando possível."
            ]
        },
    ];



    const searchInput = document.getElementById('waste-search');
    const resultsGrid = document.getElementById('search-results');

    function displayResults(filter = "") {
        resultsGrid.innerHTML = "";
        const filtered = wasteData.filter(item =>
            item.name.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            resultsGrid.innerHTML = `
                <div class="empty-result">
                    <i class="fas fa-search"></i>
                    <p>Não encontramos guias para "${filter}". Que tal tentar outro termo?</p>
                </div>`;
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card-big';
            if (item.type === 'special') card.classList.add('result-card-special');

            const disposeSteps = item.dispose.map(s => `<li>${s}</li>`).join('');
            const tipHtml = item.tip
                ? `<div class="guide-box-big guide-box-tip" style="margin-top:12px; background: rgba(16,185,129,0.08); border-left: 3px solid #10b981;"><h5><i class="fas fa-lightbulb" style="color:#10b981;"></i> Dica Extra:</h5><p class="result-guide-text">${item.tip}</p></div>`
                : '';
            const typeLabel = item.type === 'compost' ? '🌱 Compostagem' : item.type === 'recycle' ? '♻️ Reciclável' : '⚠️ Descarte Especial';

            card.innerHTML = `
                <div class="result-visual-side">
                    <i class="${item.icon}"></i>
                    <h3>${item.name}</h3>
                    <span class="status-label type-${item.type}">${typeLabel}</span>
                </div>
                <div class="result-content-side">
                    <p class="result-info-text"><strong>O que é:</strong> ${item.info}</p>
                    <div class="guide-box-big">
                        <h5><i class="fas fa-recycle"></i> Como descartar corretamente:</h5>
                        <ul style="margin: 8px 0 0 4px; line-height: 1.9; list-style: none; padding: 0;">${disposeSteps}</ul>
                    </div>
                    ${tipHtml}
                </div>
            `;
            resultsGrid.appendChild(card);
        });
    }




    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            displayResults(e.target.value);
        });
    }

    // Smooth Scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Offset para compensar a navbar fixa
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efeito de mudança na navbar ao rolar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = darkModeToggle?.querySelector('i');

    // Carregar preferência salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (darkModeIcon) {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        }
    }

    darkModeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
        }

        // Atualiza a ativação do tema futurista (G.A.I.A. Core apenas no modo escuro)
        if (typeof applyTheme === 'function') {
            applyTheme();
        }
        if (typeof updateAmbience === 'function') {
            updateAmbience();
        }
    });

    // --- Filtros da Oficina de Artesanato ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const craftCards = document.querySelectorAll('.craft-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            craftCards.forEach(card => {
                const category = card.getAttribute('data-category');

                const categories = category ? category.split(' ') : [];
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // --- Registro do Service Worker (PWA) ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker registrado!', reg))
                .catch(err => console.log('Erro ao registrar Service Worker', err));
        });
    }

});

// --- G.A.I.A. Core: Matrix/Bits Animation for Heroes ---
function initFutureHeroEffects() {
    const heroes = document.querySelectorAll('.minigames-hero, .hero-mini');
    
    heroes.forEach(hero => {
        if (!document.body.classList.contains('theme-future')) return;

        setInterval(() => {
            if (!document.body.classList.contains('theme-future')) return;
            
            const bit = document.createElement('div');
            bit.innerText = Math.round(Math.random());
            bit.className = 'eco-data-bit matrix-style';
            bit.style.left = Math.random() * 100 + '%';
            bit.style.fontSize = (Math.random() * 1.5 + 0.5) + 'rem';
            bit.style.opacity = Math.random() * 0.5 + 0.2;
            bit.style.animationDuration = (Math.random() * 3 + 2) + 's';

            hero.appendChild(bit);
            setTimeout(() => bit.remove(), 5000);
        }, 300);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initFutureHeroEffects, 1000);
});

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        // Reservado para outros efeitos se necessário
    });
    initRandomQuotes();
});

// --- Frases Inspiradoras Rotativas (Parallax Banner) ---
function initRandomQuotes() {
    const quoteElement = document.getElementById('parallax-quote');
    if (!quoteElement) return;

    const quotes = [
        '"A natureza não faz nada em vão." – Aristóteles',
        '"A Terra fornece o suficiente para satisfazer as necessidades de todos, mas não a ganância." – Mahatma Gandhi',
        '"Não herdamos a Terra dos nossos antepassados, pedimo-la emprestada aos nossos filhos." – Provérbio Indígena',
        '"O que fazemos à natureza, fazemos a nós mesmos." – David Suzuki',
        '"Pequenas ações multiplicadas por milhões de pessoas podem transformar o mundo." – Howard Zinn',
        '"A menos que alguém como você se importe muito, nada vai melhorar. Não vai mesmo." – O Lorax (Dr. Seuss)',
        '"Só quando a última árvore for derrubada e o último rio poluído, o homem perceberá que não pode comer dinheiro." – Provérbio Cree',
        '"Reciclar não é apenas separar o lixo, é dar uma nova chance ao nosso futuro." – Aprende Mais',
        '"A maior ameaça ao nosso planeta é a crença de que outra pessoa irá salvá-lo." – Robert Swan',
        '"Preservar a natureza é a única forma de garantir o amanhã." – Jacques Cousteau'
    ];

    let currentIndex = Math.floor(Math.random() * quotes.length);
    quoteElement.innerText = quotes[currentIndex];
    quoteElement.title = "Clique para alternar a frase!";

    function changeQuote() {
        quoteElement.classList.add('fade-out');

        setTimeout(() => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * quotes.length);
            } while (nextIndex === currentIndex && quotes.length > 1);

            currentIndex = nextIndex;
            quoteElement.innerText = quotes[currentIndex];
            quoteElement.classList.remove('fade-out');
        }, 500);
    }

    // Alternar automaticamente a cada 8 segundos
    let quoteInterval = setInterval(changeQuote, 8000);

    // Alternar também ao clicar na frase!
    quoteElement.addEventListener('click', () => {
        clearInterval(quoteInterval);
        changeQuote();
        quoteInterval = setInterval(changeQuote, 8000);
    });
}

// --- Quiz Header Topic Filters ---
function initQuizHeaderFilters() {
    const filterBtns = document.querySelectorAll('.quiz-filter-btn');
    const quizCards = document.querySelectorAll('.quiz-grid .quiz-card');

    if (!filterBtns.length || !quizCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            quizCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const categories = category ? category.split(' ') : [];
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initQuizHeaderFilters();
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
});


// --- Ideas 2, 3, 4 Implementation ---

// Idea 2: Reading Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    if (isNaN(scrolled)) scrolled = 0;
    const readingProgressBar = document.getElementById('readingProgressBar');
    if (readingProgressBar) {
        readingProgressBar.style.width = scrolled + "%";
    }
});

// Idea 4: Smart Navbar (Hide on scroll down)
let smartNavLastScroll = 0;
const smartNavbar = document.getElementById('mainNavbar');
window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > smartNavLastScroll && scrollTop > 100) {
        // Scroll Down
        if (smartNavbar && !document.getElementById('navLinks').classList.contains('open')) {
            smartNavbar.style.transform = 'translateY(calc(-100% + 3px))';
        }
    } else {
        // Scroll Up
        if (smartNavbar) {
            smartNavbar.style.transform = 'translateY(0)';
        }
    }
    smartNavLastScroll = scrollTop;
}, { passive: true });
