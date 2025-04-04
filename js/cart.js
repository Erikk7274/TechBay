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
                    <button class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal-${item.product_id || item.pc_id}">Részletek</button>
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
            const cartItemId = event.target.closest('.card').getAttribute('cart-item-id');  // Get the cart-item-id
            await removeItemFromCart(cartItemId);

        });
    });
}

async function removeItemFromCart(cart_item_id) {  
    try {
        console.log("Törlendő termék ID:", cart_item_id); 

        const response = await fetch(`/api/cart/removeProduct/${cart_item_id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const responseData = await response.json(); 

        if (!response.ok) {
            throw new Error(`Hiba: ${response.status} - ${responseData.message || 'Ismeretlen hiba'}`);
        }

        console.log(`Item with ID ${cart_item_id} removed. API Response:`, responseData);
        
        await loadCart(); // Biztosítjuk, hogy frissül a kosár
        //gyula egy kurva

    } catch (error) {
        console.error('Error removing item from cart:', error);
        alert(`Hiba a termék eltávolításakor: ${error.message}`);
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

// function createModal(product) {

//     const modalDiv = document.createElement('div');
//     modalDiv.classList.add('modal', 'fade');
//     modalDiv.id = `modal-${product.product_id}`;
//     modalDiv.setAttribute('tabindex', '-1');
//     modalDiv.setAttribute('aria-labelledby', `modalLabel-${product.product_id}`);
//     modalDiv.setAttribute('aria-hidden', 'true');

//     modalDiv.innerHTML = `
//         <div class="modal-dialog modal-lg" style="max-width:500px">
//             <div class="modal-content">
//                 <div class="modal-header">
//                     <h5 class="modal-title" id="modalLabel-${product.product_id}">${product.product_name || product.product_name}</h5>
//                     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                 </div>
//                 <div class="modal-body text-center">
//                     <img src="/api/uploads/${product.product_pic}" alt="${product.product_name || product.product_name}" class="img-fluid mb-3">
//                     <p><strong>Raktáron:</strong> ${product.in_stock}</p>
//                     <p><strong>Ár:</strong> ${product.price ? `${product.price} Ft` : 'N/A'}</p>
//                     <p><strong>Leírás:</strong><br> ${product.product_description}</p>
//                 </div>
//                 <div class="modal-footer">
//                     <button type="button" class="btn btn-primary add-to-cart-btn" data-product-id="${product.product_id}" data-bs-dismiss="modal">Kosárba</button>
//                 </div>
//             </div>
//         </div>
//     `;

//     document.body.appendChild(modalDiv);

//     modalDiv.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(product.product_id));
// } 



function setUpButtonListeners() {
    btnBack?.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/home.html';
    });

    setUpOrderButton();
}
