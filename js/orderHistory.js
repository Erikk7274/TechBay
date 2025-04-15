window.addEventListener('DOMContentLoaded', () => {
    getusername();

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

async function getusername() {
    const res = await fetch('/api/profile/Myusername', {
        method: 'GET',
        credentials: 'include'
    });
    const username = await res.json();
    console.log(username);
    profileData(username);

    const profilePic = document.querySelector('.profile_pic');
    if (res.ok && username[0].profile_pic) {
        profilePic.src = `/api/uploads/${username[0].profile_pic}`;
    } else {
        profilePic.src = '/uploads/1.jpg';
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
