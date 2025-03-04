const btnBack = document.querySelector('.btnBack');
const orderBtn = document.getElementById('order-btn');
const cartItemsContainer = document.getElementById('cart-items');

window.addEventListener('DOMContentLoaded', async () => {
    await loadCart();
    setUpButtonListeners();
});

async function loadCart() {
    try {
        const response = await fetch('https://nodejs312.dszcbaross.edu.hu/api/cart/getCart', {
            method: 'GET',
            credentials: 'include'
        });

        const cart = await response.json();

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">A kosár üres</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${item.product_name}</h5>
                        <p class="card-text">Ár: ${item.price} Ft</p>
                        <p class="card-text">Mennyiség: ${item.quantity}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Hiba a kosár betöltésekor:', error);
    }
}

orderBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('https://nodejs312.dszcbaross.edu.hu/api/cart/order', {
            method: 'POST',
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            cartItemsContainer.innerHTML = '<p class="text-center">A kosár üres</p>';
        } else {
            alert('Hiba a rendelés leadásakor');
        }
    } catch (error) {
        console.error('Hiba a rendelés leadásakor:', error);
    }
});

function setUpButtonListeners() {
    btnBack?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/home.html');
}