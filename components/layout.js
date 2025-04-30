/* ---------- Gestion du Header et de la Sidebar ---------- */
class NavigationBar extends HTMLElement {
    constructor() {
        super();
        this.stickerImages = [
            "/images/stickers/kokomi-1.webp", "/images/stickers/kokomi-2.webp", "/images/stickers/kokomi-3.webp", "/images/stickers/kokomi-4.webp", "/images/stickers/kokomi-5.webp", "/images/stickers/kokomi-6.webp", "/images/stickers/kokomi-7.webp",
            "/images/stickers/lynette-1.webp", "/images/stickers/lynette-2.webp", "/images/stickers/lynette-3.webp", "/images/stickers/lynette-4.webp", "/images/stickers/lynette-5.webp", "/images/stickers/lynette-6.webp",
            "/images/stickers/yunjin-1.webp", "/images/stickers/yunjin-2.webp", "/images/stickers/yunjin-3.webp", "/images/stickers/yunjin-4.webp",
            "/images/stickers/mualani-1.webp", "/images/stickers/mualani-2.webp", "/images/stickers/mualani-3.webp", "/images/stickers/mualani-4.webp", "/images/stickers/mualani-4.webp",
        ];
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="header">

                <div class="header-content">

                    <a id="logo-link" href="/home.html">
                        <img src="/images/logo.webp" class="logo">
                    </a>

                    <nav class="menu" aria-label="Navigation principale">
                        <a id="home-link" href="/home.html"></a>
                        <a id="chest-link" href="/chest.html"></a>
                        <a id="commissions-link" href="/commission.html"></a>
                        <a id="progress-link" href="/progress.html"></a>
                    </nav>

                    <a href="#" class="menu-icon" id="menu-toggle">

                        <!-- Sidebar Icon -->
                        <svg id="hamburger-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>

                        <!-- Sidebar Cross -->
                        <svg id="cross-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>

                    </a>

                </div>

                <!-- Sidebar -->
                <div class="sidebar" id="sidebar">

                    <div class="sidebar-content">

                        <nav class="sidebar-menu" aria-label="Navigation secondaire">
                            <h3 id="sidebar-navigation"></h3>

                            <a href="/home.html" class="navigation-button" id="sidebar-home-link"></a>
                            <a href="/chest.html" class="navigation-button" id="sidebar-chest-link"></a>
                            <a href="/commission.html" class="navigation-button" id="sidebar-commissions-link"></a>
                            <a href="/progress.html" class="navigation-button" id="sidebar-progress-link"></a>
                        </nav>

                        <div class="sidebar-settings">

                            <div class="sidebar-column">
                                <h3 id="lang-title"></h3>

                                <div class="lang-buttons">
                                    <button class="lang-button" id="lang-fr"></button>
                                    <button class="lang-button" id="lang-en"></button>
                                </div>
                            </div>

                            <div class="sidebar-column">
                                <h3 id="theme-title"></h3>

                                <div class="theme-buttons">
                                    <button class="theme-button" id="light-theme"></button>
                                    <button class="theme-button" id="dark-theme"></button>
                                    <button class="theme-button" id="red-theme"></button>
                                    <button class="theme-button" id="green-theme"></button>
                                    <button class="theme-button" id="blue-theme"></button>
                                    <button class="theme-button" id="purple-theme"></button>
                                    <button class="theme-button" id="beige-theme"></button>
                                    <button class="theme-button" id="brown-theme"></button>
                                </div>

                            </div>

                        </div>

                        <div class="random-sticker">
                            <img id="random-sticker-image" src="">
                        </div>

                    </div>

                </div>

            </div>`;

        // Gérer l'autocollant de la sidebar
        const getRandomSticker = () => {
            const randomIndex = Math.floor(Math.random() * this.stickerImages.length);
            return this.stickerImages[randomIndex];
        };
        const randomStickerImg = this.querySelector('#random-sticker-image');
        randomStickerImg.src = getRandomSticker();

        // Varibles pour la gestion de la sidebar
        const menuToggle = this.querySelector("#menu-toggle");
        const sidebar = this.querySelector("#sidebar");
        const hamburgerIcon = this.querySelector("#hamburger-icon");
        const crossIcon = this.querySelector("#cross-icon");

        // Afficher ou cacher la sidebar en cliquant sur l'icône
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault(); toggleSidebar();
        });

        // Afficher ou cacher la sidebar via la touche 's'
        document.addEventListener('keydown', handleKeyDown);
        function handleKeyDown(e) {
            if (e.key === 's' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
                e.preventDefault(); toggleSidebar();
            }
        }

        // Fonction pour afficher ou cacher la sidebar
        function toggleSidebar() {
            sidebar.classList.toggle('open');
            menuToggle.classList.toggle('open');

            const isOpen = menuToggle.classList.contains('open');
            hamburgerIcon.style.display = isOpen ? 'none' : 'block';
            crossIcon.style.display = isOpen ? 'block' : 'none';
        }

        // Fermer la sidebar si on clique ailleurs que dans la sidebar
        document.addEventListener('click', handleDocumentClick);
        function handleDocumentClick(e) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                closeSidebar();
            }
        }

        function closeSidebar() {
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                menuToggle.classList.remove('open');
                hamburgerIcon.style.display = 'block';
                crossIcon.style.display = 'none';
            }
        }

    }
}

/* ---------- Gestion du Footer ---------- */
class SpecialFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <div class="footer-container">

                    <div class="footer-columns">
                        <div class="footer-column-socials">
                            <h3 id="footer-socials-title"></h3>
                            <p id="footer-socials-link1"></p>
                            <p id="footer-socials-link2"></p>
                            <p id="footer-socials-link3"></p>
                        </div>

                        <div class="footer-column-misc">
                            <h3 id="footer-misc-title"></h3>
                            <p id="footer-misc-link1"></p>
                            <p id="footer-misc-link2"></p>
                            <p id="footer-misc-link3"></p>
                        </div>
                    </div>

                    <div class="footer-column-disclaimer">
                        <p id="footer-disclaimer"></p>
                    </div>

                </div>
            </footer>`;
    }
}

customElements.define('navigation-bar', NavigationBar);
customElements.define('special-footer', SpecialFooter);