window.addEventListener('DOMContentLoaded', getProducts);

// Gombok lekérése
const btnPreBuilt = document.getElementsByClassName('btnPreBuilt')[0];
const btnPcBuilding = document.getElementsByClassName('btnPcBuilding')[0];
const homeBtn = document.getElementsByClassName('icon-home')[0];
const userBtn = document.getElementsByClassName('icon-user')[0];
const cartBtn = document.getElementsByClassName('icon-cart')[0];
const btnLogout = document.getElementsByClassName('icon-logout')[0];

// Kategóriák elemeinek lekérése
const row = document.getElementById('row');
const categorySelect = document.getElementById('categorySelect'); // Dropdown kategória szűrő

// Termékek lekérése
async function getProducts() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_all`, {
            method: 'GET',
            credentials: 'include'
        });
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}

function renderProducts(products) {
    row.innerHTML = '';  // Clear any existing content
    products.forEach(product => {
        const cardDiv = createCard(product);
        row.append(cardDiv);
        createModal(product);
    });
}

function createCard(product) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'm-2', 'p-2', 'shadow-sm');
    cardDiv.style.width = '18rem'; // Card width
    cardDiv.style.height = 'auto'; // Auto height
    cardDiv.style.minHeight = '20rem'; // Minimum height

    cardDiv.innerHTML = `
        <div class="card-header text-center fw-bold">${product.product_name}</div>
        <div class="card-body text-center">
            <img src="/api/uploads/${product.product_pic}" class="img-fluid mb-3" alt="${product.product_name}" style="max-height: 230px; object-fit: contain;"> <!-- Increased max-height -->
        </div>
        <div class="card-footer text-center">
            <span class="d-block mb-2">Ár: ${product.price ? product.price + ' Ft' : 'N/A'}</span>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal-${product.product_id}">Részletek</button>
        </div>
    `;

    return cardDiv;
}

function createModal(product) {
    const imageUrl = product.product_pic ? `/api/uploads/${product.product_pic}` : '/api/uploads/1.jpg';

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
                    <img src="${imageUrl}" alt="${product.product_name}" class="img-fluid mb-3" style="max-height: 400px; object-fit: contain;"> <!-- Increased modal image size -->
                    <p><strong>Ár:</strong> ${product.price ? product.price + ' Ft' : 'N/A'}</p>
                    <p><strong>Raktáron:</strong> ${product.in_stock}</p>
                    <p><strong>Leírás:</strong><br> ${product.product_description}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary add-to-cart-btn" data-product-id="${product.product_id}" data-bs-dismiss="modal">Hozzáadás</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);
}

function setupCategoryFilter() {
    categorySelect.addEventListener('change', async () => {
        const selectedCategory = categorySelect.value;
        try {
            const response = await fetch(`/api/getProducts/getProducts_all`, {
                method: 'GET',
                credentials: 'include'
            });
            const products = await response.json();
            const filteredProducts = selectedCategory === 'all' ? products : products.filter(product => product.cat_id == selectedCategory);
            renderProducts(filteredProducts);
        } catch (error) {
            console.error('Hiba a termékek szűrésében:', error);
        }
    });
}

// Kategória szűrésének inicializálása
setupCategoryFilter();

// Dropdown kategóriák beállítása
function setupCategoryDropdown(categories) {
    categorySelect.innerHTML = '<option value="all">Minden</option>'; // Default "Minden" option
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.cat_id;
        option.textContent = category.cat_name;
        categorySelect.appendChild(option);
    });
}

// Kategóriák lekérése
async function getCategories() {
    try {
        const response = await fetch(`/api/getCategories`, {
            method: 'GET',
            credentials: 'include'
        });
        const categories = await response.json();
        setupCategoryDropdown(categories);
    } catch (error) {
        console.error('Hiba a kategóriák lekérésekor:', error);
    }
}

// Kategóriák inicializálása
getCategories();

btnLogout.addEventListener('click', logout);

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

btnPcBuilding.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/pcBuilding.html';
});
