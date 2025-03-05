window.addEventListener('DOMContentLoaded', getProducts);

// Gombok lekérése
const btnPreBuilt = document.querySelector('.btnPreBuilt');
const btnHardware = document.querySelector('.btnHardware');
const btnLogout = document.querySelector('.btnLogout');

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

        console.log(`Lekért termékek:`, products);

        //renderCategory(category, result);
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}


function renderProducts(products) {
    console.log(products);
    let html = `<h2>asdsad</h2><div class="products">`;
    products.forEach(product => {
        console.log(product);
        html += `
        <div class="product">
            <img src='/uploads/${product.product_pic}' alt="${product.product_name}" />
            <h3>${product.product_name}</h3>
            <p>${product.price}</p>
        </div>
    `;
    });

    html += '</div>';

    console.log(html);

    row.innerHTML = html;
}
/*
// Kategória renderelése
function renderCategory(category, products) {
    if (!categoryContainer) {
        console.error(`Category container for ${category} not found!`);
        return;
    }

    let html = `<h2>${category}</h2><div class="products">`;

    products.forEach(product => {
        html += `
            <div class="product">
                <img src="${product.image_url}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>${product.price}</p>
            </div>
        `;
    });

    html += '</div>';

    categoryContainer.innerHTML = html;
}

// Kategóriák inicializálása
function initialize() {
    // Gombok események
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

    // Kategóriák betöltése
    getProducts('getProducts_cpus');
    getProducts('getProducts_motherboards');
    getProducts('getProducts_houses');
    getProducts('getProducts_gpus');
    getProducts('getProducts_rams');
    getProducts('getProducts_powersupplys');
    getProducts('getProducts_hdds');
    getProducts('getProducts_ssds');
    getProducts('getProducts_cpucoolers');
}

// Inicializálás meghívása
initialize();
*/