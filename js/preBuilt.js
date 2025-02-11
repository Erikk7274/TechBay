// Gombok deklarálása
const buttons = {
    preBuilt: document.querySelector('.btnPreBuilt'),
    hardware: document.querySelector('.btnHardware'),
    logout: document.querySelector('.btnLogout'),
    back: document.querySelector('.btnBack')
};

// DOM betöltődés eseménykezelője
window.addEventListener('DOMContentLoaded', () => {
    getProducts();
    setupButtonHandlers();
});

// Vissza gomb eseménykezelője
if (buttons.back) {
    buttons.back.addEventListener('click', () => {
        window.location.href = '../home.html';
    });
}

// Gomb eseménykezelők beállítása
function setupButtonHandlers() {
    const buttonActions = {
        preBuilt: '../preBuilt.html',
        hardware: '../hardware.html',
        logout: '../index.html'
    };

    Object.entries(buttonActions).forEach(([key, url]) => {
        if (buttons[key]) {
            buttons[key].addEventListener('click', () => {
                window.location.href = url;
            });
        }
    });
}

// Termékek lekérése
async function getProducts() {
    try {
        const response = await fetch('https://nodejs312.dszcbaross.edu.hu/api/getProducts/getConfig_active', {
            method: 'GET',
            credentials: 'include',
        });
        const products = await response.json();

        const uniqueProducts = products.filter((product, index, self) =>
            index === self.findIndex((p) => p.product_id === product.product_id)
        );

        renderProducts(uniqueProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Termékek megjelenítése
function renderProducts(products) {
    const row = document.getElementById('row');
    row.innerHTML = '';

    products.forEach(product => {
        try {
            const card = createCard(product);
            row.appendChild(card);
            createModal(product);
        } catch (error) {
            console.error('Error rendering product:', product, error);
        }
    });
}

// Kártya létrehozása
function createCard(product) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'm-3', 'p-2', 'shadow-sm');
    cardDiv.style.width = '18rem';

    cardDiv.append(
        createCardHeader(product),
        createCardBody(product),
        createCardFooter(product)
    );

    return cardDiv;
}

// Kártya fejléce
function createCardHeader(product) {
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('card-header', 'text-center', 'fw-bold');
    headerDiv.textContent = product.product_name;
    return headerDiv;
}

// Kártya teste
function createCardBody(product) {
    const bodyDiv = document.createElement('div');
    bodyDiv.classList.add('card-body', 'text-center');

    const image = document.createElement('img');
    image.src = `https://nodejs312.dszcbaross.edu.hu/uploads/${product.config_pic}`;
    image.classList.add('img-fluid', 'mb-3');
    image.alt = product.product_name;

    bodyDiv.appendChild(image);
    return bodyDiv;
}

// Kártya lába
function createCardFooter(product) {
    const footerDiv = document.createElement('div');
    footerDiv.classList.add('card-footer', 'text-center');

    const inStockSpan = document.createElement('span');
    inStockSpan.textContent = `Raktáron: ${product.in_stock}`;
    inStockSpan.classList.add('d-block', 'mb-2');

    const priceSpan = document.createElement('span');
    priceSpan.textContent = product.price ? `Ár: ${product.price} Ft` : 'Ár: N/A';
    priceSpan.classList.add('d-block', 'mb-2');

    const detailsButton = document.createElement('button');
    detailsButton.classList.add('btn', 'btn-primary', 'btn-sm');
    detailsButton.textContent = 'Részletek';
    detailsButton.setAttribute('data-bs-toggle', 'modal');
    detailsButton.setAttribute('data-bs-target', `#modal-${product.config_id}`);

    footerDiv.append(inStockSpan, priceSpan, detailsButton);

    return footerDiv;
}


// Modal létrehozása
function createModal(product) {
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal', 'fade');
    modalDiv.id = `modal-${product.product_id}`;
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('aria-labelledby', `modalLabel-${product.config_id}`);
    modalDiv.setAttribute('aria-hidden', 'true');

    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg" style="max-width:500px">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel-${product.config_id}">${product.config_name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="https://nodejs312.dszcbaross.edu.hu/uploads/${product.config_pic}" alt="${product.config_name}" class="img-fluid mb-3">
                    <p><strong>Raktáron:</strong> ${product.in_stock}</p>
                    <p><strong>Ár:</strong> ${product.price ? `${product.price} Ft` : 'N/A'}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary add-to-cart-btn" data-product-id="${product.config_id}" data-bs-dismiss="modal">Kosárba</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);
}
