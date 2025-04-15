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
        const price = item.price || item.pc_price;
        const imageUrl = item.product_pic ? `/api/uploads/${item.product_pic}` : item.pc_pic ? `/api/uploads/${item.pc_pic}` : '1.jpg';
        return `
            <div class="card mb-3" cart-item-id="${item.cart_item_id}" data-id="${item.product_id ?? item.pc_id ?? 'hiba'}">
                <div class="row g-0">
                    <div class="col-3 d-flex align-items-center">
                        <img src="${imageUrl}" class="img-fluid rounded-start" alt="${item.product_name || item.pc_name || 'Termékkép'}">
                    </div>
                    <div class="col-9">
                        <div class="card-body">
                            <h5 class="card-title">${item.product_name || item.pc_name}</h5>
                            <p class="card-text">Ár: ${price} Ft</p>
                            <label for="quantity-${item.product_id || item.pc_id}">Mennyiség:</label>
                            <select id="quantity-${item.product_id || item.pc_id}" class="form-select quantity-select">
                                ${generateQuantityOptions(item.quantity)}
                            </select>
                            <button class="btn btn-danger btn-sm remove-item">Eltávolítás</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}


// Render order modal with product images
function renderOrderModal(cart) {
    modalBody.innerHTML = cart.length === 0
        ? '<p class="text-center">A kosár üres</p>'
        : cart.map(item => {
            const price = item.price || item.pc_price;
            const productImage = item.product_pic ? `/api/uploads/${item.product_pic}` : item.pc_pic ? `/api/uploads/${item.pc_pic}` : '1.jpg';
            return `
                <div class="card mb-3">
                <div class="row g-0 align-items-center">
                        <div class="col-md-2">
                        <img src="${productImage}" alt="${item.product_name || item.pc_name}" 
                        class="img-fluid rounded" style="max-width: 80px; height: auto;">
                        </div>
                        <div class="col-md-10">
                            <div class="card-body">
                                <h5 class="card-title">${item.product_name || item.pc_name}</h5>
                                <p class="card-text">Ár: ${price} Ft</p>
                                <p class="card-text">Mennyiség: ${item.quantity}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    // Elhelyezzük a full price-ot a modalBody végén
    modalBody.appendChild(fullpriceContainer);

    // Debugging: Ellenőrizzük, hogy biztosan ott van-e a modalban
    console.log('Modal body after appending full price:', modalBody);
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
            const price = (item.price || item.pc_price) ? (item.price || item.pc_price).toLocaleString() : 'N/A';
            const productImage = item.product_pic ? `/api/uploads/${item.product_pic}` : item.pc_pic ? `/api/uploads/${item.pc_pic}` : '1.jpg';

            return `
                <div class="card mb-3 position-relative">
                    <div class="row g-0 align-items-center">
                        <div class="col-md-10">
                            <div class="card-body">
                                <h5 class="card-title">${item.product_name || item.pc_name}</h5>
                                <p class="card-text">Ár: ${price} Ft</p>
                                <p class="card-text">Mennyiség: ${item.quantity}</p>
                            </div>
                        </div>
                        <div class="col-md-2 position-absolute top-0 end-0 p-2">
                            <img src="${productImage}" alt="${item.product_name || item.pc_name}"
                                 class="img-fluid rounded" style="max-width: 100%; height: auto; border: 1px solid black;">
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    // Biztosítjuk, hogy a teljes ár tartalom is helyesen jelenjen meg
    modalBody.appendChild(fullpriceContainer);
    console.log('Modal body after appending full price:', modalBody);
}



const fullpriceContainer = document.createElement('div');
fullpriceContainer.id = 'fullpriceHTML';
fullpriceContainer.className = 'text-center mt-3';

async function fullprice(cart) {
    try {
        const response = await fetch('/api/cart/sumPrice', {
            method: 'GET',
            credentials: 'include'
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error('Failed to fetch final price');
        }

        const data = await response.json();
        console.log('Received data from sumPrice API:', data); // Logoljunk az adatokat
        console.log(data[0].sumPrice);
        // Ellenőrizzük, hogy van-e sumPrice a válaszban
        if (!data || !data[0].sumPrice) {
            console.error('No sumPrice in response:', data);
            throw new Error('No sumPrice found in response');
        }

        const totalPrice = data[0].sumPrice || 0;  // Ha nincs sumPrice, akkor 0-t használunk

        if (cart && cart.length > 0 && totalPrice > 0) {
            fullpriceContainer.innerHTML = `<p>Végleges ár: ${totalPrice.toLocaleString()} Ft</p>`;
        } else {
            fullpriceContainer.innerHTML = '<p>Hiba a végleges ár betöltésekor.</p>';
        }
    } catch (error) {
        console.error('Error fetching final price:', error);
        fullpriceContainer.innerHTML = `<p class="text-center">Hiba a végleges ár betöltésekor: ${error.message}</p>`;
    }
}





// Fizetési modal létrehozása JavaScript-ben
function createPaymentModal(cart) {
    // Ellenőrizzük, hogy már létezik-e a fizetési modal
    if (document.getElementById('paymentModal')) {
        return; // Ha már létezik, nem hozunk létre újat
    }

    // Fizetési modal HTML kódja
    const paymentModalHTML = `
    <div class="modal" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="paymentModalLabel">Fizetés</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul id="cart-item-list"></ul> <!-- Termékek listája -->
                </div>
                <div class="modal-footer">
                    
                    <button type="button" class="btn btn-primary" id="confirmPaymentBtn">Fizetés megerősítése</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bezárás</button>
                </div>
            </div>
        </div>
    </div>`;

    // Hozzáadjuk a body-hoz a fizetési modal HTML-t
    document.body.insertAdjacentHTML('beforeend', paymentModalHTML);

    // Betöltjük a kosár termékeit a fizetési modalba
    const cartItemList = document.getElementById('cart-item-list');
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product_name || item.pc_name} - ${item.quantity} db - ${item.price || item.pc_price} Ft`;
        cartItemList.appendChild(li);
    });




    // Rendelés megerősítés
    document.getElementById('confirmPaymentBtn').addEventListener('click', () => {
        confirmOrder(cart);
    });
}

// Fizetési modal megjelenítése
function showPaymentModal(cart) {
    createPaymentModal(cart); // Létrehozzuk a fizetési modalt, ha még nem létezik

    const paymentModal = document.getElementById('paymentModal');
    const paymentModalInstance = new bootstrap.Modal(paymentModal);
    paymentModalInstance.show(); // Megjelenítjük a fizetési modalt

    // Bezárjuk az előző modalt, ha nyitva van
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        const orderModalInstance = bootstrap.Modal.getInstance(orderModal);
        if (orderModalInstance) {
            orderModalInstance.hide(); // Bezárjuk a rendelési modalt
        }
    }
}

// Rendelés megerősítése és fizetési modal megnyitása
async function confirmOrder(cart) {
    try {
        const response = await fetch('/api/itemsOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cart }), // A kosár termékei
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Hiba a rendelés leadása során');
        }

        const result = await response.json();
        if (result.success) {
            alert('Rendelés sikeresen leadva!');
            // További logika a rendelés után (pl. visszairányítás a kezdőlapra)
        } else {
            alert('Hiba a rendelés feldolgozása során');
        }
    } catch (error) {
        console.error('Hiba a rendelés leadása során:', error);
        alert('Hiba a rendelés feldolgozása során');
    }
}

// A Tovább gomb eseménykezelője
document.getElementById('confirmOrderBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/cart/myCart', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Nem sikerült betölteni a kosarat');
        }

        const cart = await response.json();
        if (cart.length === 0) {
            alert('A kosár üres!');
            return;
        }

        // Fizetési modal megjelenítése a kosár adataival
        showPaymentModal(cart);

    } catch (error) {
        console.error('Hiba a kosár betöltésekor:', error);
        alert('Hiba a kosár betöltésekor');
    }
});

// A Mégse gomb eseménykezelője az orderModal-hoz
document.querySelector('.btn-secondary[data-bs-dismiss="modal"]').addEventListener('click', function () {
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        const orderModalInstance = bootstrap.Modal.getInstance(orderModal);
        if (orderModalInstance) {
            orderModalInstance.hide(); // Bezárjuk a rendelési modalt
        }
    }
});

// Az X gomb eseménykezelője az orderModal-hoz
document.querySelector('.btn-close').addEventListener('click', function () {
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        const orderModalInstance = bootstrap.Modal.getInstance(orderModal);
        if (orderModalInstance) {
            orderModalInstance.hide(); // Bezárjuk a rendelési modalt
        }
    }
});













function setUpButtonListeners() {
    btnBack?.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/home.html';
    });

    setUpOrderButton();
}
