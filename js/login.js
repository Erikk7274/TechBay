document.addEventListener('DOMContentLoaded', function () {
    const btnLogin = document.getElementById('btnLogin');

    if (btnLogin) {
        btnLogin.addEventListener('click', login);
    } else {
        console.error("Nem található a 'btnLogin' gomb.");
    }
});

async function login() {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');

    if (!emailInput || !passwordInput) {
        console.error("Az 'emailInput' vagy 'passwordInput' nem található.");
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Minden mezőt ki kell tölteni!");
        return;
    }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        const data = await res.json(); // JSON válasz beolvasása

        if (res.ok) {
            resetInputs();

            if (Number(data.admin) === 1) {
                alert("Sikeres bejelentkezés! Admin jogokkal.");
                window.location.href = 'https://techbay2.netlify.app/homeAdmin.html';
            } else {
                alert("Sikeres bejelentkezés!");
                window.location.href = 'https://techbay2.netlify.app/home.html';
            }
        } else {
            handleErrors(data);
        }
    } catch (error) {
        console.error("Hiba történt a kérés során:", error);
        alert("Nem sikerült csatlakozni a szerverhez.");
    }
}

function resetInputs() {
    document.getElementById('emailInput').value = '';
    document.getElementById('passwordInput').value = '';
}

function handleErrors(data) {
    if (data.errors) {
        let errorMessage = data.errors.map(err => err.error).join('\n');
        alert(errorMessage);
    } else if (data.error) {
        alert(data.error);
    } else {
        alert('Hiba történt.');
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const btnLogin = document.getElementById('btnLogin');
    const messageBtn = document.getElementById('messageBtn');

    if (btnLogin) {
        btnLogin.addEventListener('click', login);
    } else {
        console.error("Nem található a 'btnFrgPsw' gomb.");
    }

    if (messageBtn) {
        messageBtn.addEventListener('click', function () {
            alert("EGY DOLGA VAN AZ EMBERNEK");
        });
    } else {
        console.error("Nem található a gomb.");
    }
});
