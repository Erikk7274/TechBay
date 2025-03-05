window.addEventListener('DOMContentLoaded', getProducts);

// Gombok lekérése
const btnPreBuilt = document.querySelector('.btnPreBuilt');
const btnHardware = document.querySelector('.btnHardware');
const btnLogout = document.querySelector('.btnLogout');

// Kategóriák elemeinek lekérése
const row = document.getElementById('row');

// Termékek lekérése
async function getProducts(endpoint = 'getProducts_all') {
    try {
        const response = await fetch(`/api/getProducts/${endpoint}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Hiba történt a termékek lekérésekor');
        }

        const products = await response.json();
        console.log(products);

        renderProducts(products);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}

function renderProducts(products) {
    let html = '<div class="products">';
    
    products.forEach(product => {
        html += `
            <div class="product-card">
                <img src='/uploads/${product.product_pic}' alt="${product.product_name}" class="product-image" />
                <h3 class="product-name">${product.product_name}</h3>
                <p class="product-price">${product.price} Ft</p>
            </div>
        `;
    });

    html += '</div>';
    row.innerHTML = html;
}

// Button click event listeners
btnPreBuilt.addEventListener('click', () => {
    getProducts('getProducts_preBuilt');
});

btnHardware.addEventListener('click', () => {
    getProducts('getProducts_hardware');
});

btnLogout.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.reload();
});
