// Selecting necessary elements
const btnBack = document.querySelector('.btnBack');
const orderBtn = document.getElementById('order-btn');
const cartItemsContainer = document.getElementById('cart-items');
const modalBody = document.getElementById('modalBody');
const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
const confirmOrderBtn = document.getElementById('confirmOrderBtn');

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', init);

async function init() {
    await loadCart();
    setUpButtonListeners();
}

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

// Load cart data and render items
async function loadCart() {
    try {
        console.log('Loading cart...');
        const response = await fetch('/api/cart/getCart', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
        }

        const cart = await response.json();
        console.log('Cart items:', cart);

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">A kosár üres</p>';
        } else {
            renderCartItems(cart);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cartItemsContainer.innerHTML = '<p class="text-center">Hiba a kosár betöltésekor.</p>';
    }
}

// Render cart items dynamically
function renderCartItems(cart) {
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
    setUpRemoveButtons();
}

// Set up event listeners for the remove item buttons
function setUpRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.closest('.card').getAttribute('data-id');
            await removeItemFromCart(productId);
        });
    });
}

// Remove an item from the cart
async function removeItemFromCart(productId) {
    try {
        const response = await fetch(`/api/cart/removeProduct/${productId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to remove item from cart');
        }

        console.log(`Item with ID ${productId} removed.`);
        await loadCart(); // Reload the cart after removal
    } catch (error) {
        console.error('Error removing item from cart:', error);
        alert('Hiba a termék eltávolításakor.');
    }
}

// Handle the order button click
orderBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/cart/getCart', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cart details for order');
        }

        const cart = await response.json();
        if (cart.length === 0) {
            alert('A kosár üres!');
            return;
        }

        renderOrderModal(cart);
        orderModal.show();
    } catch (error) {
        console.error('Error fetching cart for order:', error);
        alert('Hiba a rendelési adatok betöltésekor.');
    }
});

// Render the order details in the modal
function renderOrderModal(cart) {
    modalBody.innerHTML = cart.map(item => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${item.product_name}</h5>
                <p class="card-text">Ár: ${item.price.toLocaleString()} Ft</p>
                <p class="card-text">Mennyiség: ${item.quantity}</p>
            </div>
        </div>
    `).join('');
}

// Handle order confirmation
confirmOrderBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/cart/order', {
            method: 'POST',
            credentials: 'include'
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to place order');
        }

        alert('Sikeres rendelés!');
        cartItemsContainer.innerHTML = '<p class="text-center">A kosár üres</p>';
        orderModal.hide();
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Hiba a rendelés leadásakor.');
    }
});

// Set up back button listener
function setUpButtonListeners() {
    btnBack?.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/home.html';
    });
}
