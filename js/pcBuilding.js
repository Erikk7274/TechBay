window.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await loadHardwareOptions();
});

function setupEventListeners() {
    const btnLogout = document.querySelector('.icon-logout');
    const btnBack = document.querySelector('.btnBack');

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            window.location.href = 'https://techbay2.netlify.app/home.html';
        });
    } else {
        console.error('Nem található vissza gomb.');
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    } else {
        console.error('Nem található kijelentkezés gomb.');
    }
}

async function logout() {
    try {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (res.ok) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');

            alert('Sikeres kijelentkezés');
            window.location.href = 'https://techbay2.netlify.app/index.html';
        } else {
            alert('Hiba a kijelentkezéskor');
        }
    } catch (error) {
        console.error('Hiba a kijelentkezés során:', error);
    }
}

async function loadHardwareOptions() {
    try {
        const response = await fetch('/api/getProducts/getProducts_all');
        const options = await response.json();
        createConfigForm(options);
    } catch (error) {
        console.error('Nem sikerült betölteni a hardver opciókat:', error);
    }
}

function createConfigForm(options) {
    const formContainer = document.getElementById('formContainer');
    if (!formContainer) {
        console.error('Nem található a formContainer elem.');
        return;
    }
    
    function generateSelect(id, label, options) {
        return `
            <div class="mb-3">
                <label for="${id}" class="form-label">${label}:</label><br>
                <select id="${id}" name="${id}" class="form-control config" required>
                    ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
            </div>
        `;
    }

    formContainer.innerHTML = `
        <form id="configForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
            <div class="mb-3">
                <label for="configName" class="form-label">Konfiguráció neve:</label>
                <br>
                <input type="text" id="configName" name="configName" class="form-control config" required>
            </div>
            ${generateSelect('cpu', 'CPU', options.cpu)}
            ${generateSelect('motherboard', 'Alaplap', options.motherboard)}
            ${generateSelect('ram', 'RAM', options.ram)}
            ${generateSelect('gpu', 'GPU', options.gpu)}
            ${generateSelect('hdd', 'HDD', options.hdd)}
            ${generateSelect('ssd', 'SSD', options.ssd)}
            ${generateSelect('powerSupply', 'Tápegység', options.powerSupply)}
            ${generateSelect('cpuCooler', 'CPU Hűtő', options.cpuCooler)}
            <div class="mb-3">
                <label for="configImage" class="form-label">Kép feltöltése:</label>
                <br>
                <input type="file" id="configImage" name="configImage" class="form-control" accept="image/*" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Feltöltés</button>
        </form>
    `;
}
