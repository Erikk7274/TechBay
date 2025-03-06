window.addEventListener('DOMContentLoaded', getProducts);

// Gombok lekérése
const btnPreBuilt = document.getElementsByClassName('btnPreBuilt')[0];
const homeBtn = document.getElementsByClassName('icon-home')[0];
const userBtn = document.getElementsByClassName('icon-user')[0];
const cartBtn = document.getElementsByClassName('icon-cart')[0];
const btnLogout = document.getElementsByClassName('icon-logout')[0];

// Kategóriák elemeinek lekérése
const row = document.getElementById('row');

// Termékek lekérése
async function getProducts() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_all`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log(response);
        const products = await response.json();
        console.log(products);

        renderProducts(products);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}

function renderProducts(products) {
    console.log(products);
    let html = '';

    products.forEach(product => {
        html += `
        <div class="card">
            <div class="pic-div">
                <img src='/api/uploads/${product.product_pic}' alt="${product.product_name}">
            </div>
            <div class="card-header">${product.product_name}</div>
            <div class="card-body">
                <p>${product.price} Ft</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary btn-add-to-cart" data-product-id="${product.product_id}" data-bs-toggle="modal" data-bs-target="#modal-${product.product_id}">Add to Cart</button>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="modal-${product.product_id}" tabindex="-1" aria-labelledby="modalLabel-${product.product_id}" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel-${product.product_id}">${product.product_name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="/api/uploads/${product.product_pic}" alt="${product.product_name}" class="img-fluid mb-3">
                        <p><strong>Raktáron:</strong> ${product.in_stock}</p>
                        <p><strong>Ár:</strong> ${product.price ? `${product.price} Ft` : 'N/A'}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary add-to-cart-btn" data-product-id="${product.product_id}" data-bs-dismiss="modal">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    row.innerHTML = html;

    // Attach event listeners for adding products to cart
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

async function addToCart(productId) {
    try {
        // Send a POST request to add the product to the cart
        const response = await fetch('/api/cart/takeProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId }), // Send productId as the body
            credentials: 'include' // Ensure credentials are sent for user authentication
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Termék hozzáadva:', result);
            alert('Product added to cart!');
        } else {
            console.error('Hiba:', result);
            alert('Error adding to cart');
        }
    } catch (error) {
        console.error('Hiba a kosárba helyezéskor:', error);
    }
}

btnLogout.addEventListener('click', logout);

async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
        alert(data.message);
        window.location.href = 'https://techbay2.netlify.app/index.html';
    } else {
        alert('Hiba a kijelentkezéskor');
    }
}

homeBtn.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/home.html';
});

userBtn.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/profile.html';
});

cartBtn.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/cart.html';
});

btnPreBuilt.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/preBuilt.html';
});
