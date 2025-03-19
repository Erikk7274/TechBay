const btnHardware = document.querySelector('.btnHardware');
const btnLogout = document.querySelector('.btnLogout');
const btnBack = document.querySelector('.btnBack');
const row = document.getElementById('row');

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const products = await getProducts();
        renderProducts(products);
        setUpButtonListeners();
    } catch (error) {
        console.error('Inicializálás sikertelen:', error);
    }
});

async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });
    if (res.ok) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        alert('Sikeres kijelentkezés');
        window.location.href = '../index.html';
    } else {
        alert('Hiba a kijelentkezéskor');
    }
}

async function getProducts() {
    try {
        const response = await fetch('/api/getProducts/getConfig_active', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Nem sikerült lekérni a termékeket');

        return await response.json();
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
        return [];
    }
}

function renderProducts(products) {
    row.innerHTML = '';
    products.forEach(product => {
        const cardDiv = createCard(product);
        row.append(cardDiv);
        createModal(product);
    });
}

function createCard(product) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'm-3', 'p-2', 'shadow-sm');
    cardDiv.style.width = '18rem';

    // Helyes változó használata a képhez
    const productPic = product.product_pic ? `/uploads/${product.product_pic}` : '/uploads/1.jpg';

    cardDiv.innerHTML = `
        <div class="card-header text-center fw-bold">${product.config_name || product.product_name}</div>
        <div class="card-body text-center">
            <img src="${productPic}" class="img-fluid mb-3" alt="${product.config_name || product.product_name}">
        </div>
        <div class="card-footer text-center">
            <span class="d-block mb-2">Raktáron: ${product.in_stock}</span>
            <span class="d-block mb-2">Ár: ${product.price ? product.price + ' Ft' : 'N/A'}</span>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal-${product.product_id}">Részletek</button>
            <button class="btn btn-danger btn-sm mt-2" data-id="${product.product_id}" onclick="deleteProduct(event)">Törlés</button>
        </div>
    `;

    return cardDiv;
}

function createModal(product) {
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal', 'fade');
    modalDiv.id = `modal-${product.product_id}`;
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('aria-labelledby', `modalLabel-${product.product_id}`);
    modalDiv.setAttribute('aria-hidden', 'true');

    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg" style="max-width:500px">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel-${product.product_id}">${product.config_name || product.product_name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="/uploads/${product.product_pic}" alt="${product.config_name || product.product_name}" class="img-fluid mb-3">
                    <p><strong>Raktáron:</strong> ${product.in_stock}</p>
                    <p><strong>Ár:</strong> ${product.price ? `${product.price} Ft` : 'N/A'}</p>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);
}

async function deleteProduct(event) {
    const productId = event.target.getAttribute('data-id');
    
    if (!productId) {
        console.error('Termék ID hiányzik');
        alert('Nem található termék ID.');
        return;
    }
    
    try {
        // API végpont módosítása
        const response = await fetch(`/api/delete/deleteConfig/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Nem sikerült törölni a terméket');

        // Ha a törlés sikerült, frissítjük a termékek listáját
        alert('A termék sikeresen törlésre került.');
        window.location.reload();  // Újratöltjük az oldalt, hogy frissüljön a lista
    } catch (error) {
        console.error('Hiba a törléskor:', error);
        alert('Hiba történt a termék törlésekor.');
    }
}

function setUpButtonListeners() {
    if (btnBack) {
        btnBack.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/homeAdmin.html');
    }
    if (btnLogout) {
        btnLogout.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/index.html');
    }
}
