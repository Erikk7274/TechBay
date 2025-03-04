document.addEventListener('DOMContentLoaded', function () {
    const btnLogin = document.getElementById('btnLogin'); 

    if (btnLogin) {
        btnLogin.addEventListener('click', login); 
    } else {
        console.error("Nem található a 'btnLogin' azonosítójú gomb.");
    }
});

async function login() {
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');

    if (!emailInput || !passwordInput) {
        console.error("Az 'emailInput' vagy 'passwordInput' mező nem található.");
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Minden mezőt ki kell tölteni!");
        return;
    }

    try {
        const res = await fetch('https://nodejs312.dszcbaross.edu.hu/api/auth/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include' ,
        });

        const data = await res.json();

        if (res.ok) {
            resetInputs();

            

            if (data.admin === 1) {
                alert("Sikeres bejelentkezés! Admin jogokkal.");
                console.log(data.admin);
                console.log("ADMIN VAGY");
                window.location.href = 'https://techbay2.netlify.app/adminHome.html';
            } else {
                console.log(data.admin);
                alert("Sikeres bejelentkezés!");
                window.location.href = 'https://techbay2.netlify.app/home.html'; 
            }
            
        } else if (data.errors) {
            let errorMessage = '';
            data.errors.forEach(err => {
                errorMessage += `${err.error}\n`;
            });
            alert(errorMessage);
        } else if (data.error) {
            alert(data.error);
        } else {
            alert('Ismeretlen hiba történt.');
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
