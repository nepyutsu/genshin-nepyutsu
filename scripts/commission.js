document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.region-button').forEach(button => {
        button.addEventListener('click', () => {
            const selectedRegion = button.getAttribute('data-region');
            updateCommissionRegion(selectedRegion);
            localStorage.setItem('selectedRegion', selectedRegion);
            localStorage.setItem('selectedCommissionId', 'list');
        });
    });
});

function updateCommissionRegion(region) {
    const regionButtons = document.querySelectorAll('.region-button');
    const lang = document.documentElement.getAttribute('lang') || 'en';

    const firstButtonContainer = document.querySelector('.first-button-container');
    const otherButtonsContainer = document.querySelector('.other-buttons-container');
    const commissionDetails = document.getElementById('commission-details');

    let selectedCommissionId = localStorage.getItem('selectedCommissionId') || 'list';

    loadJSON(`/locales/${lang}/commission.json?v=2`).then(data => {
        const regionCapitalized = capitalizeFirstLetter(region);
        const commissionListData = data[`${regionCapitalized}List`][0];
        const commissionKeys = Object.keys(data).filter(key => key.startsWith(`${regionCapitalized}`) && key !== `${regionCapitalized}List`);

        firstButtonContainer.innerHTML = '';
        otherButtonsContainer.innerHTML = '';

        const firstButton = createButton('list', commissionListData.title);
        firstButtonContainer.appendChild(firstButton);

        commissionKeys.forEach(key => {
            const quest = data[key][0];
            const questButton = createButton(quest.id, quest.achievement);
            otherButtonsContainer.appendChild(questButton);
        });

        if (!selectedCommissionId.includes(regionCapitalized) && selectedCommissionId !== 'list') {
            selectedCommissionId = 'list'; localStorage.setItem('selectedCommissionId', 'list');
        }

        const questDataKey = commissionKeys.find(key => data[key][0].id === selectedCommissionId);
        if (questDataKey) {
            const commissionData = data[questDataKey][0];
            commissionDetails.innerHTML = formatCommissionText(lang, commissionData.achievement, commissionData.commission, commissionData.requirement, commissionData.notes, commissionData.videoLink);
        } else {
            firstButton.classList.add('active');
            commissionDetails.innerHTML = `<h2>${commissionListData.title}</h2>${commissionListData.description}`;
        }

        document.querySelectorAll('.quest-button').forEach(button => {
            if (button.getAttribute('data-id') === selectedCommissionId) { button.classList.add('active'); }

            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                localStorage.setItem('selectedCommissionId', id);

                if (id === 'list') {
                    commissionDetails.innerHTML = `<h2>${commissionListData.title}</h2>${commissionListData.description}`;
                } else {
                    const questDataKey = commissionKeys.find(key => data[key][0].id === id);
                    const commissionData = data[questDataKey][0];

                    commissionDetails.innerHTML = formatCommissionText(lang, commissionData.achievement, commissionData.commission, commissionData.requirement, commissionData.notes, commissionData.videoLink);
                }

                document.querySelectorAll('.quest-button').forEach(btn => { btn.classList.remove('active'); });
                button.classList.add('active');
            });
        });

    }).catch(error => {
        console.error("Erreur lors du chargement du fichier de langue:", error);
    });

    // Mettre à jour l'état actif des boutons de région
    regionButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-region') === region) { button.classList.add('active'); }
    });

    // Mettre à jour l'image de fond
    document.querySelector('.background-image').style.backgroundImage = `url('/images/backgrounds/${region}.webp')`;
};

// Fonction pour créer les boutons
function createButton(id, text) {
    const button = document.createElement('button');
    button.classList.add('quest-button');
    button.dataset.id = id;
    button.textContent = text;
    return button;
}

// Fonction qui sert à mettre en forme le texte des missions
const commissionText = {
    fr: { commission: 'Mission quotidienne', requirement: 'Condition d\'obtention', notes: 'Information supplémentaire', video: 'Vidéo' },
    en: { commission: 'Commission', requirement: 'Requirement', notes: 'Notes', video: 'Video' },
};

function formatCommissionText(lang, achievement, commission, requirement, notes, video) {
    const texts = commissionText[lang] || commissionText['en'];
    return [
        `<h2>${achievement}</h2>`,
        commission && `<h4 class="commission-section"><img src='/images/emotes/commission.webp' class='emote'> ${texts.commission}</h4><p class="commission-text"> ${commission}</p>`,
        requirement && `<h4 class="commission-section"><img src='/images/emotes/condition.webp' class='emote'> ${texts.requirement}</h4><p class="commission-text"> ${requirement}</p>`,
        notes && `<h4 class="commission-section"><img src='/images/emotes/notes.webp' class='emote'> ${texts.notes}</h4> ${notes}`,
        video && `<p class="commission-section"><img src='/images/emotes/youtube.webp' class='emote'> <strong>${texts.video}:</strong> ${video}</p>`
    ].filter(Boolean).join('');
}