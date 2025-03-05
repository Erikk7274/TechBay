const selectedParts = {};

const getProducts = async () => {
    const categories = ['cpus', 'motherboards', 'houses', 'gpus', 'rams', 'powersupplys', 'hdds', 'ssds', 'cpucoolers'];
    
    for (const category of categories) {
        const response = await fetch(`https://nodejs312.dszcbaross.edu.hu/api/getProducts/getProducts_${category}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        const data = await response.json();
        
        console.log(`Lekért termékek (${category}):`, data);

        if (data.length === 0) {
            console.log(`Nincs termék a(z) ${category} kategóriában.`);
        } else {
            renderCategory(category, data);
        }
    }
};

const renderCategory = (category, products) => {
    const categoryContainer = document.getElementById(`category-${category}`);
    
    if (categoryContainer) {
        categoryContainer.innerHTML = '';
        
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.innerHTML = `
                <h3>${product.product_name}</h3>
                <p>Price: ${product.price}</p>
                <p>In Stock: ${product.in_stock}</p>
                <button class="select-part" data-category="${category}" data-id="${product.product_id}">Select</button>
            `;
            categoryContainer.appendChild(productDiv);
        });
        
        setUpButtonListeners();
    } else {
        console.error(`Category container for ${category} not found!`);
    }
};

const setUpButtonListeners = () => {
    // Kiválasztott alkatrészek
    const btnPreBuilt = document.querySelector('.btnPreBuilt');
    const btnHardware = document.querySelector('.btnHardware');
    const btnLogout = document.querySelector('.btnLogout');
    
    // PreBuilt konfiguráció gomb
    if (btnPreBuilt) {
        btnPreBuilt.addEventListener('click', () => {
            console.log('Pre-built configuration clicked');
            // Pre-built konfiguráció logika itt
        });
    }
    
    // Hardver alkatrész gomb
    if (btnHardware) {
        btnHardware.addEventListener('click', () => {
            console.log('Hardware configuration clicked');
            // Hardver alkatrész konfigurálás logika itt
        });
    }
    
    // Kilépés gomb
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '/login'; // Visszairányítás a bejelentkezéshez
            console.log('Logged out');
        });
    }
};

const selectPart = (category, productId) => {
    console.log(`Kiválasztott alkatrész: ${category}, ${productId}`);
    
    // További logika a kiválasztott alkatrészek kezelésére
    selectedParts[category] = productId;
    renderSummary();
};

const renderSummary = () => {
    const summaryContainer = document.getElementById('summary');
    
    if (summaryContainer) {
        summaryContainer.innerHTML = '<h3>Selected Parts</h3>';
        
        for (const category in selectedParts) {
            const productId = selectedParts[category];
            const partSummary = document.createElement('div');
            partSummary.innerHTML = `<p>${category}: Product ID ${productId}</p>`;
            summaryContainer.appendChild(partSummary);
        }
    } else {
        console.error('Summary container not found!');
    }
};

// Inicializálás
const initialize = () => {
    getProducts();  // Termékek betöltése
    setUpButtonListeners();  // Gombok eseménykezelői
};

initialize();
