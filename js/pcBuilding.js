window.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await getProducts();
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

async function getProducts() {
    const endpoints = {
        cpu: '/api/getProducts_cpus',
        motherBoard: '/api/getProducts_motherboards',
        ram: '/api/getProducts_rams',
        gpu: '/api/getProducts_gpus',
        hdd: '/api/getProducts_hdds',
        ssd: '/api/getProducts_ssds',
        powerSupply: '/api/getProducts_powersupplys',
        cpuCooler: '/api/getProducts_cpucoolers'
    };

    const products = {};

    await Promise.all(Object.entries(endpoints).map(async ([key, url]) => {
        try {
            const response = await fetch(url, { method: 'GET', credentials: 'include' });
            if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Érvénytelen adatstruktúra');
            
            products[key] = data;
        } catch (error) {
            console.error(`Hiba a(z) ${key} lekérésekor:`, error);
            products[key] = [];
        }
    }));

    console.log("Lekért termékek:", products);
    renderConfigForm(products);
}

function renderConfigForm(products) {
    const formContainer = document.getElementById('formContainer');
    if (!formContainer) {
        console.error("Nem található a formContainer elem.");
        return;
    }
    
    formContainer.innerHTML = `
        <form id="configForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
            <div class="mb-3">
                <label for="configName" class="form-label">Konfiguráció neve:</label>
                <input type="text" id="configName" name="configName" class="form-control" required>
            </div>
            ${Object.keys(products).map(key => createDropdown(key, key.toUpperCase(), products[key])).join('')}
            <button type="submit" class="btn btn-primary w-100">Kosárba</button>
        </form>
    `;

    document.getElementById("configForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        try {
            const response = await fetch("/api/cart/takeProduct", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (!response.ok) throw new Error(await response.text());
            
            alert("Sikeres hozzáadás a kosárhoz!");
            event.target.reset();
        } catch (error) {
            alert(`Hiba történt: ${error.message || "Ismeretlen hiba"}`);
        }
    });
}

function createDropdown(id, label, items) {
    if (!Array.isArray(items)) items = [];
    let options = items.map(item => `<option value="${item.id}">${item.name} - ${item.price} Ft</option>`).join('');
    return `
        <div class="mb-3">
            <label for="${id}" class="form-label">${label}:</label>
            <select id="${id}" name="${id}" class="form-control" required>
                ${options}
            </select>
        </div>
    `;
}