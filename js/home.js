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
const formContainer = document.getElementById('formContainer');

// Kategória kiválasztása formcontainer
formContainer.innerHTML = `
    <form id="categoryForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
        <div class="mb-3">
            <label for="category" class="form-label">Válassz egy kategóriát:</label>
            <select id="category" name="category" class="form-select" required>
                <option value="1">Összes</option>
                <option value="6">Processzor</option>
                <option value="7">Alaplap</option>
                <option value="8">Gépház</option>
                <option value="9">Videókártya</option>
                <option value="10">RAM</option>
                <option value="11">Tápegység</option>
                <option value="12">HDD</option>
                <option value="13">SSD</option>
                <option value="14">Processzor hűtő</option>
            </select>
        </div>
    </form>
`;
document.getElementById("category").addEventListener("change", (event) => {
    const categoryId = event.target.value;
    loadProducts(categoryId);
});
//switch a kategoria kivalasztasara
function loadProducts(categoryId) {
    switch (categoryId) {
        case "1":
            getProducts();
            console.log(categoryId);
            break;
        case "6":
            getProducts_cpu();
            console.log(categoryId);
            break;
        case "7":
            getProducts_motherboards();
            console.log(categoryId);
            break;
        case "8":
            getProducts_houses();
            console.log(categoryId);
            break;
        case "9":
            getProducts_gpus();
            console.log(categoryId);
            break;
        case "10":
            getProducts_rams();
            console.log(categoryId);
            break;
        case "11":
            getProducts_powersupplys();
            console.log(categoryId);
            break;
        case "12":
            getProducts_hdds();
            console.log(categoryId);
            break;
        case "13":
            getProducts_ssds();
            console.log(categoryId);
            break;
        case "14":
            getProducts_cpucoolers();
            console.log(categoryId);
            break;
        default:
            console.warn("Nincs megfelelő API ehhez a kategóriához:", categoryId);
            break;
    }
}




async function getProducts() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_all`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}
async function getProducts_cpu() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_cpus`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a CPU termékek lekérésekor:', error);
    }
}
async function getProducts_motherboards() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_motherboards`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba az alaplap termékek lekérésekor:', error);
    }
}
async function getProducts_houses() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_houses`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a gépház termékek lekérésekor:', error);
    }
}
async function getProducts_gpus() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_gpus`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a gpu termékek lekérésekor:', error);
    }
}
async function getProducts_rams() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_rams`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a gpu termékek lekérésekor:', error);
    }
}
async function getProducts_powersupplys() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_powersupplys`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a gpu termékek lekérésekor:', error);
    }
}
async function getProducts_hdds() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_hdds`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a gpu termékek lekérésekor:', error);
    }
}
async function getProducts_ssds() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_ssds`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a gpu termékek lekérésekor:', error);
    }
}
async function getProducts_cpucoolers() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_cpucoolers`, {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a gpu termékek lekérésekor:', error);
    }
}




function renderProducts(products) {
    row.innerHTML = ''; // ez törli a tartalmat
    //ha nincs elérhető:
    if (!products || products.length === 0) {
        row.innerHTML = `
            <div class="w-100 text-center p-5 text-white" id="noProductText">
                <h2>Nincs elérhető termék raktáron!</h2>
            </div>
        `;
        return;
    }

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

    let priceHtml = product.sale && product.sale < product.price
        ? `<span class="d-block mb-2" style="text-decoration: line-through;">Ár: ${product.price} Ft</span>`
        : `<span class="d-block mb-2">Ár: ${product.price ? product.price + ' Ft' : 'N/A'}</span>`;

    let saleHtml = product.sale && product.sale < product.price
        ? `<span class="d-block mb-2">Akciós ár: ${product.sale} Ft</span>`
        : '';

    cardDiv.innerHTML = `
        <div class="card-header text-center fw-bold">${product.product_name || product.product_name}</div>
        <div class="card-body text-center">
            <img src="/api/uploads/${product.product_pic}" class="img-fluid mb-3" alt="${product.product_name || product.product_name}">
        </div>
        <div class="card-footer text-center">
            <span class="d-block mb-2">Raktáron: ${product.in_stock}</span>
            <span class="d-block mb-2">Ár: ${product.price ? product.price + ' Ft' : 'N/A'}</span>
            <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal-${product.product_id}">Részletek</button>
        </div>
    `;
    return cardDiv;
}

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
                    <h5 class="modal-title" id="modalLabel-${product.product_id}">${product.product_name || product.product_name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="/api/uploads/${product.product_pic}" alt="${product.product_name || product.product_name}" class="img-fluid mb-3">
                    <p><strong>Raktáron:</strong> ${product.in_stock}</p>
                    <p><strong>Ár:</strong> ${product.price ? `${product.price} Ft` : 'N/A'}</p>
                    <p><strong>Leírás:</strong><br> ${product.product_description}</p>
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



async function addToCart(productId) {
    try {
        const response = await fetch('/api/cart/takeProduct', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ productId }),
            credentials: 'include',
        });
        const result = await response.json();
        console.log(response.ok ? 'Termék hozzáadva:' : 'Hiba:', result);
    } catch (error) {
        console.error('Hiba a kosárba helyezéskor:', error);
    }
}




btnLogout.addEventListener('click', async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    if (res.ok) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        alert('Sikeres kijelentkezés');
        window.location.href = '../index.html';
    } else {
        alert('Hiba a kijelentkezéskor');
    }
});

btnPreBuilt.addEventListener('click', async () => {
    if (btnPreBuilt) {
        window.location.href = '../preBuilt.html';
    } else {
        alert('A gomb nem található');
    }
});

btnPcBuilding.addEventListener('click', async () => {
    if (btnPreBuilt) {
        window.location.href = '../pcBuilding.html';
    } else {
        alert('A gomb nem található');
    }
});

