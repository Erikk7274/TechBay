window.addEventListener('DOMContentLoaded', getProducts);

// Gombok lekérése
const btnPreBuilt = document.querySelector('.btnPreBuilt');
const homeBtn=document.getElementsByClassName('icon-home')[0];
const userBtn=document.getElementsByClassName('icon-user')[0];
const cartBtn=document.getElementsByClassName('icon-cart')[0];
const btnLogout = document.getElementsByClassName('icon-logout')[0];

// Kategóriák elemeinek lekérése
const row = document.getElementById('row');

// Termékek lekérése
async function getProducts() {
    try {
        const response = await fetch(`/api/getProducts/getProducts_all`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log(response);
        const products = await response.json();
        console.log(products);

        console.log(`Lekért termékek:`, products);

        //renderCategory(category, result);
        renderProducts(products);
    } catch (error) {
        console.error('Hiba a termékek lekérésekor:', error);
    }
}


function renderProducts(products) {
    console.log(products);
    let html = `<h2>asdsad</h2><div class="products">`;
    products.forEach(product => {
        console.log(product);
        html += `
        <div class="product">
            <img src='/uploads/${product.product_pic}' alt="${product.product_name}" />
            <h3>${product.product_name}</h3>
            <p>${product.price}</p>
        </div>
    `;
    });

    html += '</div>';

    console.log(html);

    row.innerHTML = html;
}
btnLogout.addEventListener('click', logout);

homeBtn.addEventListener('click',()=>{
    window.location.href='https://techbay2.netlify.app/home.html';
})

userBtn.addEventListener('click',()=>{
    window.location.href='https://techbay2.netlify.app/profile.html';
})

cartBtn.addEventListener('click',()=>{
    window.location.href='https://techbay2.netlify.app/cart.html';
})
btnPreBuilt.addEventListener('click',()=>{
    window.location.href='https://techbay2.netlify.app/preBuilt.html';
})