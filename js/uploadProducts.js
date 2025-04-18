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
                <label for="productSaleActive" class="form-label">Akció:</label>
                <select id="productSaleActive" name="productSaleActive" class="form-select">
                    <option value="0">Nem</option>
                    <option value="1">Igen</option>
                </select>
                </div>
                <div class="mb-3" id="saleclass" style="display:none;">
                    <label for="productSale" class="form-label">Akció mértéke:</label>
                    <input type="number" id="productSale" name="productSale" class="form-control product" value="0">
                </div>
                <div class="mb-3">
                    <label for="productCategory" class="form-label">Termék kategória:</label>
                    <select id="productCategory" name="productCategory" class="form-select">
                        <option value="6">Processzor</option>
                        <option value="7">Alaplap</option>
                        <option value="8">Gépház</option>
                        <option value="9">Videókártya</option>
                        <option value="10">RAM</option>
                        <option value="11">Táp egység</option>
                        <option value="12">HDD</option>
                        <option value="13">SSD</option>
                        <option value="14">Processzor hűtő</option>
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

        document.getElementById("productSaleActive").addEventListener("change", function () {
            const saleif = document.getElementById('saleclass');
            if (this.value === "0") {
                saleif.style.display = "none";
            } else if (this.value === "1") {
                saleif.style.display = "block";
            }
        });

        document.getElementById("productForm").addEventListener("submit", async (event) => {
            event.preventDefault();

            // ELLENŐRIZD, HOGY AZ ÁR ÉS A RAKTÁRON KÉSZLET KÉSZLETEZETT
            const productPrice = document.getElementById("productPrice").value;
            const productStock = document.getElementById("productStock").value;

            // Ha bármi nem szám, vagy üres a mező, akkor hibaüzenet
            if (isNaN(productPrice) || isNaN(productStock) || productPrice === "" || productStock === "") {
                alert("Ár és raktáron mezők nem lehetnek üresek vagy hibásak!");
                return; // Ne folytasd a form beküldését, ha hiba van.
            }

            // Ha a fenti ellenőrzés sikeres, akkor folytathatod az adatgyűjtést
            const productData = new FormData();
            productData.append('product_name', document.getElementById("productName").value);
            productData.append('description', document.getElementById("productDescription").value);
            productData.append('price', productPrice); // Módosított, biztosan szám érték kerül
            productData.append('in_stock', productStock); // Módosított, biztosan szám érték kerül
            productData.append('sale', document.getElementById("productSale").value);
            productData.append('sale_', document.getElementById("productSaleActive").value);
            productData.append('cat_id', document.getElementById("productCategory").value);

            let productImage = document.getElementById("productImage").files[0];
            if (productImage) {
                productData.append('product_pic', productImage);
            }

            //category id

            let catId = parseInt(document.getElementById("productCategory").value);

            document.getElementById("productCategory").addEventListener("change", function () {
                catId = parseInt(this.value);
                console.log("catId értéke:", catId);
            });



            // let catId = 6;  // Alapértelmezett kategória
            // if (categoryValue === "cpu") {
            //     catId = 6;
            // } else if (categoryValue === "mother_board") {
            //     catId = 7;
            // } else if (categoryValue === "house") {
            //     catId = 8;
            // } else {
            //     alert("Kérlek válassz egy kategóriát!"); // Ha nem érvényes kategória
            //     return; // Ne folytasd a form beküldését, ha nincs kiválasztott kategória
            // }
            // productData.append('cat_id', catId);


            const response = await fetch("/api/add/uploadProduct", {
                method: "POST",
                credentials: "include",
                body: productData
            });

            if (response.ok) {
                alert("SIKERES FELTÖLTÉS!");
                document.getElementById("productForm").reset();
            } else {
                const errorData = await response.json();
                console.error("Hiba: ", errorData);
                alert(`Hiba történt a feltöltés során: ${errorData.message || "Ismeretlen hiba"}`);
            }
        });

    }

    function createConfigForm() {
        formContainer.innerHTML = `
        <form id="configForm" class="container mt-4 p-4 border rounded bg-light shadow-lg">
            <div class="row">
                <div class="col-md-6">
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
                        <label for="house" class="form-label">Gépház:</label>
                        <input type="text" id="house" name="house" class="form-control config" required>
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
                    <label for="configDescription" class="form-label">Leírás:</label>
                    <textarea id="configDescription" name="configDescription" class="form-control config"></textarea>
                </div>
                    <div class="mb-3">
                        <label for="configPrice" class="form-label">Ár:</label>
                        <input type="number" id="configPrice" name="configPrice" class="form-control config" required>
                    </div>
                    <label for="configSaleActive" class="form-label">Akció:</label>
                    <select id="configSaleActive" name="configSaleActive" class="form-select">
                        <option value="0">Nem</option>
                        <option value="1">Igen</option>
                    </select>
                    <div class="mb-3" id="saleclass" style="display:none;">
                        <label for="configSale" class="form-label">Akció mértéke:</label>
                        <input type="number" id="configSale" name="configSale" class="form-control" value="0">
                    </div>
                    <div class="mb-3">
                    <label for="configStock" class="form-label">Raktáron:</label>
                    <input type="number" id="configStock" name="configStock" class="form-control config" required>
                    </div>
                    <div class="mb-3">
                    <label for="configActive" class="form-label">Aktív:</label>
                    <input type="checkbox" id="configActive" name="configActive" class="form-check-input" value="1">
                </div>
                </div>
                <div class="col-md-6 d-flex flex-column align-items-center">
                    <div class="mb-3 w-100">
                        <label for="configImage" class="form-label">Kép feltöltése:</label>
                        <input type="file" id="configImage" name="configImage" class="form-control" accept="image/*" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Feltöltés</button>
                    <button type="button" class="btn btn-secondary w-100 mt-3" id="backToCategory">Vissza</button>
                </div>
            </div>
        </form>
        `;

        document.getElementById("backToCategory").addEventListener("click", () => {
            window.location.href = '../uploadProducts.html';
        });

        document.getElementById("configSaleActive").addEventListener("change", function () {
            const saleif = document.getElementById('saleclass');
            if (this.value === "0") {
                saleif.style.display = "none";
            } else if (this.value === "1") {
                saleif.style.display = "block";
            }
        });

        document.getElementById("configForm").addEventListener("submit", async (event) => {
            event.preventDefault();

            // Ár ellenőrzése
            const configPrice = document.getElementById("configPrice").value;

            // Ellenőrizzük, hogy az ár szám és nem üres
            if (isNaN(configPrice) || configPrice === "" || Number(configPrice) <= 0) {
                alert("Ár mező nem lehet üres, nem szám, vagy 0-nál kisebb!");
                return; // Ne folytasd, ha hiba van
            }

            const configStock = document.getElementById("configStock").value;

            if (isNaN(configStock) || configStock === "") {
                alert("A raktáron mezők nem lehetnek üresek vagy hibásak!");
                return; 
            }


          
            const configData = new FormData();
            configData.append('pc_name', document.getElementById("configName").value);
            configData.append('cpu', document.getElementById("cpu").value);
            configData.append('mother_board', document.getElementById("motherBoard").value);
            configData.append('house', document.getElementById("house").value);
            configData.append('ram', document.getElementById("ram").value);
            configData.append('gpu', document.getElementById("gpu").value);
            configData.append('hdd', document.getElementById("hdd").value);
            configData.append('ssd', document.getElementById("ssd").value);
            configData.append('power_supply', document.getElementById("powerSupply").value);
            configData.append('cpu_cooler', document.getElementById("cpuCooler").value);
            configData.append('pc_price', Number(configPrice)); // Ár szám formátumban
            configData.append('pc_pic', document.getElementById("configImage").files[0]);
            configData.append('pc_description', document.getElementById("configDescription").value);
            configData.append('in_stock', document.getElementById("configStock").value);
            configData.append('sale', document.getElementById("configSale").value); // Akció mértéke
            configData.append('sale_', document.getElementById("configSaleActive").value); // Akciós státusz
            configData.append('active', document.getElementById("configActive").checked ? "1" : "0");



            // Form adatküldése
            const response = await fetch("/api/add/uploadConfig", {
                method: "POST",
                credentials: "include",
                body: configData
            });

            const responseText = await response.text(); // a válasz szöveges formában
console.log(responseText); // Naplózd ki a választ

            if (response.ok) {
                alert("SIKERES FELTÖLTÉS!");
                document.getElementById("configForm").reset();
            } else {
                const errorData = await response.json();
                alert("Hiba történt a feltöltés közben: " + errorData.message);
            }
        });

    }

});