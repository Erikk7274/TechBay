window.addEventListener('DOMContentLoaded', getProducts);

// Gombok lekérése
const homeBtn = document.querySelector('.icon-home');
const btnLogout = document.querySelector('.icon-logout');

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

// Termékek megjelenítése
function renderProducts(products) {
    const row = document.getElementById('row');
    row.innerHTML = '';

    products.forEach(product => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'm-2', 'p-2', 'shadow-sm');
        cardDiv.style.width = '18rem';
        cardDiv.style.minHeight = '20rem';

        cardDiv.innerHTML = `
            <div class="card-header text-center fw-bold">${product.product_name}</div>
            <div class="card-body text-center">
                <img src="/api/uploads/${product.product_pic}" class="img-fluid mb-3" alt="${product.product_name}" style="max-height: 230px; object-fit: contain;">
            </div>
            <div class="card-footer text-center">
                <span class="d-block mb-2">Ár: ${product.price ? product.price + ' Ft' : 'N/A'}</span>
            </div>
        `;

        row.append(cardDiv);
    });
}

// Kijelentkezés
btnLogout.addEventListener('click', async () => {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });

    if (res.ok) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        alert('Sikeres kijelentkezés');
        window.location.href = 'https://techbay2.netlify.app/index.html';
    } else {
        alert('Hiba a kijelentkezéskor');
    }
});
