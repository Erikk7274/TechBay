const row = document.getElementById('row'); // A konténer, ahová a kártyák kerülnek

// DOMContentLoaded eseménykezelő
window.addEventListener('DOMContentLoaded', () => {
    initialize();
});

// Inicializálás
async function initialize() {
    try {
        await fetchAndDisplayProducts();
    } catch (error) {
        console.error('Hiba az inicializálás során:', error);
    }
}

// Termékek lekérése és megjelenítése
async function fetchAndDisplayProducts() {
    try {
        const response = await fetch('https://nodejs312.dszcbaross.edu.hu/api/getProducts/getProducts_all', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Nem sikerült lekérni a termékeket');
        }

        const products = await response.json();
        console.log('Lekért termékek:', products);

        const uniqueProducts = getUniqueProducts(products);
        renderProducts(uniqueProducts);
    } catch (error) {
        console.error('Hiba a termékek lekérése során:', error);
    }
}

// Ismétlődő termékek eltávolítása product_id alapján
function getUniqueProducts(products) {
    return products.filter((product, index, self) =>
        index === self.findIndex((p) => p.product_id === product.product_id)
    );
}

// Termékek renderelése
function renderProducts(products) {
    row.innerHTML = ''; // Töröljük a korábbi tartalmat

    products.forEach(product => {
        const cardDiv = createCard(product);
        row.append(cardDiv);
        createModal(product);
    });
}

// Termék kártya létrehozása
function createCard(product) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'm-3', 'p-2', 'shadow-sm');
    cardDiv.style.width = '18rem';

    const cardHeaderDiv = createCardHeader(product);
    const cardBodyDiv = createCardBody(product);
    const cardFooterDiv = createCardFooter(product);

    cardDiv.append(cardHeaderDiv, cardBodyDiv, cardFooterDiv);

    return cardDiv;
}

// Kártya fejlécének létrehozása
function createCardHeader(product) {
    const cardHeaderDiv = document.createElement('div');
    cardHeaderDiv.classList.add('card-header', 'text-center', 'fw-bold');
    cardHeaderDiv.textContent = product.product_name;
    return cardHeaderDiv;
}

// Kártya törzse
function createCardBody(product) {
    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body', 'text-center');

    const picDivImg = document.createElement('img');
    picDivImg.src = `https://nodejs312.dszcbaross.edu.hu/uploads/${product.product_pic}`;
    picDivImg.classList.add('img-fluid', 'mb-3');
    picDivImg.alt = product.product_name;

    cardBodyDiv.append(picDivImg);
    return cardBodyDiv;
}

// Kártya lába
function createCardFooter(product) {
    const cardFooterDiv = document.createElement('div');
    cardFooterDiv.classList.add('card-footer', 'text-center');

    const inStockSpan = document.createElement('span');
    inStockSpan.textContent = `Rendelhető: ${product.in_stock}`;
    inStockSpan.classList.add('d-block', 'mb-2');

    const priceSpan = document.createElement('span');
    priceSpan.textContent = product.price ? `Ár: ${product.price} Ft` : 'Ár: N/A';
    priceSpan.classList.add('d-block', 'mb-2');

    const detailsButton = document.createElement('button');
    detailsButton.classList.add('btn', 'btn-primary', 'btn-sm');
    detailsButton.textContent = 'Részletek';
    detailsButton.setAttribute('data-bs-toggle', 'modal');
    detailsButton.setAttribute('data-bs-target', `#modal-${product.product_id}`);

    cardFooterDiv.append(inStockSpan, priceSpan, detailsButton);

    return cardFooterDiv;
}

// Modális ablak létrehozása
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
                    <img src="https://nodejs312.dszcbaross.edu.hu/uploads/${product.product_pic}" alt="${product.product_name}" class="img-fluid mb-3">
                    <p><strong>Rendelhető:</strong> ${product.in_stock}</p>
                    <p><strong>Ár:</strong> ${product.price ? `${product.price} Ft` : 'N/A'}</p>
                    <p><strong>Kategória:</strong> ${product.category_name}</p>
                    <p><strong>Leírás:</strong> ${product.product_description}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary add-to-cart-btn" data-product-id="${product.product_id}" data-bs-dismiss="modal">Kosárba</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);

    const addToCartBtn = modalDiv.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productId = addToCartBtn.getAttribute('data-product-id');
            addToCart(productId);
        });
    }
}

// Termék hozzáadása a kosárhoz
async function addToCart(productId) {
    try {
        const product = { productId };
        const response = await fetch('https://nodejs312.dszcbaross.edu.hu/api/cart/takeProduct', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(product),
            credentials: 'include',
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Termék hozzáadva a kosárhoz:', result);
        } else {
            console.error('Hiba a termék kosárba helyezése során:', result);
        }
    } catch (error) {
        console.error('Hiba a termék kosárba helyezése során:', error);
    }
}
