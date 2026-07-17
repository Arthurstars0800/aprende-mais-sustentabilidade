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
        {
            name: "Caixa de Leite",
            type: "recycle",
            icon: "fas fa-blender",
            info: "100% reciclável — feita de papel, plástico e alumínio em camadas.",
            dispose: ["Lave bem por dentro com água.", "Abra a caixa deixando-a plana para ocupar menos espaço.", "Descarte na lixeira amarela (plástico/metal) ou em pontos de coleta seletiva."]
        },
        {
            name: "Cabelo Humano",
            type: "compost",
            icon: "fas fa-cut",
            info: "Riquíssimo em nitrogênio — decompõe-se naturalmente no solo.",
            dispose: ["Não precisa de coleta especial.", "Enterre diretamente em vasos ou jardins para fertilizar.", "Pode ir para a composteira doméstica."]
        },
        {
            name: "Pneu Velho",
            type: "special",
            icon: "fas fa-circle-dot",
            info: "Proibido por lei descartar em lixo comum — gera criadouro do mosquito da dengue.",
            dispose: ["Leve a borracharias ou pontos de coleta da prefeitura.", "Muitos distribuidores de pneus novos aceitam os velhos de volta (logística reversa obrigatória por lei)."]
        },
        {
            name: "Rolo de Papel Higiênico",
            type: "recycle",
            icon: "fas fa-scroll",
            info: "Papel puro de alta qualidade — totalmente reciclável.",
            dispose: ["Pode ir direto para a lixeira azul (papel).", "Não precisa lavar."]
        },
        {
            name: "Bagaço de Uva",
            type: "compost",
            icon: "fas fa-seedling",
            info: "Resíduo orgânico rico em nutrientes e fibras.",
            dispose: ["Coloque diretamente na composteira doméstica.", "Pode ser enterrado no jardim como adubo natural."]
        },
        {
            name: "Garrafa PET",
            type: "recycle",
            icon: "fas fa-bottle-water",
            info: "Plástico que demora até 400 anos para se decompor na natureza.",
            dispose: ["Esvazie e enxágue com um pouco de água.", "Amasse para reduzir volume.", "Descarte na lixeira vermelha (plástico) ou ponto de coleta seletiva."]
        },
        {
            name: "Latas de Alumínio",
            type: "recycle",
            icon: "fas fa-can-food",
            info: "O material mais reciclado do Brasil — vale dinheiro nos ferros-velhos.",
            dispose: ["Enxágue rapidamente.", "Amasse para ocupar menos espaço.", "Descarte na lixeira amarela ou leve a cooperativas de reciclagem."]
        },
        {
            name: "CDs/DVDs Antigos",
            type: "special",
            icon: "fas fa-compact-disc",
            info: "Material plástico e metálico complexo — não vai para reciclagem comum.",
            dispose: ["Leve a pontos de coleta de e-lixo da prefeitura.", "Algumas lojas de informática aceitam para descarte correto.", "Nunca jogue no lixo comum."]
        },
        {
            name: "Óleo de Cozinha",
            type: "special",
            icon: "fas fa-oil-can",
            info: "1 litro de óleo contamina até 1 milhão de litros de água se jogado no ralo.",
            dispose: ["Espere o óleo esfriar completamente.", "Armazene em garrafas PET com tampa.", "Leve a postos de coleta (supermercados, escolas, postos de gasolina). Use o app 'Onde Descartar' para encontrar o ponto mais próximo."]
        },
        {
            name: "Pilhas e Baterias",
            type: "special",
            icon: "fas fa-battery-half",
            info: "Contêm chumbo, cádmio e mercúrio — altamente tóxicos ao solo e à água.",
            dispose: ["Nunca jogue no lixo comum.", "Guarde em um saco plástico separado.", "Leve a totens de descarte em supermercados, farmácias ou lojas de eletrônicos — são obrigados por lei a receber."]
        },
        {
            name: "Vidro Quebrado",
            type: "recycle",
            icon: "fas fa-burst",
            info: "Reciclável, mas perigoso para coletores e animais.",
            dispose: ["Jogue papel jornal ou pano úmido sobre os cacos antes de pegar.", "Coloque os fragmentos dentro de uma caixa de papelão resistente ou garrafa PET e lacre com fita.", "Escreva 'VIDRO QUEBRADO' por fora com caneta.", "Descarte na lixeira verde (vidro) ou em ponto de coleta específico."]
        },
        {
            name: "Isopor (EPS)",
            type: "recycle",
            icon: "fas fa-box-open",
            info: "É um tipo de plástico (número 6) — decompõe em mais de 500 anos.",
            dispose: ["Limpe bem — restos de comida impedem a reciclagem.", "Leve a pontos de coleta específicos para EPS (cooperativas aceitam).", "Se não houver coleta, vai para o lixo comum infelizmente."]
        },
        {
            name: "Cascas de Alimentos",
            type: "compost",
            icon: "fas fa-apple-whole",
            info: "Matéria orgânica rica — no aterro vira metano, na composteira vira adubo.",
            dispose: ["Separe das embalagens e plásticos.", "Coloque em composteira doméstica ou entregue em pontos de compostagem comunitária.", "Pode ser enterrada diretamente no jardim."]
        },
        {
            name: "Teclados e Mouses",
            type: "special",
            icon: "fas fa-keyboard",
            info: "Lixo eletrônico (e-lixo) com metais pesados e componentes tóxicos.",
            dispose: ["Se ainda funcionar, doe ou venda.", "Se quebrado, leve a pontos de coleta de e-lixo da prefeitura ou fabricante.", "Lojas de informática e operadoras de celular costumam ter caixas de coleta."]
        },
        {
            name: "Cápsulas de Café",
            type: "special",
            icon: "fas fa-mug-hot",
            info: "Mistura de alumínio ou plástico com resíduo orgânico — não vai para reciclagem comum.",
            dispose: ["Abra a cápsula e retire o pó de café (vai para composteira).", "Lave a embalagem vazia.", "Leve aos pontos de coleta da marca (Nespresso, Nescafé, etc.) — a logística reversa é obrigatória."]
        },
        {
            name: "Esponja de Cozinha",
            type: "special",
            icon: "fas fa-soap",
            info: "Feita de poliuretano — difícil de reciclar e demora décadas para se decompor.",
            dispose: ["Quando velha, use para limpar áreas externas antes de descartar.", "Pesquise programas de logística reversa como TerraCycle.", "Na falta de coleta, vai para o lixo comum."]
        },
        {
            name: "Medicamentos Vencidos",
            type: "special",
            icon: "fas fa-pills",
            info: "Risco químico e biológico grave se descartados incorretamente.",
            dispose: ["NUNCA jogue no lixo comum ou vaso sanitário.", "Deixe os medicamentos nas embalagens originais quando possível.", "Leve a farmácias participantes do programa PBEX (Programa Brasileiro de Excelência) — é gratuito e legal."]
        },
        {
            name: "Radiografias (Raio-X)",
            type: "special",
            icon: "fas fa-x-ray",
            info: "O filme contém prata — metal pesado de alto valor que pode ser recuperado.",
            dispose: ["Leve a hospitais, clínicas de imagem ou centros de saúde.", "Eles possuem contratos com empresas de recuperação de prata.", "Não jogue no lixo — é crime ambiental."]
        },
        {
            name: "Papelão de Pizza",
            type: "compost",
            icon: "fas fa-pizza-slice",
            info: "A gordura contamina o papel e impede sua reciclagem na parte suja.",
            dispose: ["Separe a parte limpa (tampa) da parte suja (base com gordura).", "A parte limpa vai para a lixeira azul (papel).", "A parte suja deve ser picada em pedaços pequenos e colocada na composteira."]
        },
        {
            name: "Lâmpadas Fluorescentes",
            type: "special",
            icon: "fas fa-lightbulb",
            info: "Contêm vapor de mercúrio — altamente tóxico. Uma lâmpada contamina 30.000 litros de água.",
            dispose: ["Transporte com MUITO cuidado para não quebrar.", "Se quebrar: ventile bem o ambiente, saia por 15 minutos. Limpe o chão com pano ÚMIDO (nunca vassoura — espalha o mercúrio). Coloque os fragmentos em saco plástico fechado.", "Entregue INTACTA em lojas de material de construção, supermercados ou pontos de coleta. Nunca jogue no lixo."]
        },
        {
            name: "Roupas Velhas",
            type: "recycle",
            icon: "fas fa-shirt",
            info: "A indústria têxtil é a 2ª mais poluente do mundo.",
            dispose: ["Se em bom estado: doe para instituições, brechós ou pontos de doação.", "Se rasgadas/manchadas: corte em panos de limpeza ou retalhos para artesanato.", "Procure caixas de coleta têxtil em shoppings — marcas como H&M e C&A têm programas de reciclagem."]
        },
        {
            name: "Bitucas de Cigarro",
            type: "special",
            icon: "fas fa-smoking",
            info: "Cada bituca contamina até 40 litros de água. O filtro é plástico — não se decompõe.",
            dispose: ["NUNCA jogue no chão, ralo ou vaso sanitário.", "Apague bem em cinzeiro e descarte no lixo comum em saquinho fechado.", "Pesquise empresas como Bibituca que transformam filtros em papel e plástico reciclado."]
        },
        {
            name: "Filtro de Papel (Café)",
            type: "compost",
            icon: "fas fa-filter",
            info: "Papel biodegradável + matéria orgânica — combinação perfeita para compostagem.",
            dispose: ["Pode ir direto para a composteira com o pó de café ainda dentro.", "Ou descarte o papel na lixeira azul e o pó no jardim."]
        },
        {
            name: "Rolhas de Cortiça",
            type: "recycle",
            icon: "fas fa-wine-bottle",
            info: "Cortiça é um material natural renovável 100% reciclável.",
            dispose: ["Deixe secar completamente antes de descartar.", "Leve a adegas, restaurantes ou supermercados que tenham coletores específicos.", "No Brasil, a Apcor coordena pontos de coleta de rolhas."]
        },
        {
            name: "Escova de Dentes",
            type: "special",
            icon: "fas fa-tooth",
            info: "Mistura de plásticos diferentes e nylon — não vai para reciclagem comum.",
            dispose: ["Pesquise programas de coleta como TerraCycle para escovas.", "Na falta, vai para o lixo comum.", "Considere escovas de bambu como alternativa sustentável."]
        },
        {
            name: "Potes de Iogurte",
            type: "recycle",
            icon: "fas fa-cup-straw",
            info: "Plástico rígido tipo PP (5) — reciclável na maioria das cidades.",
            dispose: ["Lave bem para remover restos de alimento.", "Retire a tampa de alumínio (recicla separado).", "Descarte na lixeira vermelha (plástico)."]
        },
        {
            name: "Móveis de Madeira",
            type: "special",
            icon: "fas fa-chair",
            info: "Ocupam enorme volume nos aterros e levam décadas para se decompor.",
            dispose: ["Tente restaurar antes de descartar — pintura, lixa e verniz fazem milagres.", "Doe em bom estado para institutos ou pelo OLX/Facebook Marketplace.", "Para descarte, ligue para a prefeitura — a coleta de entulho volumoso é gratuita na maioria das cidades."]
        },
        {
            name: "Óculos Antigos",
            type: "recycle",
            icon: "fas fa-glasses",
            info: "Compostos de metal, plástico e vidro óptico — materiais de alto valor.",
            dispose: ["Se em boas condições, doe em óticas participantes do programa Ver o Brasil.", "Se quebrados, separe as partes (armação e lente) e leve a óticas para descarte correto."]
        },
        {
            name: "Papel de Presente",
            type: "recycle",
            icon: "fas fa-gift",
            info: "Papel comum é reciclável, mas papéis metalizados, brilhantes ou laminados NÃO são.",
            dispose: ["Teste amassando: se não destortou, é metalizado e vai para lixo comum.", "Se for papel normal: descarte na lixeira azul (papel).", "Sacos de presente de tecido: reutilize quantas vezes quiser!"]
        },
        {
            name: "Tampinhas Plásticas",
            type: "recycle",
            icon: "fas fa-capsules",
            info: "Plástico tipo PP ou PEAD — valorizado e aceito por cooperativas.",
            dispose: ["Não precisam ser lavadas.", "Junte em quantidade e leve a cooperativas de reciclagem ou projetos sociais.", "Muitas ONGs recolhem tampinhas para financiar cadeiras de rodas e tratamentos médicos."]
        },
        {
            name: "Palitos de Madeira",
            type: "compost",
            icon: "fas fa-lines-leaning",
            info: "Madeira natural de reflorestamento — biodegradável.",
            dispose: ["Podem ir para a composteira — ajudam na aeração do composto.", "Podem ser enterrados no jardim.", "Em grandes quantidades, leve a cooperativas de reciclagem de madeira."]
        },
        {
            name: "Objetos Cortantes",
            type: "special",
            icon: "fas fa-scissors",
            info: "Facas, agulhas, lâminas e cacos de vidro — risco grave de acidentes para coletores.",
            dispose: ["NUNCA descarte soltos no lixo.", "Embrulhe em várias camadas de papelão grosso e prenda com fita.", "Escreva 'OBJETO CORTANTE — CUIDADO' por fora.", "Coloque em caixa rígida antes de descartar no lixo especial ou ponto de coleta."]
        }
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
            
            const disposeSteps = item.dispose.map((s, i) => `<li>${s}</li>`).join('');
            const tipHtml = item.tip ? `<div class="guide-box-big" style="margin-top:12px; background: rgba(16,185,129,0.08); border-left: 3px solid #10b981;"><h5><i class="fas fa-lightbulb" style="color:#10b981;"></i> Dica Extra:</h5><p class="result-guide-text">${item.tip}</p></div>` : '';

            card.innerHTML = `
                <div class="result-visual-side">
                    <i class="${item.icon}"></i>
                    <h3>${item.name}</h3>
                </div>
                <div class="result-content-side">
                    <span class="status-label type-${item.type}">
                        ${item.type === 'compost' ? '🌱 Compostagem' : item.type === 'recycle' ? '♻️ Reciclável' : '⚠️ Descarte Especial'}
                    </span>
                    <p class="result-info-text"><strong>O que é:</strong> ${item.info}</p>
                    
                    <div class="guide-box-big">
                        <h5><i class="fas fa-recycle"></i> Como descartar corretamente:</h5>
                        <ol style="margin: 8px 0 0 16px; line-height: 1.8;">${disposeSteps}</ol>
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

                if (filter === 'all' || category === filter) {
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
});
