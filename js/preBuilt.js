const btnPreBuilt = document.querySelector('.btnPreBuilt');
const btnHardware = document.querySelector('.btnHardware');
const btnLogout = document.querySelector('.btnLogout');
const btnBack = document.querySelector('.btnBack');
const row = document.getElementById('row');

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

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const products = await getProducts();
        renderProducts(products);
        setUpButtonListeners();
    } catch (error) {
        console.error('Inicializálás sikertelen:', error);
    }
});

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

    //ha nincs elérhető:
    if (!products || products.length === 0) {
        row.innerHTML = `
            <div class="w-100 text-center p-5 text-white" id="noProductText">
                <h2>Nincs elérhető termék raktáron!</h2>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        if (!product.product_pic) {
            console.warn(`Hiányzó kép: ${product.pc_name || product.pc_name}`);
        }
        const cardDiv = createCard(product);
        row.append(cardDiv);
        createModal(product);
    });
}

function createCard(product) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'm-3', 'p-2', 'shadow-sm');
    cardDiv.style.width = '18rem';

    let pc_priceHtml = product.sale && product.sale < product.pc_price
        ? `<span class="d-block mb-2" style="text-decoration: line-through;">Ár: ${product.pc_price} Ft</span>`
        : `<span class="d-block mb-2">Ár: ${product.pc_price ? product.pc_price + ' Ft' : 'N/A'}</span>`;

    let saleHtml = product.sale && product.sale < product.pc_price
        ? `<span class="d-block mb-2">Akciós ár: ${product.sale} Ft</span>`
        : '';
    cardDiv.innerHTML = `
        <div class="card-header text-center fw-bold">${product.pc_name || product.product_name}</div>
        <div class="card-body text-center">
            <img src="/api/uploads/${product.pc_pic}" class="img-fluid mb-3" alt="${product.pc_name || product.pc_name}">
        </div>
        <div class="card-footer text-center">
            <span class="d-block mb-2">Raktáron: ${product.in_stock}</span>
            <span class="d-block mb-2">Ár: ${product.pc_price ? product.pc_price + ' Ft' : 'N/A'}</span>

            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal-${product.pc_id}">Részletek</button>
        </div>
    `;

    return cardDiv;
}

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
                    <h5 class="modal-title" id="modalLabel-${product.pc_id}">${product.pc_name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="/api/uploads/${product.pc_pic}" alt="${product.pc_name}" class="img-fluid mb-3">
                    <p><strong>Raktáron:</strong> ${product.in_stock}</p>
                    <p><strong>Ár:</strong> ${product.pc_price ? `${product.pc_pc_price} Ft` : 'N/A'}</p>
                    <p><strong>Leírás:</strong><br> ${product.pc_description}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary add-to-cart-btn" data-product-id="${product.pc_id}" data-bs-dismiss="modal">Kosárba</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);

    modalDiv.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product.pc_id));
}

function setUpButtonListeners() {
    btnPreBuilt?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/preBuilt.html');
    btnHardware?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/hardware.html');
    btnLogout?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/index.html');
    btnBack?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/home.html');
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
        response.ok ? console.log('Termék hozzáadva:', result) : console.error('Hiba:', result);
    } catch (error) {
        console.error('Hiba a kosárba helyezéskor:', error);
    }
}
