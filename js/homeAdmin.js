window.addEventListener('DOMContentLoaded', () => {
    getProducts();
    setupEventListeners();
});

function setupEventListeners() {
    const btnPreBuilt = document.querySelector('.btnPreBuilt');
    const btnLogout = document.querySelector('.icon-logout');
    const btnAddProducts = document.querySelector('.icon-add');

    if (btnPreBuilt) {
        btnPreBuilt.addEventListener('click', () => {
            window.location.href = 'https://techbay2.netlify.app/preBuiltAdmin.html';
        });
    } else {
        console.error('Nem található btnPreBuilt elem.');
    }

    if (btnAddProducts) {
        btnAddProducts.addEventListener('click', () => {
            window.location.href = 'https://techbay2.netlify.app/uploadProducts.html';
        });
    } else {
        console.error('Nem található az UploadProducts.');
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
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}

function renderProducts(products) {
    const row = document.getElementById('row');
    if (!row) {
        console.error('Nem található a row elem.');
        return;
    }

    row.innerHTML = '';
    clearModals();

    products.forEach(product => {
        const cardDiv = createCard(product);
        row.append(cardDiv);
        createModal(product);
    });
}

function clearModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.remove());
}

function createCard(product) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'm-2', 'p-2', 'shadow-sm');
    cardDiv.style.width = '18rem';
    cardDiv.style.minHeight = '20rem';

    cardDiv.innerHTML = `
        <div class="card-header text-center fw-bold">${product.product_name}</div>
        <div class="card-body text-center">
            <img src="/api/uploads/${product.product_pic}" class="img-fluid mb-3" alt="${product.product_name}" style="max-height: 230px; object-fit: contain;">
        </div>
        <div class="card-footer text-center">
            <span class="d-block mb-2">Ár: ${product.price ? product.price + ' Ft' : 'N/A'}</span>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal-${product.product_id}">Részletek</button>
            <button class="btn btn-danger btn-sm delete-product-btn" data-product-id="${product.product_id}">Törlés</button>
            <div class="form-check form-switch">
                <input class="form-check-input product-status-switch" type="checkbox" role="switch" id="switch-${product.product_id}" ${product.is_active ? 'checked' : ''} data-product-id="${product.product_id}">
                <label class="form-check-label" for="switch-${product.product_id}">Inaktív</label>
            </div>
        </div>
    `;

    // Add event listener for the delete button
    cardDiv.querySelector('.delete-product-btn').addEventListener('click', () => deleteProduct(product.product_id));

    // Add event listener for the status switch
    const statusSwitch = cardDiv.querySelector('.product-status-switch');
    statusSwitch.addEventListener('change', (event) => toggleProductStatus(event, product.product_id));

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
                    <h5 class="modal-title" id="modalLabel-${product.product_id}">${product.product_name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="/api/uploads/${product.product_pic}" alt="${product.product_name}" class="img-fluid mb-3" style="max-height: 400px; object-fit: contain;">
                    <p><strong>Ár:</strong> ${product.price ? product.price + ' Ft' : 'N/A'}</p>
                    <p><strong>Raktáron:</strong> ${product.in_stock}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary add-to-cart-btn" data-product-id="${product.product_id}" data-bs-dismiss="modal">Hozzáadás</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);
    modalDiv.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product.product_id));
}

async function addToCart(productId) {
    try {
        const response = await fetch('/api/cart/takeProduct', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ productId }),
            credentials: 'include',
        });

        const result = await response.json();
        if (response.ok) {
            console.log('Termék hozzáadva:', result);
        } else {
            console.error('Hiba:', result);
        }
    } catch (error) {
        console.error('Hiba a kosárba helyezéskor:', error);
    }
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

async function toggleProductStatus(event, productId) {
    const isChecked = event.target.checked;
    
    try {
        const response = await fetch(`/api/updateProductStatus/${productId}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ is_active: isChecked }),
            credentials: 'include',
        });

        if (response.ok) {
            console.log(`Termék ${isChecked ? 'aktív' : 'inaktív'} lett.`);
        } else {
            const result = await response.json();
            alert('Hiba a státusz frissítésekor: ' + result.message);
        }
    } catch (error) {
        console.error('Hiba a státusz frissítésekor:', error);
    }
}
