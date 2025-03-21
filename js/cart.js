// Selecting necessary elements
const btnBack = document.querySelector('.btnBack');
const orderBtn = document.getElementById('order-btn');
const cartItemsContainer = document.getElementById('cart-items');
const modalBody = document.getElementById('modalBody');
const orderModalElement = document.getElementById('orderModal');
const confirmOrderBtn = document.getElementById('confirmOrderBtn');

let orderModal = orderModalElement ? new bootstrap.Modal(orderModalElement) : null;

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    await loadCart();
    setUpButtonListeners();
}

// Logout function
async function logout() {
    try {
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
            throw new Error('Hiba a kijelentkezéskor');
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Load cart data and render items
async function loadCart() {
    try {
        console.log('Loading cart...');
        const response = await fetch('/api/cart/myCart', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
        }

        const cart = await response.json();
        console.log('Cart items:', cart);

        if (Array.isArray(cart) && cart.length > 0) {
            cartItemsContainer.innerHTML = renderCartItems(cart);
            setUpRemoveButtons();
        } else {
            cartItemsContainer.innerHTML = '<p class="text-center">A kosár üres</p>';
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cartItemsContainer.innerHTML = `<p class="text-center">Hiba a kosár betöltésekor: ${error.message}</p>`;
    }
}

// Render cart items dynamically
function renderCartItems(cart) {
    return cart.map(item => `
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

// Set up event listeners for the remove item buttons
function setUpRemoveButtons() {
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.closest('.card').dataset.id;
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
        await loadCart(); // Frissítjük a kosarat
    } catch (error) {
        console.error('Error removing item from cart:', error);
        alert('Hiba a termék eltávolításakor.');
    }
}

// Handle the order button click
function setUpOrderButton() {
    if (orderBtn) {
        orderBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/cart/myCart', {
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
                orderModal?.show();
            } catch (error) {
                console.error('Error fetching cart for order:', error);
                alert('Hiba a rendelési adatok betöltésekor.');
            }
        });
    }
}

// Render the order details in the modal
function renderOrderModal(cart) {
    modalBody.innerHTML = cart.length === 0
        ? '<p class="text-center">A kosár üres</p>'
        : cart.map(item => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${item.product_name}</h5>
                    <p class="card-text">Ár: ${item.price.toLocaleString()} Ft</p>
                    <p class="card-text">Mennyiség: ${item.quantity}</p>
                </div>
            </div>
        `).join('');
}

// Set up back button listener
function setUpButtonListeners() {
    btnBack?.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/home.html';
    });

    setUpOrderButton();
}
