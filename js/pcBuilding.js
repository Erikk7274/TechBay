window.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    getProducts();
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
    try {
        const response = await fetch(`/api/getProducts/getConfig_active`, {
            method: 'GET',
            credentials: 'include'
        });
        const products = await response.json();
        renderConfigForm(products);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}

function renderConfigForm(products) {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
        <form id="configForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
            <div class="mb-3">
                <label for="configName" class="form-label">Konfiguráció neve:</label>
                <input type="text" id="configName" name="configName" class="form-control" required>
            </div>
            ${createDropdown('cpu', 'CPU', products.cpu)}
            ${createDropdown('motherBoard', 'Alaplap', products.motherBoard)}
            ${createDropdown('ram', 'RAM', products.ram)}
            ${createDropdown('gpu', 'GPU', products.gpu)}
            ${createDropdown('hdd', 'HDD', products.hdd)}
            ${createDropdown('ssd', 'SSD', products.ssd)}
            ${createDropdown('powerSupply', 'Tápegység', products.powerSupply)}
            ${createDropdown('cpuCooler', 'CPU Hűtő', products.cpuCooler)}
            <button type="submit" class="btn btn-primary w-100">Kosárba</button>
        </form>
    `;

    document.getElementById("configForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("config_name", document.getElementById("configName").value);
        formData.append("cpu", document.getElementById("cpu").value);
        formData.append("mother_board", document.getElementById("motherBoard").value);
        formData.append("ram", document.getElementById("ram").value);
        formData.append("gpu", document.getElementById("gpu").value);
        formData.append("hdd", document.getElementById("hdd").value);
        formData.append("ssd", document.getElementById("ssd").value);
        formData.append("power_supply", document.getElementById("powerSupply").value);
        formData.append("cpu_cooler", document.getElementById("cpuCooler").value);
        formData.append("in_stock", "1");
        formData.append("cat_id", "2");
        formData.append("sale", "0");
        formData.append("active", "1");

        const response = await fetch("/api/cart/takeProduct", {
            method: "POST",
            body: formData,
            credentials: "include"
        });

        if (response.ok) {
            alert("Sikeres hozzáadás a kosárhoz!");
            document.getElementById("configForm").reset();
        } else {
            const errorData = await response.json();
            alert(`Hiba történt: ${errorData.message || "Ismeretlen hiba"}`);
        }
    });
}

function createDropdown(id, label, items) {
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