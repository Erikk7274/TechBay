window.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
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

    // Kijelentkezés gomb eseménykezelő
    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    } else {
        console.error('Nem található kijelentkezés gomb.');
    }
}

// Kijelentkezés függvény
async function logout() {
    try {
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (res.ok) {
            // Tokenek törlése
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







// Config form létrehozása
function createConfigForm() {
    formContainer.innerHTML = `
            <form id="configForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
                <div class="mb-3">
                    <label for="configName" class="form-label">Konfiguráció neve:</label>
                    <br>
                    <input type="text" id="configName" name="configName" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="cpu" class="form-label">CPU:</label>
                    <br>
                    <input type="text" id="cpu" name="cpu" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="motherBoard" class="form-label">Alaplap:</label>
                    <br>
                    <input type="text" id="motherBoard" name="motherBoard" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="ram" class="form-label">RAM:</label>
                    <br>
                    <input type="text" id="ram" name="ram" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="gpu" class="form-label">GPU:</label>
                    <br>
                    <input type="text" id="gpu" name="gpu" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="hdd" class="form-label">HDD:</label>
                    <br>
                    <input type="text" id="hdd" name="hdd" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="ssd" class="form-label">SSD:</label>
                    <br>
                    <input type="text" id="ssd" name="ssd" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="powerSupply" class="form-label">Tápegység:</label>
                    <br>
                    <input type="text" id="powerSupply" name="powerSupply" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="cpuCooler" class="form-label">CPU Hűtő:</label>
                    <br>
                    <input type="text" id="cpuCooler" name="cpuCooler" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="configImage" class="form-label">Kép feltöltése:</label>
                    <br>
                    <input type="file" id="configImage" name="configImage" class="form-control" accept="image/*" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Feltöltés</button>
               
            </form>
        `;
}
