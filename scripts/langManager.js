// Liste des langues valides ET fonction pour déterminer si la langue l'est ou non
const validLanguages = ['fr', 'en'];

function isValidLanguage(lang) {
    return validLanguages.includes(lang);
}

// Détection de la langue à afficher par défaut à l'utilisateur
function detectUserLanguage() {
    const userLang = navigator.language;
    const langPrefix = userLang.split('-')[0];

    return isValidLanguage(langPrefix) ? langPrefix : 'en';
}

// Récupération et enregistrement de la langue de l'utilisateur
function setDefaultLanguage() {
    let savedLang = localStorage.getItem('selectedLang') || detectUserLanguage();
    if (!isValidLanguage(savedLang)) { savedLang = 'en'; }

    document.documentElement.setAttribute('lang', savedLang);
    return savedLang;
}

// Modifier la langue de l'utilisation lorsqu'il clique sur un bouton de changement de langue
function changeLang(lang) {
    if (!isValidLanguage(lang)) {
        console.warn(`Langue "${lang}" non supportée.`); return;
    }

    localStorage.setItem('selectedLang', lang);
    document.documentElement.setAttribute('lang', lang);
    applyTranslation(lang);
}

// Détection de la langue par défaut et applique les traductions appropriées lorsque le DOM est chargé.
document.addEventListener('DOMContentLoaded', function () {
    const lang = setDefaultLanguage();
    applyTranslation(lang);

    document.querySelectorAll('.lang-button').forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.id.replace('lang-', '');
            changeLang(lang);
        });
    });
});