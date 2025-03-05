const categories = ['cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'case'];
let selectedParts = {};
const row = document.getElementById('row');

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
        const uniqueProducts = getUniqueProducts(products);
        renderCategories(uniqueProducts);
    } catch (error) {
        console.error('Product fetch failed:', error);
    }
}

function getUniqueProducts(products) {
    return products.filter((product, index, self) =>
        index === self.findIndex((p) => p.product_id === product.product_id)
    );
}

function renderCategories(products) {
    row.innerHTML = '';

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category-section', 'mb-5');
        categoryDiv.innerHTML = `<h3 class="text-center">${category.toUpperCase()}</h3>`;
        row.append(categoryDiv);

        const filteredProducts = products.filter(p => p.category.toLowerCase() === category);

        filteredProducts.forEach(product => {
            const card = createCard(product);
            categoryDiv.append(card);
            createModal(product);
        });
    });
}

function createCard(product) {
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
            <button class="btn btn-primary select-part-btn" data-category="${product.category}" data-product-id="${product.product_id}">Kiválaszt</button>
        </div>
    `;

    card.querySelector('.select-part-btn').addEventListener('click', () => {
        selectPart(product);
    });

    return card;
}

function selectPart(product) {
    selectedParts[product.category] = product;
    console.log('Selected parts:', selectedParts);
    renderSummary();
}

function renderSummary() {
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `<h4>Összesített gép</h4>`;
    categories.forEach(category => {
        if (selectedParts[category]) {
            const product = selectedParts[category];
            const item = document.createElement('p');
            item.textContent = `${category.toUpperCase()}: ${product.product_name} - ${product.price} Ft`;
            summaryDiv.append(item);
        }
    });
}

document.getElementById('buildOrderBtn').addEventListener('click', async () => {
    const cartItems = Object.values(selectedParts).map(p => ({
        productId: p.product_id
    }));

    try {
        const response = await fetch('https://nodejs312.dszcbaross.edu.hu/api/cart/takeProduct', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
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
});
