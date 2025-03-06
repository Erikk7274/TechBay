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

        console.log(`Lekért termékek:`, products);

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
        <div class="card" style="width: 300px; height: 400px; display: flex; flex-direction: column; justify-content: space-between; align-items: center;">
            <div class="pic-div" style="display: flex; justify-content: center; align-items: center; width: 100%; height: 200px;">
                <img src='/api/uploads/${product.product_pic}' alt="${product.product_name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div class="card-header">${product.product_name}</div>
            <div class="card-body" style="text-align: center; width: 100%;">
                <p>${product.price} Ft</p>
            </div>
            <div style="width: 100%; display: flex; justify-content: center; padding-bottom: 10px;">
                <button class="btn btn-primary btn-add-to-cart">Add to Cart</button>
            </div>
        </div>
        `;
    });

    row.innerHTML = html;
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
