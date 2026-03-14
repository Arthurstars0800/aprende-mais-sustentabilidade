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

    });

    // Base de Dados de Reciclagem Criativa (Upcycling)
    const wasteData = [
        {
            name: "Caixa de Leite",
            type: "recycle",
            icon: "fas fa-blender",
            info: "100% Reciclável. Mas você pode REUSAR!",
            guide: "Ideia: Com uma caixa de leite, palitos de churrasco e tampinhas, você cria um carrinho incrível! Também serve como carteira ou vaso de plantas isolante térmico."
        },
        {
            name: "Cabelo Humano",
            type: "compost",
            icon: "fas fa-cut",
            info: "Riquíssimo em nitrogênio para a natureza.",
            guide: "Ideia: Use como fertilizante direto em vasos de plantas ou aditivo para acelerar a decomposição na composteira."
        },
        {
            name: "Pneu Velho",
            type: "special",
            icon: "fas fa-circle-dot",
            info: "Descarte difícil, mas ótimo para o upcycling.",
            guide: "Ideia: Transforme em um puff confortável com corda de sisal, um balanço para crianças ou um canteiro elevado para horta."
        },
        {
            name: "Rolo de Papel Higiênico",
            type: "recycle",
            icon: "fas fa-scroll",
            info: "Papel de alta qualidade para reciclar.",
            guide: "Ideia: Crie organizadores de cabos, sementeiras biodegradáveis para mudas ou brinquedos de encaixe para crianças."
        },
        {
            name: "Bagaço de Uva",
            type: "compost",
            icon: "fas fa-seedling",
            info: "Resíduo orgânico premium.",
            guide: "Ideia: Ideal para estruturar o solo da horta. Ajuda a reter umidade e fornece nutrientes lentos para as plantas."
        },
        {
            name: "Garrafa PET",
            type: "recycle",
            icon: "fas fa-bottle-water",
            info: "Plástico que dura séculos.",
            guide: "Ideia: Faça uma horta vertical de garrafas, um cofrinho em formato de porquinho ou até um comedouro automático para pássaros."
        },
        {
            name: "Latas de Alumínio",
            type: "recycle",
            icon: "fas fa-can-food",
            info: "O material mais reciclado do Brasil.",
            guide: "Ideia: Transforme em luminárias decorativas fazendo furos com prego, ou use como organizadores de mesa estilizados."
        },
        {
            name: "CDs/DVDs Antigos",
            type: "special",
            icon: "fas fa-compact-disc",
            info: "Material plástico e metálico complexo.",
            guide: "Ideia: Quebre em pedaços pequenos para fazer mosaicos em vasos, espelhos ou crie um espanta-pássaros para sua horta."
        },
        {
            name: "Óleo de Cozinha",
            type: "special",
            icon: "fas fa-oil-can",
            info: "Poluente pesado se descartado no ralo.",
            guide: "Ideia: Guarde em garrafas PET e entregue em postos de coleta. Pode ser transformado em sabão caseiro ecológico ou biodiesel."
        },
        {
            name: "Pilhas e Baterias",
            type: "special",
            icon: "fas fa-battery-half",
            info: "Contém metais tóxicos.",
            guide: "Ideia: Nunca jogue no lixo comum. Procure totens de descarte em supermercados ou farmácias para a logística reversa."
        },
        {
            name: "Vidro Quebrado",
            type: "recycle",
            icon: "fas fa-burst",
            info: "Reciclável, mas perigoso para coletores.",
            guide: "Ideia: Coloque dentro de uma garrafa PET cortada ou caixa de leite e lacre bem com fita, escrevendo 'VIDRO' por fora."
        },
        {
            name: "Isopor (EPS)",
            type: "recycle",
            icon: "fas fa-box-open",
            info: "É um tipo de plástico (número 6).",
            guide: "Ideia: Limpe bem para remover restos de comida. Pode ser usado como drenagem em vasos de plantas ou proteção para envio de pacotes."
        },
        {
            name: "Cascas de Alimentos",
            type: "compost",
            icon: "fas fa-apple-whole",
            info: "Matéria orgânica rica.",
            guide: "Ideia: Transforme em adubo em uma composteira doméstica ou enterre no jardim para nutrir a terra naturalmente."
        },
        {
            name: "Teclados e Mouses",
            type: "special",
            icon: "fas fa-keyboard",
            info: "Lixo eletrônico com componentes plásticos e metálicos.",
            guide: "Ideia: Doe se ainda funcionar. Se não, leve a pontos de coleta de e-lixo para recuperação de metais nobres."
        },
        {
            name: "Cápsulas de Café",
            type: "special",
            icon: "fas fa-mug-hot",
            info: "Mistura de alumínio ou plástico com resíduo orgânico.",
            guide: "Ideia: Abra a cápsula, use o pó de café na horta e leve a embalagem limpa aos pontos de coleta da marca."
        },
        {
            name: "Esponja de Cozinha",
            type: "special",
            icon: "fas fa-soap",
            info: "Feita de poliuretano, difícil de reciclar comercialmente.",
            guide: "Ideia: Use para limpar áreas externas antes de descartar. Existem programas de logística reversa (como da TerraCycle)."
        },
        {
            name: "Medicamentos Vencidos",
            type: "special",
            icon: "fas fa-pills",
            info: "Risco químico e biológico se descartados incorretamente.",
            guide: "Ideia: Jamais jogue no lixo ou vaso sanitário. Leve a farmácias que possuem coletores específicos para incineração."
        },
        {
            name: "Radiografias (Raio-X)",
            type: "special",
            icon: "fas fa-x-ray",
            info: "Contém sais de prata (metais pesados).",
            guide: "Ideia: Entregue em hospitais ou centros de saúde que façam a recuperação da prata e reciclagem correta do plástico."
        },
        {
            name: "Papelão de Pizza",
            type: "compost",
            icon: "fas fa-pizza-slice",
            info: "A gordura impede a reciclagem tradicional do papel.",
            guide: "Ideia: A parte limpa vai para a reciclagem. A parte suja de gordura deve ser picada e colocada na composteira."
        },
        {
            name: "Lâmpadas Fluorescentes",
            type: "special",
            icon: "fas fa-lightbulb",
            info: "Contêm vapor de mercúrio altamente tóxico.",
            guide: "Ideia: Devem ser entregues intactas em locais que praticam logística reversa para serem descontaminadas."
        },
        {
            name: "Roupas Velhas",
            type: "recycle",
            icon: "fas fa-shirt",
            info: "Fibras que podem ser reaproveitadas.",
            guide: "Ideia: Doe se estiverem boas. Se não, transforme em panos de limpeza, enchimento de almofadas ou retalhos para artesanato."
        },
        {
            name: "Bitucas de Cigarro",
            type: "special",
            icon: "fas fa-smoking",
            info: "Altamente tóxicas para o solo e água.",
            guide: "Ideia: Existem empresas que transformam bitucas em papel. Se não houver coleta, jogue no lixo comum, nunca no chão."
        },
        {
            name: "Filtro de Papel (Café)",
            type: "compost",
            icon: "fas fa-filter",
            info: "Papel biodegradável e matéria orgânica.",
            guide: "Ideia: Pode ir direto para a composteira junto com o pó de café. Ajuda no fornecimento de carbono para o composto."
        },
        {
            name: "Rolhas de Cortiça",
            type: "recycle",
            icon: "fas fa-wine-bottle",
            info: "Material natural premium.",
            guide: "Ideia: Use para fazer quadros de aviso, descanso de panelas ou até chaveiros que flutuam na água."
        },
        {
            name: "Escova de Dentes",
            type: "special",
            icon: "fas fa-tooth",
            info: "Mistura de plásticos e nylon.",
            guide: "Ideia: Ótima para limpar cantos difíceis, rejuntes, correntes de bicicleta ou teclados antes do descarte final."
        },
        {
            name: "Potes de Iogurte",
            type: "recycle",
            icon: "fas fa-cup-straw",
            info: "Plástico rígido reciclável.",
            guide: "Ideia: Lave bem e use como sementeiras para pequenas mudas ou para organizar pregos e parafusos na oficina."
        },
        {
            name: "Móveis de Madeira",
            type: "special",
            icon: "fas fa-chair",
            info: "Ocupam grande volume nos aterros.",
            guide: "Ideia: Tente restaurar com pintura ou pátina. Se estiverem inutilizáveis, use a madeira para criar prateleiras pequenas."
        },
        {
            name: "Óculos Antigos",
            type: "recycle",
            icon: "fas fa-glasses",
            info: "Compostos de vários materiais (metal/plástico).",
            guide: "Ideia: Muitas óticas recolhem óculos usados para doação a bancos de olhos após higienização e ajuste."
        },
        {
            name: "Papel de Presente",
            type: "recycle",
            icon: "fas fa-gift",
            info: "Papel comum é reciclável, metalizados não.",
            guide: "Ideia: Tente abrir presentes com cuidado para REUSAR o papel no próximo aniversário. O planeta agradece!"
        },
        {
            name: "Tampinhas Plásticas",
            type: "recycle",
            icon: "fas fa-capsules",
            info: "Plástico tipo PP, muito valorizado.",
            guide: "Ideia: Junte para projetos sociais. Elas também são excelentes para ensinar contagem e cores para crianças."
        },
        {
            name: "Palitos de Madeira",
            type: "compost",
            icon: "fas fa-lines-leaning",
            info: "Madeira natural de reflorestamento.",
            guide: "Ideia: Ideais para construir maquetes, suporte para pequenas plantas ou podem ir para a composteira."
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
            card.innerHTML = `
                <div class="result-visual-side">
                    <i class="${item.icon}"></i>
                    <h3>${item.name}</h3>
                </div>
                <div class="result-content-side">
                    <span class="status-label type-${item.type}">
                        ${item.type === 'compost' ? 'Compostagem' : item.type === 'recycle' ? 'Reciclável' : 'Descarte Especial'}
                    </span>
                    <p class="result-info-text"><strong>O que é:</strong> ${item.info}</p>
                    
                    <div class="guide-box-big">
                        <h5><i class="fas fa-lightbulb"></i> Como Reciclar / Reusar:</h5>
                        <p class="result-guide-text">${item.guide}</p>
                    </div>
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
