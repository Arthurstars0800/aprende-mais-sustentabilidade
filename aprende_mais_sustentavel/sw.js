const CACHE_NAME = 'aprende-mais-v1';
const ASSETS = [
    'index.html',
    'quizes.html',
    'reciclagem.html',
    'artesanato.html',
    'sobre.html',
    'quiz-player.html',
    'style.css',
    'gaia-promo.css',
    'themes.css',
    'script.js',
    'gamification.js',
    'quiz-engine.js',
    'logo.png',
    'gaia_icon.png',
    'manifest.json'
];

// Instalação do Service Worker e Cache de arquivos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Cache aberto - Guardando ativos');
            return cache.addAll(ASSETS);
        })
    );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Estratégia de busca: Tenta rede primeiro, se falhar vai pro cache (Network First)
// Isso garante que o usuário sempre veja novidades, mas tenha o offline se necessário.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
