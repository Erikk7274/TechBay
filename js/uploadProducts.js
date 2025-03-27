document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".container");

    // Kategória kiválasztása
    formContainer.innerHTML = `
        <form id="categoryForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
            <div class="mb-3">
                <label for="category" class="form-label">Kategória:</label>
                <select id="category" name="category" class="form-select" required>
                    <option value="">Válassz egy kategóriát</option>
                    <option value="1">Termék</option>
                    <option value="2">Prebuilt</option>
                </select>
            </div>
        </form>
    `;

    document.getElementById("category").addEventListener("change", (event) => {
        const selectedCategory = event.target.value;
        if (selectedCategory === "1") {
            createProductForm(selectedCategory);
        } else if (selectedCategory === "2") {
            createConfigForm(selectedCategory);
        }
    });

    function createProductForm(catId) {
        formContainer.innerHTML = `
        <form id="productForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
            <div class="mb-3">
                <label for="productName" class="form-label">Termék neve:</label>
                <input type="text" id="productName" name="productName" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="productDescription" class="form-label">Leírás:</label>
                <textarea id="productDescription" name="productDescription" class="form-control" required></textarea>
            </div>
            <div class="mb-3">
                <label for="productPrice" class="form-label">Ár:</label>
                <input type="number" id="productPrice" name="productPrice" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="productImage" class="form-label">Kép feltöltése:</label>
                <input type="file" id="productImage" name="productImage" class="form-control" accept="image/*" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Feltöltés</button>
            <button type="button" class="btn btn-secondary w-100 mt-3" id="backToCategory">Vissza</button>
        </form>
        `;

        document.getElementById("backToCategory").addEventListener("click", () => {
            window.location.href = '../uploadProducts.html';
        });

        document.getElementById("productForm").addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData();
            formData.append("product_name", document.getElementById("productName").value);
            formData.append("product_description", document.getElementById("productDescription").value);
            formData.append("price", document.getElementById("productPrice").value);
            formData.append("product_pic", document.getElementById("productImage").files[0]);
            formData.append("cat_id", catId);

            const response = await fetch("/api/add/uploadProduct", {
                method: "POST",
                credentials: "include",
                body: formData
            });

            if (response.ok) {
                alert("SIKERES FELTÖLTÉS!");
                document.getElementById("productForm").reset();
            } else {
                const errorData = await response.json();
                alert(`Hiba történt: ${errorData.message || "Ismeretlen hiba"}`);
            }
        });
    }

    function createConfigForm(catId) {
        formContainer.innerHTML = `
        <form id="configForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
            <div class="mb-3">
                <label for="configName" class="form-label">Konfiguráció neve:</label>
                <input type="text" id="configName" name="configName" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="productPrice" class="form-label">Ár:</label>
                <input type="number" id="productPrice" name="productPrice" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">Feltöltés</button>
            <button type="button" class="btn btn-secondary w-100 mt-3" id="backToCategory">Vissza</button>
        </form>
        `;

        document.getElementById("backToCategory").addEventListener("click", () => {
            window.location.href = '../uploadProducts.html';
        });

        document.getElementById("configForm").addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData();
            formData.append("config_name", document.getElementById("configName").value);
            formData.append("price", document.getElementById("productPrice").value);
            formData.append("cat_id", catId);

            const response = await fetch("/api/add/uploadConfig", {
                method: "POST",
                credentials: "include",
                body: formData
            });

            if (response.ok) {
                alert("SIKERES FELTÖLTÉS!");
                document.getElementById("configForm").reset();
            } else {
                const errorData = await response.json();
                alert(`Hiba történt: ${errorData.message || "Ismeretlen hiba"}`);
            }
        });
    }
});