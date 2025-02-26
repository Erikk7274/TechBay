const btnBack = document.querySelector('.btnBack');
const btnLogout = document.querySelector('icon-logout');

// Vissza gomb eseménykezelője
if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.location.href = 'https://techbay2.netlify.app/home.html';
    });
}

// Kijelentkezés függvény
async function logout() {
    const res = await fetch('/api/auth/logout', {
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

