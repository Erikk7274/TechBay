const btnPreBuilt = document.querySelector('.btnPreBuilt');
const btnHardware = document.querySelector('.btnHardware');
const btnLogout = document.querySelector('.btnLogout');
const row = document.getElementById('row');

// DOMContentLoaded event handler
window.addEventListener('DOMContentLoaded', () => {
    initialize();
});

async function initialize() {
    try {
        await getProducts();
        setUpButtonListeners();
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

// Fetch products from API
async function getProducts() {
    try {
        const response = await fetch('https://nodejs312.dszcbaross.edu.hu/api/getProducts/getProducts_all', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const products = await response.json();
        console.log('Fetched products:', products);

        const uniqueProducts = getUniqueProducts(products);
        renderProducts(uniqueProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Get unique products by product_id
function getUniqueProducts(products) {
    return products.filter((product, index, self) =>
        index === self.findIndex((p) => p.product_id === product.product_id)
    );
}

// Render products on the page
function renderProducts(products) {
    row.innerHTML = ''; // Clear previous content

    products.forEach(product => {
        const cardDiv = createCard(product);
        row.append(cardDiv);
        createModal(product);
    });
}

// Create product card
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

// Create card header
function createCardHeader(product) {
    const cardHeaderDiv = document.createElement('div');
    cardHeaderDiv.classList.add('card-header', 'text-center', 'fw-bold');
    cardHeaderDiv.textContent = product.product_name;
    return cardHeaderDiv;
}

// Create card body
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

// Create card footer
function createCardFooter(product) {
    const cardFooterDiv = document.createElement('div');
    cardFooterDiv.classList.add('card-footer', 'text-center');

    const inStockSpan = document.createElement('span');
    inStockSpan.textContent = `In Stock: ${product.in_stock}`;
    inStockSpan.classList.add('d-block', 'mb-2');

    const priceSpan = document.createElement('span');
    priceSpan.textContent = product.price ? `Price: ${product.price} Ft` : 'Price: N/A';
    priceSpan.classList.add('d-block', 'mb-2');

    const detailsButton = document.createElement('button');
    detailsButton.classList.add('btn', 'btn-primary', 'btn-sm');
    detailsButton.textContent = 'Details';
    detailsButton.setAttribute('data-bs-toggle', 'modal');
    detailsButton.setAttribute('data-bs-target', `#modal-${product.product_id}`);

    cardFooterDiv.append(inStockSpan, priceSpan, detailsButton);

    return cardFooterDiv;
}

// Create modal for the product
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
                    <p><strong>In Stock:</strong> ${product.in_stock}</p>
                    <p><strong>Price:</strong> ${product.price ? `${product.price} Ft` : 'N/A'}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary add-to-cart-btn" data-product-id="${product.product_id}" data-bs-dismiss="modal">Add to Cart</button>
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

// Set up button event listeners
function setUpButtonListeners() {
    if (btnPreBuilt) {
        btnPreBuilt.addEventListener('click', () => {
            console.log('Navigating to preBuilt.html');
            window.location.href = 'https://erikk7274.github.io/TechBay/preBuilt.html';
        });
    }

    if (btnHardware) {
        btnHardware.addEventListener('click', () => {
            console.log('Navigating to hardware.html');
            window.location.href = 'https://erikk7274.github.io/TechBay/hardware.html';
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            console.log('Logging out, navigating to index.html');
            window.location.href = 'https://erikk7274.github.io/TechBay/index.html';
        });
    }
}

// Add product to cart
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
            console.log('Product added to cart:', result);
        } else {
            console.error('Error adding product to cart:', result);
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
}
