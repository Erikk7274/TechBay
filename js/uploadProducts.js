document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".container");

    // Az alap formot hozzuk létre a kategória kiválasztásához
    formContainer.innerHTML = `
        <form id="categoryForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
            <div class="mb-3">
                <label for="category" class="form-label">Kategória:</label>
                <select id="category" name="category" class="form-select" required>
                    <option value="">Válassz egy kategóriát</option>
                    <option value="product">Termék</option>
                    <option value="config">Prebuilt</option>
                </select>
            </div>
        </form>
    `;

    // Kategória kiválasztásakor változik a form
    document.getElementById("category").addEventListener("change", (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory === "product") {
            createProductForm();
        } else if (selectedCategory === "config") {
            createConfigForm();
        }
    });

    // Product form létrehozása
    function createProductForm() {
        formContainer.innerHTML = `
        <form id="productForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label for="productName" class="form-label">Termék neve:</label>
                    <input type="text" id="productName" name="productName" class="form-control product" required>
                </div>
                <div class="mb-3">
                    <label for="productDescription" class="form-label">Leírás:</label>
                    <textarea id="productDescription" name="productDescription" class="form-control product" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="productPrice" class="form-label">Ár:</label>
                    <input type="number" id="productPrice" name="productPrice" class="form-control product" required>
                </div>
            </div>
            <div class="col-md-6 d-flex flex-column align-items-center">
                <div class="mb-3 w-100">
                    <label for="productImage" class="form-label">Kép feltöltése:</label>
                    <input type="file" id="productImage" name="productImage" class="form-control product" accept="image/*" required>
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="productStatus" checked>
                    <label class="form-check-label" for="productStatus">Aktív</label>
                </div>
                <button type="submit" class="btn btn-primary w-100">Feltöltés</button>
                <button type="button" class="btn btn-secondary w-100 mt-3" id="backToCategory">Vissza</button>
            </div>
        </div>
        </form>
        `;

        document.getElementById("backToCategory").addEventListener("click", () => {
            window.location.href = '../uploadProducts.html';
        });
    }

    // Config form létrehozása
    function createConfigForm() {
        formContainer.innerHTML = `
        <form id="configForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
            <div class="mb-3">
                <label for="configName" class="form-label">Konfiguráció neve:</label>
                <input type="text" id="configName" name="configName" class="form-control config" required>
            </div>
            <div class="mb-3">
                <label for="configImage" class="form-label">Kép feltöltése:</label>
                <input type="file" id="configImage" name="configImage" class="form-control" accept="image/*" required>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" id="configStatus" checked>
                <label class="form-check-label" for="configStatus">Aktív</label>
            </div>
            <button type="submit" class="btn btn-primary w-100">Feltöltés</button>
            <button type="button" class="btn btn-secondary w-100 mt-3" id="backToCategory">Vissza</button>
        </form>
        `;

        document.getElementById("backToCategory").addEventListener("click", () => {
            window.location.href = '../uploadProducts.html';
        });
    }
});

// Kijelentkezés eseménykezelő
    document.querySelector(".icon-logout").addEventListener("click", async () => {
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
            alert('Hiba a kijelentkezéskor!');
        }
    });