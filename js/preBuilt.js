const btnPreBuilt = document.querySelector('.btnPreBuilt');
const btnHardware = document.querySelector('.btnHardware');
const btnLogout = document.querySelector('.btnLogout');
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

async function getProducts() {
    try {
        const response = await fetch('https://nodejs312.dszcbaross.edu.hu/api/getProducts/getConfig_active', {
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
        <div class="card-header text-center fw-bold">${product.config_name}</div>
        <div class="card-body text-center">
            <img src="https://nodejs312.dszcbaross.edu.hu/uploads/${product.product_pic}" class="img-fluid mb-3" alt="${product.config_name}">
        </div>
        <div class="card-footer text-center">
            <span class="d-block mb-2">Raktáron: ${product.in_stock}</span>
            <span class="d-block mb-2">Ár: ${product.price ? product.price + ' Ft' : 'N/A'}</span>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal-${product.product_id}">Részletek</button>
        </div>
    `;

    return cardDiv;
}

//asdasdsasd

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
                    <h5 class="modal-title" id="modalLabel-${product.product_id}">${product.config_name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="https://nodejs312.dszcbaross.edu.hu/uploads/${product.product_pic}" alt="${product.config_name}" class="img-fluid mb-3">
                    <p><strong>Raktáron:</strong> ${product.in_stock}</p>
                    <p><strong>Ár:</strong> ${product.price ? `${product.price} Ft` : 'N/A'}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary add-to-cart-btn" data-product-id="${product.product_id}" data-bs-dismiss="modal">Kosárba</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);

    modalDiv.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product.product_id));
}

function setUpButtonListeners() {
    btnPreBuilt?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/preBuilt.html');
    btnHardware?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/hardware.html');
    btnLogout?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/index.html');
}

async function addToCart(productId) {
    try {
        const response = await fetch('https://nodejs312.dszcbaross.edu.hu/api/cart/takeProduct', {
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
