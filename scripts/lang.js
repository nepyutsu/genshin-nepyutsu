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

// Chargement des fichiers JSON
function loadJSON(path) {
    return fetch(path).then(response => {
        if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
        return response.json();
    }).catch(error => {
        console.error(`Erreur lors du chargement du fichier ${path}:`, error);
        return null;
    });
}

function applyPageText(data, applyTextFunction) {
    applyTextFunction(data);
}

async function applyTranslation(lang) {
    const currentPage = window.location.pathname.split('/').pop().split('.').shift();
    const applyTextFunction = getApplyTextFunctionForPage(currentPage);

    Promise.all([
        loadJSON(`/locales/${lang}/common.json?v=3`),
        (applyTextFunction !== applyErrorText) ? loadJSON(`/locales/${lang}/${currentPage}.json?v=3`) : loadJSON(`/locales/${lang}/404.json?v=3`)
    ]).then(([commonData, pageData]) => {
        if (commonData) { applyCommonText(commonData); }
        if (pageData) { applyPageText(pageData, applyTextFunction); }

        showPageElements();
    }).catch(error => {
        console.error("Erreur lors du chargement des fichiers JSON:", error);
    });
}

function showPageElements() {
    document.querySelectorAll('.navigation-bar, .special-footer, .content, .description-box, .sources-box, .region-selector, .region-info, .commission-details, .privacy-box, .commission-container, .progress-chest, .progress-info, .progress-commission, .progress-button').forEach(el => {
        el.classList.remove('hidden', 'no-animation');
    });
}

const pageFunctions = { 'home': applyHomeText, 'chest': applyChestText, 'commission': applyCommissionsText, 'progress': applyProgressText, 'privacy': applyPrivacyText };
function getApplyTextFunctionForPage(page) {
    return pageFunctions[page] || applyErrorText;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Application des textes communs aux pages
function applyCommonText(data) {
    const elements = {
        'home-link': data.header.home,
        'chest-link': data.header.chest,
        'commissions-link': data.header.commission,
        'progress-link': data.header.progress,
        'sidebar-navigation': data.sidebar.navigation,
        'sidebar-home-link': data.header.home,
        'sidebar-chest-link': data.header.chest,
        'sidebar-commissions-link': data.header.commission,
        'sidebar-progress-link': data.header.progress,
        'lang-title': data.sidebar.lang,
        'lang-fr': data.sidebar.langFrench,
        'lang-en': data.sidebar.langEnglish,
        'theme-title': data.sidebar.theme,
        'light-theme': data.sidebar.themeLight,
        'dark-theme': data.sidebar.themeDark,
        'red-theme': data.sidebar.themeRed,
        'green-theme': data.sidebar.themeGreen,
        'blue-theme': data.sidebar.themeBlue,
        'purple-theme': data.sidebar.themePurple,
        'beige-theme': data.sidebar.themeBeige,
        'brown-theme': data.sidebar.themeBrown,
        'footer-socials-title': data.footer.socials,
        'footer-socials-link1': data.footer.socialsLink1,
        'footer-socials-link2': data.footer.socialsLink2,
        'footer-socials-link3': data.footer.socialsLink3,
        'footer-misc-title': data.footer.misc,
        'footer-misc-link1': data.footer.miscLink1,
        'footer-misc-link2': data.footer.miscLink2,
        'footer-misc-link3': data.footer.miscLink3,
        'footer-disclaimer': data.footer.disclaimer
    };

    for (const [id, text] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = text;
    }
}

// Application des textes spécifiques aux pages
function applyHomeText(data) {
    document.title = `${data.page} | Nepyutsu`;
    document.getElementById('description-title').innerHTML = data.description;
    document.getElementById('sources-title').innerHTML = `<u>${data.sources}</u>`;

    const sources = [
        { id: 'sources-title-1', href: 'https://docs.google.com/spreadsheets/d/1J24Rnn5-j4pDWB0ann_tYYj28_YJs67gY2sDLODzenM/edit', text: data.title1 },
        { id: 'sources-title-2', href: 'https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQW2225OF4UD_CTCCPUmC38dsa10KhqXQJEuyAhoX0EQ6zJEjek5HfjRVRUmHacuzLNgMqxUehv2AHU/pubhtml', text: data.title2 },
        { id: 'sources-title-3', href: 'https://genshin.hoyoverse.com/fr/map', text: data.title3 }
    ];

    sources.forEach((source, index) => {
        const titleEl = document.getElementById(source.id);
        if (titleEl) titleEl.innerHTML = `<a href="${source.href}" target="_blank">${source.text}</a>`;
        const descEl = document.getElementById(`sources-description-${index + 1}`);
        if (descEl) descEl.innerHTML = data[`description${index + 1}`];
    });
}

function applyChestText(data) {
    document.title = `${data.page} | Nepyutsu`;
    const selectedRegion = localStorage.getItem('selectedRegion') || 'mondstadt';
    const regionData = data[capitalizeFirstLetter(selectedRegion)][0];

    document.getElementById('region-title').textContent = regionData.title;
    document.getElementById('region-description').innerHTML = regionData.description.join('');
}

function applyCommissionsText(data) {
    document.title = `${data.page} | Nepyutsu`;
    const selectedRegion = localStorage.getItem('selectedRegion') || 'mondstadt';
    updateCommissionRegion(selectedRegion);
}

function applyProgressText(data) {
    document.title = `${data.page} | Nepyutsu`;
    document.getElementById('info-description').innerHTML = data.info;
    document.getElementById('acknowledge-button').innerHTML = data.acknowledgeButton;
    document.getElementById('chests-title').innerHTML = data.chestTitle;
    document.getElementById('achievement-title').innerHTML = data.achievementTitle;
    window.translations = { check: data.checkButton, uncheck: data.uncheckButton, export: data.exportButton, import: data.importButton, };

    renderProgressChests(data);
    renderAchievements(data);
    updateImportExportButtons();

    if (!localStorage.getItem('progress-data') || !localStorage.getItem('achievement-data')) { saveData(); }
}

function applyPrivacyText(data) {
    document.title = `${data.page} | Nepyutsu`;
    document.getElementById('privacy-title').innerHTML = data.title;
    document.getElementById('privacy-description').innerHTML = data.content;
}

function applyErrorText(data) {
    document.getElementById('error-title').innerHTML = data.title;
    document.getElementById('error-subtitle').innerHTML = data.subtitle;
    document.getElementById('error-redirection').innerHTML = data.redirection;
}