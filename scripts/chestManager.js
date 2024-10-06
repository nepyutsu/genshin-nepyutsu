document.addEventListener('DOMContentLoaded', function () {
    const regionButtons = document.querySelectorAll('.region-button');

    const savedRegion = localStorage.getItem('selectedRegion') || 'mondstadt';
    updateRegion(savedRegion);

    document.querySelectorAll('.region-button').forEach(button => {
        button.addEventListener('click', () => {
            const selectedRegion = button.getAttribute('data-region');
            updateRegion(selectedRegion);
            localStorage.setItem('selectedRegion', selectedRegion);
        });
    });

    function updateRegion(region) {
        const lang = document.documentElement.getAttribute('lang') || 'en';

        loadJSON(`/locales/${lang}/chest.json?v=1.0.0`).then(data => {
            applyChestText(data);

            // Mettre à jour l'état actif des boutons de région
            regionButtons.forEach(button => {
                button.classList.remove('active');
                if (button.getAttribute('data-region') === region) { button.classList.add('active'); }
            });

            // Mettre à jour l'image de fond
            document.querySelector('.background-image').style.backgroundImage = `url('/images/backgrounds/${region}.webp')`;
        }).catch(error => {
            console.error("Erreur lors du chargement du fichier de langue:", error);
        });
    }
});