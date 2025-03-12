const btnBack = document.querySelector('.btnBack');
const orderBtn = document.getElementById('order-btn');
const cartItemsContainer = document.getElementById('cart-items');
const modalBody = document.getElementById('modalBody');
const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
const confirmOrderBtn = document.getElementById('confirmOrderBtn');

window.addEventListener('DOMContentLoaded', async () => {
    await loadCart();
    setUpButtonListeners();
});

async function loadCart() {
    try {
        const response = await fetch('/api/cart/getCart', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Hiba a kosár lekérésekor');

        const cart = await response.json();
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">A kosár üres</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="card mb-3" data-id="${item.product_id}">
                    <div class="card-body">
                        <h5 class="card-title">${item.product_name}</h5>
                        <p class="card-text">Ár: ${item.price.toLocaleString()} Ft</p>
                        <p class="card-text">Mennyiség: ${item.quantity}</p>
                        <button class="btn btn-danger btn-sm remove-item">Eltávolítás</button>
                    </div>
                </div>
            `).join('');
        }
        setUpRemoveButtons();
    } catch (error) {
        console.error('Hiba a kosár betöltésekor:', error);
    }
}

function setUpRemoveButtons() {
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', async (event) => {
            const card = event.target.closest('.card');
            const productId = card.getAttribute('data-id');

            try {
                const response = await fetch(`/api/cart/removeItem/${productId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Nem sikerült eltávolítani a terméket');

                card.remove();
                if (cartItemsContainer.innerHTML.trim() === '') {
                    cartItemsContainer.innerHTML = '<p class="text-center">A kosár üres</p>';
                }
            } catch (error) {
                console.error('Hiba a termék eltávolításakor:', error);
            }
        });
    });
}

orderBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/cart/getCart', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Hiba a rendelési adatok lekérésekor');

        const cart = await response.json();
        if (cart.length === 0) {
            alert('A kosár üres!');
            return;
        }

        modalBody.innerHTML = cart.map(item => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${item.product_name}</h5>
                    <p class="card-text">Ár: ${item.price.toLocaleString()} Ft</p>
                    <p class="card-text">Mennyiség: ${item.quantity}</p>
                </div>
            </div>
        `).join('');
        orderModal.show();
    } catch (error) {
        console.error('Hiba a rendelési adatok betöltésekor:', error);
    }
});

confirmOrderBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/cart/order', {
            method: 'POST',
            credentials: 'include'
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Hiba a rendelés leadásakor');

        alert('Sikeres rendelés!');
        cartItemsContainer.innerHTML = '<p class="text-center">A kosár üres</p>';
        orderModal.hide();
    } catch (error) {
        alert(error.message);
        console.error('Hiba a rendelés leadásakor:', error);
    }
});

function setUpButtonListeners() {
    btnBack?.addEventListener('click', () => window.location.href = 'https://techbay2.netlify.app/home.html');
}
