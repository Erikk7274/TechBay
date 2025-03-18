document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".container");

    // Kategória választás form
    formContainer.innerHTML = `
        <form id="categoryForm" class="container mt-4 p-4 border rounded bg-light">
            <div class="mb-3">
                <label for="category" class="form-label">Kategória:</label>
                <select id="category" name="category" class="form-select" required>
                    <option value="" selected disabled>Válassz kategóriát</option>
                    <option value="product">Termék</option>
                    <option value="config">Prebuilt (Konfiguráció)</option>
                </select>
            </div>
        </form>
    `;

    // Kategória kiválasztása esemény
    document.getElementById("category").addEventListener("change", (event) => {
        const categoryId = event.target.value;

        // Ha volt már korábban form, akkor eltávolítjuk
        if (currentForm) {
            currentForm.remove();
        }

        if (categoryId === "product") {
            // Ha terméket választanak, akkor a termékformot jelenítjük meg
            currentForm = createProductForm();
            formContainer.appendChild(currentForm);
        } else if (categoryId === "config") {
            // Ha prebuilt (config) választás, akkor a prebuilt formot jelenítjük meg
            currentForm = createConfigForm();
            formContainer.appendChild(currentForm);
        }
    });

    // Változó a formok tárolására
    let currentForm = null;

    // Termék form létrehozása
    function createProductForm() {
        const form = document.createElement("form");
        form.id = "productForm";
        form.classList.add("container", "mt-4", "p-4", "border", "rounded", "bg-light");

        form.innerHTML = `
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
            <button type="submit" class="btn btn-primary">Feltöltés</button>
            <button type="button" class="btn btn-secondary mt-2" id="backToCategory">Vissza a kategóriához</button>
        `;

        // Vissza gomb működése
        form.querySelector("#backToCategory").addEventListener("click", () => {
            form.remove();  // Elrejti a termék formot
            document.getElementById("category").value = "";  // Visszaállítja a kategóriát
        });

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData();
            
            formData.append("product_name", document.getElementById("productName").value);
            formData.append("product_description", document.getElementById("productDescription").value);
            formData.append("price", document.getElementById("productPrice").value);
            formData.append("product_pic", document.getElementById("productImage").files[0]);

            try {
                const response = await fetch("/api/add/uploadProduct", {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                });

                if (response.ok) {
                    alert("SIKERES FELTÖLTÉS!");
                    form.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Hiba történt a feltöltés során: ${errorData.message || "Ismeretlen hiba"}`);
                }
            } catch (error) {
                console.error("Hálózati hiba:", error);
                alert("Hálózati hiba történt. Ellenőrizd az internetkapcsolatot és próbáld újra.");
            }
        });

        return form;
    }

    // Prebuilt (config) form létrehozása
    async function createConfigForm() {
        const form = document.createElement("form");
        form.id = "configForm";
        form.classList.add("container", "mt-4", "p-4", "border", "rounded", "bg-light");

        form.innerHTML = `
            <div class="mb-3">
                <label for="configName" class="form-label">Konfiguráció neve:</label>
                <input type="text" id="configName" name="configName" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="configDescription" class="form-label">Leírás:</label>
                <textarea id="configDescription" name="configDescription" class="form-control" required></textarea>
            </div>
            <div class="mb-3">
                <label for="configPrice" class="form-label">Ár:</label>
                <input type="number" id="configPrice" name="configPrice" class="form-control" required>
            </div>
            <div class="mb-3">
                <label for="configImage" class="form-label">Kép feltöltése:</label>
                <input type="file" id="configImage" name="configImage" class="form-control" accept="image/*" required>
            </div>
            <button type="submit" class="btn btn-primary">Feltöltés</button>
            <button type="button" class="btn btn-secondary mt-2" id="backToCategory">Vissza a kategóriához</button>
        `;

        // Vissza gomb működése
        form.querySelector("#backToCategory").addEventListener("click", () => {
            form.remove();  // Elrejti a konfiguráció formot
            document.getElementById("category").value = "";  // Visszaállítja a kategóriát
        });

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData();

            formData.append("config_name", document.getElementById("configName").value);
            formData.append("config_description", document.getElementById("configDescription").value);
            formData.append("price", document.getElementById("configPrice").value);
            formData.append("config_pic", document.getElementById("configImage").files[0]);

            try {
                const response = await fetch("/api/add/uploadConfig", {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                });

                if (response.ok) {
                    alert("SIKERES FELTÖLTÉS!");
                    form.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Hiba történt a feltöltés során: ${errorData.message || "Ismeretlen hiba"}`);
                }
            } catch (error) {
                console.error("Hálózati hiba:", error);
                alert("Hálózati hiba történt. Ellenőrizd az internetkapcsolatot és próbáld újra.");
            }
        });

        return form;
    }
});
