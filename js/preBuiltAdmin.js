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
btnLogout.addEventListener('click', logout);
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

    cardDiv.innerHTML = `
        <div class="card-header text-center fw-bold">${product.config_name || product.product_name}</div>
        <div class="card-body text-center">
            <img src="/uploads/${product.product_pic}" class="img-fluid mb-3" alt="${product.config_name || product.product_name}">
        </div>
        <div class="card-footer text-center">
            <span class="d-block mb-2">Raktáron: ${product.in_stock}</span>
            <span class="d-block mb-2">Ár: ${product.price ? product.price + ' Ft' : 'N/A'}</span>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal-${product.pc_id}">Részletek</button>
            <button class="btn btn-danger btn-sm delete-product-btn" data-product-id="${product.pc_id}">Törlés</button>
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

async function deleteProduct(productId) {
    if (!confirm('Biztosan törölni szeretnéd ezt a terméket?')) {
        return;
    }

    try {
        const response = await fetch(`/api/delete/deleteProduct/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
            body: JSON.stringify({ productId }),
            credentials: 'include',
        });

        if (response.ok) {
            alert('Termék sikeresen törölve.');
            getProducts();
        } else {
            const result = await response.json();
            alert('Hiba a törlés során: ' + result.message);
        }
    } catch (error) {
        console.error('Hiba a termék törlésekor:', error);
    }
}




function setUpButtonListeners() {
    btnBack?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/homeAdmin.html');
    btnLogout?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/index.html');
    btnBack?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/homeAdmin.html');
}
