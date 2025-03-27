document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".container");

    // Kategória kiválasztása
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
                <div class="mb-3">
                    <label for="productStock" class="form-label">Raktáron:</label>
                    <input type="number" id="productStock" name="productStock" class="form-control product" required>
                </div>
                <div class="mb-3">
                    <label for="productSale" class="form-label">Akció:</label>
                    <input type="number" id="productSale" name="productSale" class="form-control product" required>
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
            </div>
            <div class="col-md-6 d-flex flex-column align-items-center">
                <div class="mb-3 w-100">
                    <label for="productImage" class="form-label">Kép feltöltése:</label>
                    <input type="file" id="productImage" name="productImage" class="form-control product" accept="image/*" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Feltöltés</button>
                <button type="button" class="btn btn-secondary w-100 mt-3" id="backToCategory">Vissza</button>
            </div>
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
            formData.append("in_stock", document.getElementById("productStock").value);
            formData.append("sale", document.getElementById("productSale").value);

            const categoryValue = document.getElementById("productCategory").value;
            let catId = 0;
            if (categoryValue === "cpu") {
                catId = 6;
            } else if (categoryValue === "mother_board") {
                catId = 7;
            } else if (categoryValue === "house") {
                catId = 8;
            }
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
                alert(`Hiba történt a feltöltés során: ${errorData.message || "Ismeretlen hiba"}`);
            }
        });
    }

    function createConfigForm() {
        formContainer.innerHTML = `
            <form id="configForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
                <div class="mb-3">
                    <label for="configName" class="form-label">Konfiguráció neve:</label>
                    <input type="text" id="configName" name="configName" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="cpu" class="form-label">CPU:</label>
                    <input type="text" id="cpu" name="cpu" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="motherBoard" class="form-label">Alaplap:</label>
                    <input type="text" id="motherBoard" name="motherBoard" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="ram" class="form-label">RAM:</label>
                    <input type="text" id="ram" name="ram" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="gpu" class="form-label">GPU:</label>
                    <input type="text" id="gpu" name="gpu" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="hdd" class="form-label">HDD:</label>
                    <input type="text" id="hdd" name="hdd" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="ssd" class="form-label">SSD:</label>
                    <input type="text" id="ssd" name="ssd" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="powerSupply" class="form-label">Tápegység:</label>
                    <input type="text" id="powerSupply" name="powerSupply" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="cpuCooler" class="form-label">CPU Hűtő:</label>
                    <input type="text" id="cpuCooler" name="cpuCooler" class="form-control config" required>
                </div>
                <div class="mb-3">
                    <label for="productPrice" class="form-label">Ár:</label>
                    <input type="number" id="productPrice" name="productPrice" class="form-control product" required>
                </div>
                <div class="mb-3 form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="configStatus">
                    <label class="form-check-label" for="configStatus">Aktív</label>
                </div>
                <div class="mb-3">
                    <label for="configImage" class="form-label">Kép feltöltése:</label>
                    <input type="file" id="configImage" name="configImage" class="form-control" accept="image/*" required>
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
            formData.append("cpu", document.getElementById("cpu").value);
            formData.append("mother_board", document.getElementById("motherBoard").value);
            formData.append("ram", document.getElementById("ram").value);
            formData.append("gpu", document.getElementById("gpu").value);
            formData.append("hdd", document.getElementById("hdd").value);
            formData.append("ssd", document.getElementById("ssd").value);
            formData.append("power_supply", document.getElementById("powerSupply").value);
            formData.append("cpu_cooler", document.getElementById("cpuCooler").value);
            formData.append("price", document.getElementById("productPrice").value);
            formData.append("config_pic", document.getElementById("configImage").files[0]);
            formData.append("description", document.getElementById("productDescription").value);
            formData.append("in_stock", "1");
            formData.append("sale", "0");
            formData.append("active", document.getElementById("configStatus").checked ? "1" : "0");

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
                alert(`Hiba történt a feltöltés során: ${errorData.message || "Ismeretlen hiba"}`);
            }
            console.log(...formData.entries());
        });
    }
});
