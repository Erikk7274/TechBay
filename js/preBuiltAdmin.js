window.addEventListener('DOMContentLoaded', () => {
    getProducts();
    setupEventListeners();
});

function setupEventListeners() {
    const btnLogout = document.querySelector('.icon-logout');
    const btnBack = document.querySelector('.btnBack');

    // Vissza gomb eseménykezelő
    btnBack?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/homeAdmin.html');

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

// Termékek lekérése az API-ból
async function getProducts() {
    try {
        const response = await fetch(`/api/getProducts/getConfig_active`, {
            method: 'GET',
            credentials: 'include'
        });
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}

// Termékek kirajzolása az oldalra
function renderProducts(products) {
    const row = document.getElementById('row');
    if (!row) {
        console.error('Nem található a row elem.');
        return;
    }

    row.innerHTML = ''; // Korábbi termékek törlése
    clearModals(); // Modalok törlése

    products.forEach(product => {
        const cardDiv = createCard(product);
        row.append(cardDiv);
        createModal(product);
    });
}

// Korábbi modal ablakok törlése
function clearModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.remove());
}

// Egy adott termék kártyájának létrehozása
function createCard(product) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'm-2', 'p-2', 'shadow-sm');
    cardDiv.style.width = '18rem';
    cardDiv.style.minHeight = '20rem';

    cardDiv.innerHTML = `
        <div class="card-header text-center fw-bold">${product.config_name || product.product_name}</div>
        <div class="card-body text-center">
            <img src="/api/uploads/${product.config_pic}" class="img-fluid mb-3" alt="${product.config_name || product.product_name}" style="max-height: 230px; object-fit: contain;">
        </div>
        <div class="card-footer text-center">
            <span class="d-block mb-2">Ár: ${product.price ? product.price + ' Ft' : 'N/A'}</span>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal-${product.pc_id}">Részletek</button>
            <button class="btn btn-danger btn-sm delete-product-btn" data-product-id="${product.pc_id}">Törlés</button>
        </div>
    `;

    // Törlés gomb eseménykezelője
    cardDiv.querySelector('.delete-product-btn').addEventListener('click', () => deleteProduct(product.pc_id));

    return cardDiv;
}

// Egy adott termék modal ablakának létrehozása
function createModal(product) {
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal', 'fade');
    modalDiv.id = `modal-${product.pc_id}`;
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('aria-labelledby', `modalLabel-${product.pc_id}`);
    modalDiv.setAttribute('aria-hidden', 'true');

    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg" style="max-width:500px">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel-${product.pc_id}">${product.config_name || product.product_name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="/api/uploads/${product.config_pic}" alt="${product.config_name || product.product_name}" class="img-fluid mb-3" style="max-height: 400px; object-fit: contain;">
                    <p><strong>Ár:</strong> ${product.price ? product.price + ' Ft' : 'N/A'}</p>
                    <p><strong>Raktáron:</strong> ${product.in_stock}</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);
}

// Termék törlése az API-ból
async function deleteProduct(pc_id) {
    if (!confirm('Biztosan törölni szeretnéd ezt a terméket?')) {
        return;
    }

    try {
        const response = await fetch(`/api/delete/deleteConfig/${pc_id}`, {  
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pc_id }),  
            credentials: 'include'
        });

        if (response.ok) {
            alert('Termék sikeresen törölve.');
            getProducts();  // Frissítjük a terméklistát
        } else {
            const result = await response.json();
            alert('Hiba a törlés során: ' + result.message);
        }
    } catch (error) {
        console.error('Hiba a termék törlésekor:', error);
    }
}
