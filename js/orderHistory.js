window.addEventListener('DOMContentLoaded', () => {
    

    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.addEventListener('click', editData);

    const homeBtn = document.querySelector('.icon-home');
    const userBtn = document.querySelector('.icon-user');
    const cartBtn = document.querySelector('.icon-cart');
    const btnLogout = document.querySelector('.icon-logout');
    const btnBack = document.querySelector('.btnBack .btn');

    if (homeBtn) homeBtn.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/home.html';
    });

    if (userBtn) userBtn.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/profile.html';
    });

    if (cartBtn) cartBtn.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/cart.html';
    });

    if (btnLogout) btnLogout.addEventListener('click', logout);

    if (btnBack) btnBack.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/profile.html';
    });

    window.addEventListener('click', function (event) {
        const menuToggle = document.getElementById('menu-toggle');
        const menu = document.querySelector('nav');
        const hamburgerButton = document.querySelector('.hamburger-menu');

        if (
            hamburgerButton &&
            menu &&
            menuToggle &&
            !hamburgerButton.contains(event.target) &&
            !menu.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            menuToggle.checked = false;
        }
    });
});


async function getOrderHistory() {
    try {
        const res = await fetch('/api/profile/MyOrderHistory', {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Nem sikerült lekérni a rendelési előzményeket.');
        }

        const orders = await res.json();
        const container = document.querySelector('.container');

        const ul = document.createElement('ul');
        ul.classList.add('order-list');

        orders.forEach(order => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Rendelés ID:</strong> ${order.order_id || 'N/A'} <br>
                <strong>Dátum:</strong> ${order.order_date || 'N/A'} <br>
                <strong>Összeg:</strong> ${order.total_amount || 'N/A'} Ft <br>
                <strong>Státusz:</strong> ${order.status || 'N/A'}
                <hr>
            `;
            ul.appendChild(li);
        });

        container.appendChild(ul);

    } catch (error) {
        console.error('Hiba a rendelés betöltésekor:', error);
    }
}


async function logout() {
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
}
