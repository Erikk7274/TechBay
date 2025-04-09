// Selecting necessary elements
const btnBack = document.querySelector('.btnBack');
const orderBtn = document.getElementById('order-btn');
const cartItemsContainer = document.getElementById('cart-items');
const modalBody = document.getElementById('modalBody');
const orderModalElement = document.getElementById('orderModal');
const confirmOrderBtn = document.getElementById('confirmOrderBtn');

let orderModal = orderModalElement ? new bootstrap.Modal(orderModalElement) : null;

document.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    await loadCart();
    setUpButtonListeners();
}

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
            location.reload();
        } else {
            throw new Error('Hiba a kijelentkezéskor');
        }
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function loadCart() {
    try {
        console.log('Loading cart...');
        const response = await fetch('/api/cart/myCart', {
            method: 'GET',
            credentials: 'include'
        });

        const cart = await response.json();
        console.log('Cart items:', cart);

        if (!Array.isArray(cart) || cart.length === 0) {
            // Ha üres a kosár (üres tömb vagy nem tömb)
            return cartItemsContainer.innerHTML = '<p class="text-center">A kosár üres</p>';
        }

        cartItemsContainer.innerHTML = renderCartItems(cart);
        setUpRemoveButtons();
        fullprice(cart);  // Show full price only when cart is not empty

    } catch (error) {
        console.error('Error loading cart:', error);
        cartItemsContainer.innerHTML = `<p class="text-center">Hiba a kosár betöltésekor: ${error.message}</p>`;
    }
}


// Render cart items based on the new database structure
function renderCartItems(cart) {
    return cart.map(item => {
        console.log(item);
        const price = item.price || item.pc_price;
        return `
            <div class="card mb-3" cart-item-id="${item.cart_item_id}" data-id="${item.product_id ?? item.pc_id ?? 'hiba'}">
                <div class="card-body">
                    <h5 class="card-title">${item.product_name || item.pc_name}</h5>
                    <p class="card-text">Ár: ${price || pc_price} Ft</p>
                    <label for="quantity-${item.product_id || item.pc_id}">Mennyiség:</label>
                    <select id="quantity-${item.product_id || item.pc_id}" class="form-select quantity-select">
                        ${generateQuantityOptions(item.quantity)}
                    </select>
                    <button class="btn btn-danger btn-sm remove-item">Eltávolítás</button>
                </div>
            </div>
        `;
    }).join('');
}

function generateQuantityOptions(selectedQuantity) {
    let options = "";
    for (let i = 1; i <= 99; i++) {
        options += `<option value="${i}" ${i === selectedQuantity ? 'selected' : ''}>${i}</option>`;
    }
    return options;
}

// Set up event listeners for the remove buttons
function setUpRemoveButtons() {
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', async (event) => {
            const cartItemId = event.target.closest('.card').getAttribute('cart-item-id');
            console.log(cartItemId);
            await removeItemFromCart(cartItemId);

        });
    });
}

async function removeItemFromCart(cart_item_id) {
    try {
        console.log(`Törlendő termék ID: ${cart_item_id}`);
        console.log(`Küldött DELETE request: /api/cart/removeProduct/${cart_item_id}`);

        const response = await fetch(`/api/cart/removeProduct/${cart_item_id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`Hiba: ${response.status} - ${response.statusText}`);
        }

        // Ha a válasz 204 (üres kosár), akkor üres kosár üzenetet jelenítünk meg
        if (response.status === 204) {
            cartItemsContainer.innerHTML = '<p class="text-center">A kosár üres</p>';
        } else {
            const responseData = await response.json();
            if (responseData.message === 'Sikeres törlés!') {
                console.log(`Item removed. API Response:`, responseData);
                await loadCart();  // Ha nem üres, akkor újratöltjük a kosarat
            }
        }

    } catch (error) {
        console.error('Hiba a törlés során:', error);
        alert(`Hiba a termék eltávolításakor: ${error.message}`);

        console.log("Újratöltjük a kosár tartalmát...");
        await loadCart();

        if (error.message.includes("Failed to fetch")) {
            console.log("Hálózati hiba észlelve, újratöltés...");
            setTimeout(() => location.reload(), 1000);
        }
    }
}




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




function renderOrderModal(cart) {
    modalBody.innerHTML = cart.length === 0
        ? '<p class="text-center">A kosár üres</p>'
        : cart.map(item => {
            const price = item.price ? item.price.toLocaleString() : 'N/A';
            return `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">${item.product_name || item.pc_name}</h5>
                        <p class="card-text">Ár: ${price} Ft</p>
                        <p class="card-text">Mennyiség: ${item.quantity}</p>
                    </div>
                </div>
            `;
        }).join('');
       
}


async function fullprice(cart) {
    try {
        const response = await fetch('/api/cart/sumPrice', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch final price');
        }

        const data = await response.json();
        const totalPrice = data.totalPrice;

        // Initialize the fullpriceHTML element
        const fullpriceHTML = document.getElementById('fullpriceHTML');

        // Show total price only if the cart is not empty
        if (cart && cart.length > 0 && totalPrice > 0) {
            fullpriceHTML.innerHTML = `
                <p class="text-center">Végleges ár: ${totalPrice.toLocaleString()} Ft</p>
            `;
        } else {
            fullpriceHTML.innerHTML = ''; // Clear the price if it's 0 or cart is empty
        }
    } catch (error) {
        console.error('Error fetching final price:', error);
        const fullpriceHTML = document.getElementById('fullpriceHTML');
        fullpriceHTML.innerHTML = `<p class="text-center">Hiba a végleges ár betöltésekor: ${error.message}</p>`;
    }
}


function setUpButtonListeners() {
    btnBack?.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/home.html';
    });

    setUpOrderButton();
}
