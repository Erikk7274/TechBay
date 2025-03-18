document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".container");
    formContainer.innerHTML = `
        <form id="productForm" class="container mt-4 p-4 border rounded bg-light">
        <div class="mb-3">
        <label for="category" class="form-label">Kategória:</label>
        <select id="category" name="category" class="form-select" required>
            <option value="product">Termék</option>
            <option value="config">Prebuilt</option>
        </select>
    </div>
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

    document.getElementById("productForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData();
        
        const category = document.getElementById("category").value;
        
        if (category === "product") {
            formData.append("product_name", document.getElementById("productName").value);
            formData.append("product_description", document.getElementById("productDescription").value);
            formData.append("price", document.getElementById("productPrice").value);
            formData.append("product_pic", document.getElementById("productImage").files[0]);
            formData.append("in_stock", "1"); // Hozzáadtam az "in_stock" mezőt
            formData.append("cat_id", "1"); // Kategória azonosító, módosítsd szükség szerint
            formData.append("sale", "0"); // Akciós termék (0 = nem akciós)
        } else if (category === "config") {
            formData.append("config_name", document.getElementById("productName").value);
            formData.append("description", document.getElementById("productDescription").value);
            formData.append("price", document.getElementById("productPrice").value);
            formData.append("config_pic", document.getElementById("productImage").files[0]);
            formData.append("in_stock", "1"); // Hozzáadtam az "in_stock" mezőt
            formData.append("cat_id", "2"); // Kategória azonosító, módosítsd szükség szerint
            formData.append("sale", "0"); // Akciós termék (0 = nem akciós)
            formData.append("power_supply", "650W"); // Példa a "power_supply" mezőre, tedd hozzá a többit is
            formData.append("cpu", "Intel i7"); // Példa a "cpu" mezőre
            formData.append("mother_board", "Asus Z490"); // Példa a "mother_board" mezőre
            formData.append("ram", "16GB"); // Példa a "ram" mezőre
            formData.append("gpu", "NVIDIA GTX 1660"); // Példa a "gpu" mezőre
            formData.append("hdd", "1TB HDD"); // Példa a "hdd" mezőre
            formData.append("ssd", "512GB SSD"); // Példa a "ssd" mezőre
            formData.append("cpu_cooler", "Cooler Master"); // Példa a "cpu_cooler" mezőre
            formData.append("active", "1"); // Aktív konfiguráció (1 = aktív)
        }

        const endpoint = category === "config" ? "/api/add/uploadConfig" : "/api/add/uploadProduct";
        
        try {
            const response = await fetch(endpoint, {
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
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Hálózati hiba történt. Ellenőrizd az internetkapcsolatot és próbáld újra.");
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
});
