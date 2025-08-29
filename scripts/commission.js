document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.region-button').forEach(button => {
        button.addEventListener('click', () => {
            const selectedRegion = button.getAttribute('data-region');
            updateCommissionRegion(selectedRegion);
            localStorage.setItem('selectedRegion', selectedRegion);
            localStorage.setItem('selectedCommissionId', 'list');
        });
    });

    // Appel initial pour charger la région et le succès sélectionné.
    const savedRegion = localStorage.getItem('selectedRegion');
    if (savedRegion) {
        updateCommissionRegion(savedRegion);
    }
});

function updateCommissionRegion(region) {
    const regionButtons = document.querySelectorAll('.region-button');
    const lang = document.documentElement.getAttribute('lang') || 'en';

    const firstButtonContainer = document.querySelector('.first-button-container');
    const otherButtonsContainer = document.querySelector('.other-buttons-container');
    const commissionDetails = document.getElementById('commission-details');

    let selectedCommissionId = localStorage.getItem('selectedCommissionId') || 'list';

    loadJSON(`/locales/${lang}/commission.json?v=4`).then(data => {
        const regionCapitalized = capitalizeFirstLetter(region);
        const commissionListData = data[`${regionCapitalized}List`][0];
        const commissionKeys = Object.keys(data).filter(key => key.startsWith(regionCapitalized) && key !== `${regionCapitalized}List`);

        firstButtonContainer.innerHTML = '';
        otherButtonsContainer.innerHTML = '';

        // Créer le bouton principal
        const firstButton = createButton('list', commissionListData.title);
        firstButtonContainer.appendChild(firstButton);

        // Créer le menu déroulant
        const select = document.createElement('select');
        select.classList.add('quest-select');

        // Ajouter une option par défaut (texte de remplacement)
        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.textContent = data.buttonSelector || '-/- Sélectionner un succès -\\-';
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        select.appendChild(placeholderOption);

        commissionKeys.forEach(key => {
            const quest = data[key][0];
            const option = document.createElement('option');
            option.value = quest.id;
            option.textContent = quest.achievement;
            select.appendChild(option);
        });

        otherButtonsContainer.appendChild(select);

        // Si une sélection est enregistrée, restaurer la sélection et le texte du menu
        const savedCommissionId = localStorage.getItem('selectedCommissionId');
        if (savedCommissionId && savedCommissionId !== 'list') {
            const savedOption = Array.from(select.options).find(option => option.value === savedCommissionId);
            if (savedOption) {
                select.value = savedCommissionId;
                updateDetails(savedCommissionId);
            }
        } else {
            updateDetails('list');  // Si aucune sélection, afficher la liste
        }

        // Mettre à jour les détails selon l'élément sélectionné
        function updateDetails(id) {
            if (id === 'list' || !id) {
                firstButton.classList.add('active');
                commissionDetails.innerHTML = `<h2>${commissionListData.title}</h2>${commissionListData.description}`;
                select.selectedIndex = 0;
            } else {
                const questDataKey = commissionKeys.find(key => data[key][0].id === id);
                if (questDataKey) {
                    const commissionData = data[questDataKey][0];
                    commissionDetails.innerHTML = formatCommissionText(lang, commissionData.achievement, commissionData.commission, commissionData.requirement, commissionData.notes, commissionData.videoLink);
                }
            }
        }

        // Gérer les changements du menu déroulant
        select.addEventListener('change', () => {
            const id = select.value;
            localStorage.setItem('selectedCommissionId', id);
            updateDetails(id);
            firstButton.classList.remove('active');
        });

        // Gérer le clic sur le bouton "list"
        firstButton.addEventListener('click', () => {
            localStorage.setItem('selectedCommissionId', 'list');
            updateDetails('list');
        });

    }).catch(error => {
        console.error("Erreur lors du chargement du fichier de langue:", error);
    });

    regionButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-region') === region) {
            button.classList.add('active');
        }
    });

    document.querySelector('.background-image').style.backgroundImage = `url('/images/backgrounds/${region}.webp')`;
};

function createButton(id, text) {
    const button = document.createElement('button');
    button.classList.add('quest-button');
    button.dataset.id = id;
    button.textContent = text;
    return button;
}

const commissionText = {
    fr: { commission: 'Mission quotidienne', requirement: 'Condition d\'obtention', notes: 'Information supplémentaire', video: 'Vidéo' },
    en: { commission: 'Commission', requirement: 'Requirement', notes: 'Notes', video: 'Video' },
};

function formatCommissionText(lang, achievement, commission, requirement, notes, video) {
    const texts = commissionText[lang] || commissionText['en'];
    return [
        `<h2>${achievement}</h2>`,
        commission && `<h4 class="commission-section"><img src='/images/emotes/commission.webp' class='emote'> ${texts.commission}</h4><p class="commission-text">${commission}</p>`,
        requirement && `<h4 class="commission-section"><img src='/images/emotes/condition.webp' class='emote'> ${texts.requirement}</h4><p class="commission-text">${requirement}</p>`,
        notes && `<h4 class="commission-section"><img src='/images/emotes/notes.webp' class='emote'> ${texts.notes}</h4>${notes}`,
        video && `<p class="commission-section"><img src='/images/emotes/youtube.webp' class='emote'> <strong>${texts.video}:</strong> ${video}</p>`
    ].filter(Boolean).join('');
}