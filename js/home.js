const btnPreBuilt = document.querySelector('.btnPreBuilt');
const btnHardware = document.querySelector('.btnHardware');
const btnLogout = document.querySelector('.btnLogout');
const row = document.getElementById('row');
const summaryDiv = document.getElementById('summary');
const buildOrderBtn = document.getElementById('buildOrderBtn');

const endpoints = {
    cpu: '/api/getProducts/getProducts_cpus',
    gpu: '/api/getProducts/getProducts_gpus',
    ram: '/api/getProducts/getProducts_rams',
    motherboard: '/api/getProducts/getProducts_motherboards',
    storage: '/api/getProducts/getProducts_ssds',
    hdd: '/api/getProducts/getProducts_hdds',
    psu: '/api/getProducts/getProducts_powersupplys',
    case: '/api/getProducts/getProducts_houses',
    cooler: '/api/getProducts/getProducts_cpucoolers'
};

let selectedParts = {};

window.addEventListener('DOMContentLoaded', () => {
    initialize();
});

async function initialize() {
    try {
        await getProducts();
        setUpButtonListeners();
        if (buildOrderBtn) {
            buildOrderBtn.addEventListener('click', buildOrder);
        }
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

async function getProducts() {
    row.innerHTML = ''; // Töröljük a tartalmat, mielőtt újra betöltjük

    for (const category in endpoints) {
        try {
            const response = await fetch(`https://nodejs312.dszcbaross.edu.hu${endpoints[category]}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const products = await response.json();
                console.log(`Lekért termékek (${category}):`, products);

                if (products && products.length > 0) {
                    renderCategory(category, products);
                } else {
                    console.log(`Nincs termék a(z) ${category} kategóriában.`);
                }
            } else {
                console.log(`Hiba a(z) ${category} API végponton.`);
            }
        } catch (error) {
            console.error(`Hiba a(z) ${category} termékek betöltésekor:`, error);
        }
    }
}

function renderCategory(category, products) {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category-section', 'mb-5');
    categoryDiv.innerHTML = `<h3 class="text-center">${category.toUpperCase()}</h3>`;
    row.append(categoryDiv);

    products.forEach(product => {
        const card = createCard(product, category);
        categoryDiv.append(card);
        createModal(product);
    });
}

function createCard(product, category) {
    const card = document.createElement('div');
    card.classList.add('card', 'm-3', 'p-2', 'shadow-sm');
    card.style.width = '18rem';

    card.innerHTML = `
        <div class="card-header text-center fw-bold">${product.product_name}</div>
        <div class="card-body text-center">
            <img src="https://nodejs312.dszcbaross.edu.hu/uploads/${product.product_pic}" class="img-fluid mb-3" alt="${product.product_name}">
        </div>
        <div class="card-footer text-center">
            <span class="d-block mb-2">Ár: ${product.price} Ft</span>
            <button class="btn btn-primary select-part-btn" data-category="${category}" data-product-id="${product.product_id}">Kiválaszt</button>
        </div>
    `;

    card.querySelector('.select-part-btn').addEventListener('click', () => {
        selectPart(product, category);
    });

    return card;
}

function selectPart(product, category) {
    selectedParts[category] = product;
    console.log(`Kiválasztott alkatrészek:`, selectedParts);
    renderSummary();
}

function renderSummary() {
    summaryDiv.innerHTML = `<h4>Összesített gép</h4>`;
    let total = 0;

    for (const category in selectedParts) {
        const product = selectedParts[category];
        const item = document.createElement('p');
        item.textContent = `${category.toUpperCase()}: ${product.product_name} - ${product.price} Ft`;
        summaryDiv.append(item);
        total += product.price;
    }

    const totalElement = document.createElement('p');
    totalElement.classList.add('fw-bold');
    totalElement.textContent = `Végösszeg: ${total} Ft`;
    summaryDiv.append(totalElement);
}

async function buildOrder() {
    const cartItems = Object.values(selectedParts).map(p => ({
        productId: p.product_id
    }));

    try {
        const response = await fetch('https://nodejs312.dszcbaross.edu.hu/api/cart/takeProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItems),
            credentials: 'include'
        });

        if (response.ok) {
            console.log('Order placed successfully');
            alert('Gép sikeresen kosárba helyezve!');
        } else {
            console.error('Order failed');
        }
    } catch (error) {
        console.error('Order failed:', error);
    }
}

function setUpButtonListeners() {
    if (btnPreBuilt) {
        btnPreBuilt.addEventListener('click', () => {
            window.location.href = 'https://techbay2.netlify.app/preBuilt.html';
        });
    }

    if (btnHardware) {
        btnHardware.addEventListener('click', () => {
            window.location.href = 'https://techbay2.netlify.app/hardware.html';
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            window.location.href = 'https://techbay2.netlify.app/index.html';
        });
    }
}
