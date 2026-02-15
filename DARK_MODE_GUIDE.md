# Como Aplicar Dark Mode e Menu Mobile nas Outras Páginas

## ✅ Já Implementado em:
- `index.html`
- `style.css` (estilos globais)
- `script.js` (funcionalidade)

## 📋 Para Aplicar nas Outras Páginas:

### 1. Atualizar a Navbar em TODAS as páginas:

Substitua a navbar atual por esta estrutura:

```html
<nav class="navbar">
    <div class="container">
        <div class="logo">
            <img src="logo.png" alt="Logo" class="nav-logo">
            <span>APRENDE MAIS</span>
        </div>
        <ul class="nav-links" id="navLinks">
            <li><a href="index.html">Home</a></li>
            <li><a href="reciclagem.html">Guia de Reciclagem</a></li>
            <li><a href="artesanato.html">Oficina</a></li>
            <li><a href="quizes.html">Quizes</a></li>
            <li><a href="sobre.html">Quem Somos</a></li>
        </ul>
        <button class="dark-mode-toggle" id="darkModeToggle" aria-label="Toggle Dark Mode">
            <i class="fas fa-moon"></i>
        </button>
        <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Toggle Menu">
            <i class="fas fa-bars"></i>
        </button>
    </div>
</nav>
```

### 2. Marcar a Página Ativa:

Em cada página, adicione `class="active"` no link correspondente:
- `reciclagem.html`: `<a href="reciclagem.html" class="active">`
- `artesanato.html`: `<a href="artesanato.html" class="active">`
- etc.

### 3. Páginas que precisam ser atualizadas:
- [ ] reciclagem.html
- [ ] artesanato.html
- [ ] quizes.html
- [ ] quiz-player.html
- [ ] sobre.html

## 🎨 Funcionalidades Implementadas:

### Dark Mode:
- ✅ Botão toggle com ícone de lua/sol
- ✅ Salva preferência no localStorage
- ✅ Animação de rotação ao clicar
- ✅ Cores adaptadas automaticamente

### Menu Mobile:
- ✅ Aparece em telas < 768px
- ✅ Menu slide da direita
- ✅ Ícone muda de hamburger para X
- ✅ Fecha automaticamente ao clicar em um link
- ✅ Overlay escuro no fundo

## 🔧 Tudo Funciona Automaticamente:
O `script.js` já cuida de tudo! Basta ter os IDs corretos:
- `id="darkModeToggle"` no botão de dark mode
- `id="mobileMenuToggle"` no botão do menu
- `id="navLinks"` na lista de links
