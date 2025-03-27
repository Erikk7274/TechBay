document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".container");

    function renderCategoryForm() {
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

        document.getElementById("category").addEventListener("change", (event) => {
            const selectedCategory = event.target.value;
            if (selectedCategory === "product") {
                renderProductForm();
            } else if (selectedCategory === "config") {
                renderConfigForm();
            }
        });
    }

    function renderProductForm() {
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
                    <img id="previewImage" class="img-fluid mt-2 d-none" style="max-width: 200px;">
                </div>
                <button type="submit" class="btn btn-primary w-100">Feltöltés</button>
                <button type="button" class="btn btn-secondary w-100 mt-3" id="backToCategory">Vissza</button>
            </form>
        `;

        document.getElementById("backToCategory").addEventListener("click", renderCategoryForm);
        document.getElementById("productForm").addEventListener("submit", (event) => handleFormSubmit(event, "product"));
        document.getElementById("productImage").addEventListener("change", handleImagePreview);
    }

    function renderConfigForm() {
        formContainer.innerHTML = `
            <form id="configForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
                <div class="mb-3">
                    <label for="configName" class="form-label">Konfiguráció neve:</label>
                    <input type="text" id="configName" name="configName" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="cpu" class="form-label">CPU:</label>
                    <input type="text" id="cpu" name="cpu" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="productPrice" class="form-label">Ár:</label>
                    <input type="number" id="productPrice" name="productPrice" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="configImage" class="form-label">Kép feltöltése:</label>
                    <input type="file" id="configImage" name="configImage" class="form-control" accept="image/*" required>
                    <img id="previewImage" class="img-fluid mt-2 d-none" style="max-width: 200px;">
                </div>
                <button type="submit" class="btn btn-primary w-100">Feltöltés</button>
                <button type="button" class="btn btn-secondary w-100 mt-3" id="backToCategory">Vissza</button>
            </form>
        `;

        document.getElementById("backToCategory").addEventListener("click", renderCategoryForm);
        document.getElementById("configForm").addEventListener("submit", (event) => handleFormSubmit(event, "config"));
        document.getElementById("configImage").addEventListener("change", handleImagePreview);
    }

    function handleImagePreview(event) {
        const file = event.target.files[0];
        const preview = document.getElementById("previewImage");

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
                preview.classList.remove("d-none");
            };
            reader.readAsDataURL(file);
        } else {
            preview.src = "";
            preview.classList.add("d-none");
        }
    }

    async function handleFormSubmit(event, type) {
        event.preventDefault();

        const formData = new FormData();
        if (type === "product") {
            formData.append("product_name", document.getElementById("productName").value);
            formData.append("product_description", document.getElementById("productDescription").value);
            formData.append("price", document.getElementById("productPrice").value);
            formData.append("product_pic", document.getElementById("productImage").files[0]);
            formData.append("cat_id", "1");
        } else if (type === "config") {
            formData.append("config_name", document.getElementById("configName").value);
            formData.append("cpu", document.getElementById("cpu").value);
            formData.append("price", document.getElementById("productPrice").value);
            formData.append("config_pic", document.getElementById("configImage").files[0]);
            formData.append("cat_id", "2");
        }

        const endpoint = type === "product" ? "/api/add/uploadProduct" : "/api/add/uploadConfig";
        const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        if (response.ok) {
            alert("SIKERES FELTÖLTÉS!");
            event.target.reset();
            document.getElementById("previewImage").classList.add("d-none");
        } else {
            const errorData = await response.json();
            alert(`Hiba történt: ${errorData.message || "Ismeretlen hiba"}`);
        }
    }

    renderCategoryForm();
});
