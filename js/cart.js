const btnBack = document.querySelector('.btnBack');
const btnLogout = document.querySelector('icon-logout');

if (btnBack) {
    btnBack.addEventListener('click', () => {
        window.location.href = '../home.html';
    });
}



async function logout() {
    const res = await fetch('http://192.168.10.25:3000/api/auth/logout', {
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
