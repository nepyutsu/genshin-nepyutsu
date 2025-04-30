function createChestEntry(key, regionData) {
    const chestTypes = {
        challenge: { icon: "challenge.webp", label: "D" },
        seelie: { icon: "seelie.webp", label: "F" },
        chest: { icon: "chest.webp", label: "C" },
        electroseelie: { icon: "electroseelie.webp", label: "FE" },
        monetoo: { icon: "monetoo.webp", label: "M" }
    };

    const sectionHTML = Object.entries(regionData)
        .filter(([type]) => chestTypes[type])
        .map(([type, max]) => {
            const { icon } = chestTypes[type];
            const maxValue = parseInt(max);

            return `
                <div class="chest-section">
                    <img src='/images/emotes/${icon}' class='emote'>
                    <div class="chest-text">
                        <div class="chest-values">
                            <input class="chest-input" type="number" value="0" min="0" max="${maxValue}">
                            <span class="slash">/</span>
                            <div class="chest-max">${maxValue}</div>
                        </div>
                        <div class="arrow-wrapper">
                            <button class="arrow-btn up" onmousedown="handleMouseDown(event, this, 1)" onmouseup="stopChange()" onmouseleave="stopChange()">+</button>
                            <button class="arrow-btn down" onmousedown="handleMouseDown(event, this, -1)" onmouseup="stopChange()" onmouseleave="stopChange()">−</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    return `
        <div class="chest-entry" data-key="${key}">
            <p class="chest-subtitle">
                <img src="/images/emotes/${regionData.icon}.webp" alt="${regionData.title}" class="emote">
                <strong> ${regionData.title}</strong>
            </p>
            <div class="chest-block">
                ${sectionHTML}
            </div>
        </div>
    `;
}

function renderProgressChests(data) {
    const regionsToShow = ["Mondstadt", "Liyue", "Inazuma", "Sumeru", "Fontaine", "Natlan"];
    const container = document.getElementById('chests-content');
    const chestData = data.chests;

    const html = Object.entries(chestData)
        .filter(([key]) => regionsToShow.some(region => key.startsWith(region)))
        .map(([key, regionData]) => createChestEntry(key, regionData))
        .join('');

    container.innerHTML = html;

    document.querySelectorAll('.chest-input').forEach(input => {
        input.addEventListener('input', () => {
            const [min, max] = [parseInt(input.min), parseInt(input.max)];
            let val = parseInt(input.value) || 0;

            if (val > max) input.value = max;
            if (val < min) input.value = min;

            updateChestBackground(parseInt(input.value), max, input);

            saveData();
        });

        input.addEventListener('keydown', (e) => {
            const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab',];
            if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) { e.preventDefault(); }
        });
    });

    loadData();
}

function renderAchievements(data) {
    const container = document.getElementById("achievement-content");
    const achievements = data.achievements;
    const saved = JSON.parse(localStorage.getItem('achievement-data') || '{}');

    let html = "";
    let currentRegion = "";

    Object.entries(achievements).forEach(([key, value]) => {
        if (/-0$/.test(key)) {
            if (html !== "") html += "</div>";

            currentRegion = key.replace(/-0$/, '');

            html += `
                <div class="achievement-section" data-region="${currentRegion}">
                    <div class="achievement-header">
                        <h3 class="achievement-title">${value}</h3>
                        <div class="achievement-controls">
                            <button id="checkAllButton" onclick="toggleAllAchievements('${currentRegion}', true)">Check</button><button id="uncheckAllButton" onclick="toggleAllAchievements('${currentRegion}', false)">Uncheck</button>
                        </div>
                    </div>
            `;
        } else {
            const isChecked = saved[key] === true;
            html += `
                <label class="achievement-item ${isChecked ? 'checked' : ''}" data-region="${currentRegion}">
                    <input type="checkbox" data-key="${key}" ${isChecked ? 'checked' : ''}>
                    <span class="checkbox-custom"></span><span class="achievement-name">${value}</span>
                </label>
            `;
        }
    });

    html += "</div>";

    container.innerHTML = html;

    document.querySelectorAll('#achievement-content input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const key = checkbox.getAttribute('data-key');
            const checked = checkbox.checked;
            const saved = JSON.parse(localStorage.getItem('achievement-data') || '{}');
            saved[key] = checked;
            localStorage.setItem('achievement-data', JSON.stringify(saved));
            checkbox.closest('.achievement-item').classList.toggle('checked', checked);
        });
    });
}

function toggleAllAchievements(region, checked) {
    const checkboxes = document.querySelectorAll(`.achievement-item[data-region="${region}"] input[type="checkbox"]`);
    const saved = JSON.parse(localStorage.getItem('achievement-data') || '{}');

    checkboxes.forEach(checkbox => {
        checkbox.checked = checked;
        saved[checkbox.getAttribute('data-key')] = checked;
        checkbox.closest('.achievement-item').classList.toggle('checked', checked);
    });

    localStorage.setItem('achievement-data', JSON.stringify(saved));
}

function changeValue(button, delta) {
    const input = button.closest('.chest-text').querySelector('input');
    let val = parseInt(input.value) || 0;
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    val = Math.min(max, Math.max(min, val + delta));
    input.value = val;

    updateChestBackground(val, max, input);
    saveData();
}

function updateChestBackground(val, max, input) {
    if (val === max) {
        input.closest('.chest-section').classList.add('max-reached');
    } else {
        input.closest('.chest-section').classList.remove('max-reached');
    }
}

let intervalId = null;
function handleMouseDown(event, button, delta) {
    if (event.button !== 0) { event.preventDefault(); return; }
    startChange(button, delta);
}

function startChange(button, delta) {
    changeValue(button, delta);
    intervalId = setInterval(() => { changeValue(button, delta); }, 200);
}

function stopChange() { clearInterval(intervalId); }

function saveData() {
    const data = {};
    document.querySelectorAll('.chest-entry').forEach(entry => {
        const key = entry.getAttribute('data-key');
        const inputs = entry.querySelectorAll('.chest-input');
        data[key] = Array.from(inputs).map(input => parseInt(input.value) || 0);
    });
    localStorage.setItem('progress-data', JSON.stringify(data));
}

function loadData() {
    const saved = JSON.parse(localStorage.getItem('progress-data') || '{}');
    document.querySelectorAll('.chest-entry').forEach(entry => {
        const key = entry.getAttribute('data-key');
        const inputs = entry.querySelectorAll('.chest-input');

        inputs.forEach((input, i) => {
            const max = parseInt(input.max);
            let value = saved[key]?.[i] ?? 0;

            if (value > max) { value = max; }
            input.value = value;
            updateChestBackground(value, max, input);
        });
    });
}

function exportFullData() {
    const savedChests = JSON.parse(localStorage.getItem('progress-data') || '{}');
    const savedAchievements = JSON.parse(localStorage.getItem('achievement-data') || '{}');

    const allChests = {};
    document.querySelectorAll('.chest-entry').forEach(entry => {
        const key = entry.getAttribute('data-key');
        const inputs = entry.querySelectorAll('.chest-input');
        allChests[key] = Array.from(inputs).map((input) => {
            const val = savedChests[key]?.[Array.from(inputs).indexOf(input)] ?? 0;
            return val;
        });
    });

    const allAchievements = {};
    document.querySelectorAll('.achievement-item input[type="checkbox"]').forEach(cb => {
        const key = cb.getAttribute('data-key');
        allAchievements[key] = savedAchievements[key] ?? false;
    });

    const exportObject = { timestamp: Date.now(), chests: allChests, achievements: allAchievements };

    const now = new Date();
    const formattedDate = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + '-' +
        String(now.getHours()).padStart(2, '0') + '-' +
        String(now.getMinutes()).padStart(2, '0') + '-' +
        String(now.getSeconds()).padStart(2, '0');

    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `nepyutsu-progress-${formattedDate}.json`;
    a.click();
}

function importFullData() {
    const fileInput = document.getElementById("import-file");
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const jsonData = JSON.parse(e.target.result);

            if (jsonData && jsonData.chests && jsonData.achievements) {
                localStorage.setItem("progress-data", JSON.stringify(jsonData.chests));
                localStorage.setItem("achievement-data", JSON.stringify(jsonData.achievements));
                window.location.reload();
            } else {
                alert("Fichier invalide.");
            }
        } catch (error) {
            alert("Erreur lors de l'importation : " + error.message);
        }
    };
    reader.readAsText(file);
}

function updateImportExportButtons() {
    const importButton = document.getElementById("import-button");
    const exportButton = document.getElementById("export-button");

    if (exportButton) exportButton.innerText = window.translations.export;
    if (importButton) importButton.innerText = window.translations.import;

    document.querySelectorAll(".achievement-controls").forEach(ctrl => {
        const [checkBtn, uncheckBtn] = ctrl.querySelectorAll("button");
        checkBtn.textContent = window.translations.check;
        uncheckBtn.textContent = window.translations.uncheck;
    });
}

// Gestion du "J'ai compris."
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('infoAcknowledged') === 'true') { document.getElementById('progress-info-container').style.display = 'none'; }

    const acknowledgeButton = document.getElementById('acknowledge-button');
    if (acknowledgeButton) {
        acknowledgeButton.addEventListener('click', () => {
            document.getElementById('progress-info-container').style.display = 'none';
            localStorage.setItem('infoAcknowledged', 'true');
        });
    }
});