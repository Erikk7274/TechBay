document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".container");

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
            createProductForm();
        } else if (selectedCategory === "config") {
            createConfigForm();
        }
    });

    function createProductForm() {
        formContainer.innerHTML = `
        <form id="productForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
            <div class="mb-3">
                <label for="productName" class="form-label">Termék neve:</label>
                <input type="text" id="productName" name="productName" class="form-control product" required>
            </div>
            <div class="mb-3">
                <label for="productDescription" class="form-label">Leírás:</label>
                <textarea id="productDescription" name="productDescription" class="form-control product"></textarea>
            </div>
            <div class="mb-3">
                <label for="productPrice" class="form-label">Ár:</label>
                <input type="number" id="productPrice" name="productPrice" class="form-control product" required>
            </div>
            <div class="mb-3">
                <label for="productStock" class="form-label">Raktáron:</label>
                <input type="number" id="productStock" name="productStock" class="form-control product" required>
            </div>
            <div class="mb-3">
                <label for="productCategory" class="form-label">Termék kategória:</label>
                <select id="productCategory" name="productCategory" class="form-select" required>
                    <option value="">Válassz egy kategóriát</option>
                    <option value="cpu">Processzor</option>
                    <option value="mother_board">Alaplap</option>
                    <option value="house">Gépház</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="productImage" class="form-label">Kép feltöltése:</label>
                <input type="file" id="productImage" name="productImage" class="form-control product" accept="image/*" required>
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
            formData.append("in_stock", document.getElementById("productStock").value);
            
            let catId = 0;
            switch (document.getElementById("productCategory").value) {
                case "cpu": catId = 6; break;
                case "mother_board": catId = 7; break;
                case "house": catId = 8; break;
            }
            formData.append("cat_id", catId);
            
            const productImage = document.getElementById("productImage").files[0];
            if (productImage) {
                formData.append("product_pic", productImage);
            }

            try {
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
                    alert(`Hiba történt a feltöltés során: ${errorData.message || "Ismeretlen hiba"}`);
                }
            } catch (error) {
                alert("Nem sikerült csatlakozni a szerverhez.");
            }
        });
    }
});