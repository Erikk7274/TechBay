document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".container");

    // Az alap formot hozzuk létre a kategória kiválasztásához
    formContainer.innerHTML = `
        <form id="categoryForm" class="container mt-4 p-4 border rounded bg-light">
            <div class="mb-3">
                <label for="category" class="form-label">Kategória:</label>
                <select id="category" name="category" class="form-select" required>
                    <option value="">Válassz egy kategóriát</option>
                    <option value="product">Termék</option>
                    <option value="config">Prebuilt</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Tovább</button>
        </form>
    `;

    // Kategória kiválasztásakor változik a form
    document.getElementById("category").addEventListener("change", (event) => {
        const selectedCategory = event.target.value;
        // Ha terméket választanak, akkor a termék formot jelenítjük meg
        if (selectedCategory === "product") {
            createProductForm();
        } 
        // Ha konfigurációt választanak, akkor a config formot jelenítjük meg
        else if (selectedCategory === "config") {
            createConfigForm();
        }
    });

    // Product form létrehozása
    function createProductForm() {
        formContainer.innerHTML = `
            <form id="productForm" class="container mt-4 p-4 border rounded bg-light">
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
            </form>
        `;

        // A termék form beküldése
        document.getElementById("productForm").addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData();
            
            formData.append("product_name", document.getElementById("productName").value);
            formData.append("product_description", document.getElementById("productDescription").value);
            formData.append("price", document.getElementById("productPrice").value);
            formData.append("product_pic", document.getElementById("productImage").files[0]);
            formData.append("in_stock", "1"); // Alapértelmezett érték
            formData.append("cat_id", "1"); // Kategória id
            formData.append("sale", "0"); // Akciós termék: 0 (nem akciós)

            const response = await fetch("/api/add/uploadProduct", {
                method: "POST",
                body: formData,
                credentials: "include"
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

    // Config form létrehozása
    function createConfigForm() {
        formContainer.innerHTML = `
            <form id="configForm" class="container mt-4 p-4 border rounded bg-light">
                <div class="mb-3">
                    <label for="configName" class="form-label">Konfiguráció neve:</label>
                    <input type="text" id="configName" name="configName" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="cpu" class="form-label">CPU:</label>
                    <input type="text" id="cpu" name="cpu" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="motherBoard" class="form-label">Alaplap:</label>
                    <input type="text" id="motherBoard" name="motherBoard" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="ram" class="form-label">RAM:</label>
                    <input type="text" id="ram" name="ram" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="gpu" class="form-label">GPU:</label>
                    <input type="text" id="gpu" name="gpu" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="hdd" class="form-label">HDD:</label>
                    <input type="text" id="hdd" name="hdd" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="ssd" class="form-label">SSD:</label>
                    <input type="text" id="ssd" name="ssd" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="powerSupply" class="form-label">Tápegység:</label>
                    <input type="text" id="powerSupply" name="powerSupply" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="cpuCooler" class="form-label">CPU Hűtő:</label>
                    <input type="text" id="cpuCooler" name="cpuCooler" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="configImage" class="form-label">Kép feltöltése:</label>
                    <input type="file" id="configImage" name="configImage" class="form-control" accept="image/*" required>
                </div>
                <button type="submit" class="btn btn-primary">Feltöltés</button>
            </form>
        `;

        // A konfiguráció form beküldése
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
            formData.append("cat_id", "2");
            formData.append("sale", "0");
            formData.append("active", "1");

            const response = await fetch("/api/add/uploadConfig", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (response.ok) {
                alert("SIKERES FELTÖLTÉS!");
                document.getElementById("configForm").reset();
            } else {
                const errorData = await response.json();
                alert(`Hiba történt a feltöltés során: ${errorData.message || "Ismeretlen hiba"}`);
            }
        });
    }
});


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
