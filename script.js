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
            // Como não podemos modificar pseudo-elementos diretamente via JS de forma fácil p/ posição dinâmica,
            // vamos usar CSS Variables no style do elemento pai para controlar o gradiente.

            // Mas a abordagem CSS pura acima já faz um efeito legal de "enter".
            // Para fazer o brilho SEGUIR o mouse, precisamos mudar a estratégia:
            // Criar um elemento real de "brilho".
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

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    const menuIcon = mobileMenuToggle?.querySelector('i');

    mobileMenuToggle?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');

        if (navLinks?.classList.contains('active')) {
            menuIcon.classList.remove('fa-bars');
            menuIcon.classList.add('fa-times');
        } else {
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });

    // Fechar menu ao clicar em um link
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon?.classList.remove('fa-times');
            menuIcon?.classList.add('fa-bars');
        });
    });

    // --- Filtros da Oficina de Artesanato ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const craftCards = document.querySelectorAll('.craft-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualiza botões
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
