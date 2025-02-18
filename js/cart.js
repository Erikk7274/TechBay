const btnBack = document.querySelector('.btnBack');
const btnLogout = document.querySelector('icon-logout');

// Vissza gomb eseménykezelője
if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.location.href = 'https://erikk7274.github.io/TechBay/home.html';
    });
}

// Kijelentkezés függvény
async function logout() {
    const res = await fetch('https://nodejs312.dszcbaross.edu.hu/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
        alert(data.message);
    } else {
        alert('Hiba a kijelentkezéskor');
    }
}

