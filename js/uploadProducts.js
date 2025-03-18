document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".container");
    
    // Kategória választás form
    formContainer.innerHTML = `
        <form id="categoryForm" class="container mt-4 p-4 border rounded bg-light">
            <div class="mb-3">
                <label for="category" class="form-label">Kategória:</label>
                <select id="category" name="category" class="form-select" required>
                    <option value="" selected disabled>Válassz kategóriát</option>
                </select>
            </div>
        </form>
    `;

    // Kategóriák lekérése a backendről
    async function loadCategories() {
        try {
            const response = await fetch('/api/categories'); // A backend API végpontja
            const categories = await response.json();

            const categorySelect = document.getElementById("category");
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category.id; // A backend adataiból kell venni az ID-t
                option.textContent = category.name; // A kategória neve
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error("Hiba a kategóriák betöltésekor:", error);
            alert("Hiba történt a kategóriák betöltésekor.");
        }
    }

    // Betöltjük a kategóriákat
    loadCategories();

    // Változó a formok tárolására
    let currentForm = null;

    // Kategória kiválasztása
    document.getElementById("category").addEventListener("change", (event) => {
        const categoryId = event.target.value;
        
        // Ha volt már korábban form, akkor eltávolítjuk
        if (currentForm) {
            currentForm.remove();
        }

        if (categoryId === "product") {
            // Termék form
            currentForm = createProductForm();
            formContainer.appendChild(currentForm);
        } else if (categoryId === "config") {
            // Prebuilt (config) form
            currentForm = createConfigForm();
            formContainer.appendChild(currentForm);
        }
    });

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

            formData.append("in_stock", "1");
            formData.append("cat_id", "1");
            formData.append("sale", "0");

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
    function createConfigForm() {
        const form = document.createElement("form");
        form.id = "configForm";
        form.classList.add("container", "mt-4", "p-4", "border", "rounded", "bg-light");

        form.innerHTML = `
            <div class="mb-3">
                <label for="productName" class="form-label">Konfiguráció neve:</label>
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
            form.remove();  // Elrejti a konfiguráció formot
            document.getElementById("category").value = "";  // Visszaállítja a kategóriát
        });

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData();
            
            formData.append("config_name", document.getElementById("productName").value);
            formData.append("description", document.getElementById("productDescription").value);
            formData.append("price", document.getElementById("productPrice").value);
            formData.append("config_pic", document.getElementById("productImage").files[0]);

            formData.append("in_stock", "1");
            formData.append("cat_id", "2");
            formData.append("sale", "0");
            formData.append("power_supply", "650W");
            formData.append("cpu", "Intel i7");
            formData.append("mother_board", "Asus Z490");
            formData.append("ram", "16GB");
            formData.append("gpu", "NVIDIA GTX 1660");
            formData.append("hdd", "1TB HDD");
            formData.append("ssd", "512GB SSD");
            formData.append("cpu_cooler", "Cooler Master");
            formData.append("active", "1");

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
