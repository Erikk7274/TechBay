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
        console.error('Nem található a vissza gomb.');
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
    try {
        const response = await fetch(`/api/getProducts/getProducts_all`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}

async function getProducts_cpu() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_cpus`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a CPU termékek lekérésekor:', error);
    }
}

async function getProducts_motherboards() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_motherboards`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba az alaplap termékek lekérésekor:', error);
    }
}

async function getProducts_houses() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_houses`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a gépház termékek lekérésekor:', error);
    }
}

async function getProducts_gpus() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_gpus`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a gpu termékek lekérésekor:', error);
    }
}

async function getProducts_rams() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_rams`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a ram termékek lekérésekor:', error);
    }
}

async function getProducts_powersupplys() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_powersupplys`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba az tápegység termékek lekérésekor:', error);
    }
}

async function getProducts_hdds() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_hdds`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a HDD termékek lekérésekor:', error);
    }
}

async function getProducts_ssds() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_ssds`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba az SSD termékek lekérésekor:', error);
    }
}

async function getProducts_cpucoolers() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_cpucoolers`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a CPU hűtők lekérésekor:', error);
    }
}

function renderProducts(products) {
    // This function will render the products to the page
    // Implement as needed
    console.log(products);
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
