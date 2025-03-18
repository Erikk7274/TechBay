document.addEventListener("DOMContentLoaded", () => {
    const formContainer = document.querySelector(".container");
    formContainer.innerHTML = `
        <form id="productForm">
            <label for="productName">Termék neve:</label>
            <input type="text" id="productName" name="productName" required>
            
            <label for="productDescription">Leírás:</label>
            <textarea id="productDescription" name="productDescription" required></textarea>
            
            <label for="productPrice">Ár:</label>
            <input type="number" id="productPrice" name="productPrice" required>
            
            <label for="productImage">Kép feltöltése:</label>
            <input type="file" id="productImage" name="productImage" accept="image/*" required>
            
            <label for="category">Kategória:</label>
            <select id="category" name="category" required>
                <option value="product">Termék</option>
                <option value="config">Prebuilt</option>
            </select>
            
            <button type="submit">Feltöltés</button>
        </form>
        <button class="btnBack">Vissza</button>
    `;

    document.getElementById("productForm").addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData();
        
        formData.append("name", document.getElementById("productName").value);
        formData.append("description", document.getElementById("productDescription").value);
        formData.append("price", document.getElementById("productPrice").value);
        formData.append("image", document.getElementById("productImage").files[0]);
        
        const category = document.getElementById("category").value;
        const endpoint = category === "config" ? "/api/uploadConfig" : "/api/uploadProduct";
        
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
                alert("Hiba történt a feltöltés során.");
            }
        } catch (error) {
            console.error("Hálózati hiba:", error);
            alert("Hálózati hiba történt.");
        }
    });

    document.querySelector(".btnBack").addEventListener("click", () => {
        window.location.href = 'https://techbay2.netlify.app/profile.html';
    });
    
    document.querySelector(".btnEdit").addEventListener("click", EditProfilePic);

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
            alert('Hiba a kijelentkezéskor');
        }
    });
});