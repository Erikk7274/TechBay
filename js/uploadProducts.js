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
        
        formData.append("product_name", document.getElementById("productName").value);
        formData.append("product_description", document.getElementById("productDescription").value);
        formData.append("product_price", document.getElementById("productPrice").value);
        formData.append("productImage", document.getElementById("productImage").files[0]);
        
        const category = document.getElementById("category").value;
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