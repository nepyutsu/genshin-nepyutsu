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

customElements.define('special-footer', SpecialFooter);