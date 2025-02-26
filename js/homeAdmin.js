const gombPreBuilt = document.querySelector('.btnPreBuilt');
const gombHardware = document.querySelector('.btnHardware');
const gombLogout = document.querySelector('.btnLogout');
const sor = document.getElementById('row');
const gombAdd = document.querySelector('.fixed');

// Event listener a DOMContentLoaded eseményhez
window.addEventListener('DOMContentLoaded', () => {
    inicializalas();
});

async function inicializalas() {
    try {
        await termekekLekerese();
        gombListenerBeallitas();
    } catch (error) {
        console.error('Inicializálás sikertelen:', error);
    }
}

// Termékek lekérése az API-ból
async function termekekLekerese() {
    try {
        const response = await fetch('/api/getProducts/getProducts_all', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('A termékek lekérése sikertelen');
        }

        const termekek = await response.json();
        console.log('Lekért termékek:', termekek);

        const egyediTermekek = egyediTermekekLekerdezese(termekek);
        termekekMegjelenitese(egyesiTermekek);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}

// Egyedi termékek lekérése a product_id alapján
function egyediTermekekLekerdezese(termekek) {
    return termekek.filter((termek, index, self) =>
        index === self.findIndex((t) => t.product_id === termek.product_id)
    );
}

// Termékek megjelenítése az oldalon
function termekekMegjelenitese(termekek) {
    sor.innerHTML = ''; // Meglévő tartalom törlése

    termekek.forEach(termek => {
        const kartyaDiv = kartyaLetelepitese(termek);
        sor.append(kartyaDiv);
        modalLetelepitese(termek);
    });
}

// Termék kártya létrehozása
function kartyaLetelepitese(termek) {
    const kartyaDiv = document.createElement('div');
    kartyaDiv.classList.add('card', 'm-3', 'p-2', 'shadow-sm');
    kartyaDiv.style.width = '18rem';

    const kartyaFejlecDiv = kartyaFejlecLetelepitese(termek);
    const kartyaTorzsDiv = kartyaTorzsLetelepitese(termek);
    const kartyaLablécDiv = kartyaLablécLetelepitese(termek);

    kartyaDiv.append(kartyaFejlecDiv, kartyaTorzsDiv, kartyaLablécDiv);

    return kartyaDiv;
}

// Kártya fejléc létrehozása
function kartyaFejlecLetelepitese(termek) {
    const kartyaFejlecDiv = document.createElement('div');
    kartyaFejlecDiv.classList.add('card-header', 'text-center', 'fw-bold');
    kartyaFejlecDiv.textContent = termek.product_name;
    return kartyaFejlecDiv;
}

// Kártya törzs létrehozása
function kartyaTorzsLetelepitese(termek) {
    const kartyaTorzsDiv = document.createElement('div');
    kartyaTorzsDiv.classList.add('card-body', 'text-center');

    const picDivImg = document.createElement('img');
    picDivImg.src = `https://nodejs312.dszcbaross.edu.hu/uploads/${termek.product_pic}`;
    picDivImg.classList.add('img-fluid', 'mb-3');
    picDivImg.alt = termek.product_name;

    kartyaTorzsDiv.append(picDivImg);
    return kartyaTorzsDiv;
}

// Kártya lábléc létrehozása
function kartyaLablécLetelepitese(termek) {
    const kartyaLablécDiv = document.createElement('div');
    kartyaLablécDiv.classList.add('card-footer', 'text-center');

    const raktaronSpan = document.createElement('span');
    raktaronSpan.textContent = `Raktáron: ${termek.in_stock}`;
    raktaronSpan.classList.add('d-block', 'mb-2');

    const arSpan = document.createElement('span');
    arSpan.textContent = termek.price ? `Ár: ${termek.price} Ft` : 'Ár: N/A';
    arSpan.classList.add('d-block', 'mb-2');

    const reszletekGomb = document.createElement('button');
    reszletekGomb.classList.add('btn', 'btn-primary', 'btn-sm');
    reszletekGomb.textContent = 'Részletek';
    reszletekGomb.setAttribute('data-bs-toggle', 'modal');
    reszletekGomb.setAttribute('data-bs-target', `#modal-${termek.product_id}`);

    kartyaLablécDiv.append(raktaronSpan, arSpan, reszletekGomb);

    return kartyaLablécDiv;
}

// Modal létrehozása a termékhz
function modalLetelepitese(termek) {
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal', 'fade');
    modalDiv.id = `modal-${termek.product_id}`;
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('aria-labelledby', `modalLabel-${termek.product_id}`);
    modalDiv.setAttribute('aria-hidden', 'true');

    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg" style="max-width:500px">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel-${termek.product_id}">${termek.product_name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="https://nodejs312.dszcbaross.edu.hu/uploads/${termek.product_pic}" alt="${termek.product_name}" class="img-fluid mb-3">
                    <p><strong>Raktáron:</strong> ${termek.in_stock}</p>
                    <p><strong>Ár:</strong> ${termek.price ? `${termek.price} Ft` : 'N/A'}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary add-to-cart-btn" data-product-id="${termek.product_id}" data-bs-dismiss="modal">Kosárba</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalDiv);

    const addToCartBtn = modalDiv.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productId = addToCartBtn.getAttribute('data-product-id');
            kosarbaRakom(productId);
        });
    }
}

// Gombok eseménykezelőinek beállítása
function gombListenerBeallitas() {
    if (gombPreBuilt) {
        gombPreBuilt.addEventListener('click', () => {
            console.log('Navigálás a preBuilt.html oldalra');
            window.location.href = 'https://techbay2.netlify.app/preBuilt.html';
        });
    }

    if (gombHardware) {
        gombHardware.addEventListener('click', () => {
            console.log('Navigálás a hardware.html oldalra');
            window.location.href = 'https://techbay2.netlify.app/hardware.html';
        });
    }

    if (gombLogout) {
        gombLogout.addEventListener('click', () => {
            console.log('Kijelentkezés, navigálás az index.html oldalra');
            window.location.href = 'https://techbay2.netlify.app/index.html';
        });
    }

    if (gombAdd) {
        gombAdd.addEventListener('click', () => {
            console.log('Plusz gomb kattintva');
            const modal = modalLetelepiteseUjTermekhez();
            document.body.appendChild(modal);
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
        });
    }
}

// Modal létrehozása az új termékhez
function modalLetelepiteseUjTermekhez() {
    const modalDiv = document.createElement('div');
    modalDiv.classList.add('modal', 'fade');
    modalDiv.setAttribute('tabindex', '-1');
    modalDiv.setAttribute('aria-labelledby', 'modalLabelNewProduct');
    modalDiv.setAttribute('aria-hidden', 'true');

    modalDiv.innerHTML = `
        <div class="modal-dialog modal-lg" style="max-width:500px">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabelNewProduct">Új termék hozzáadása</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <p>Termék neve:</p>
                    <input type="text" class="form-control" placeholder="Termék neve" id="newProductName" required>
                    <p>Termék leírása:</p>
                    <input type="text" class="form-control" placeholder="Termék leírás" id="newProductDesc"required>
                    <p>Termék Ára:</p>
                    <input type="number" class="form-control" placeholder="Termék ára (HUF)" id="newProductPrice"required>
                    <p>Termékkép feltöltése:</p>
                    <input type="file" class="form-control" id="newProductPic">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="saveProductBtn" data-bs-dismiss="modal">Mentés</button>
                </div>
            </div>
        </div>
    `;

    const saveButton = modalDiv.querySelector('#saveProductBtn');
    saveButton.addEventListener('click', () => {
        alert('A termék sikeresen mentve!');
    });

    return modalDiv;
}



async function kosarbaRakom(productId) {
    try {
        const termek = { productId };
        const response = await fetch('/api/cart/takeProduct', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(termek),
            credentials: 'include',
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Termék hozzáadva a kosárhoz:', result);
        } else {
            console.error('Hiba a termék kosárba adásakor:', result);
        }
    } catch (error) {
        console.error('Hiba a termék kosárba adásakor:', error);
    }
}