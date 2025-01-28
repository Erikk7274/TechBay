document.addEventListener('DOMContentLoaded', function () {
    const btnRegister = document.getElementById('btnRegister');

    if (btnRegister) {
        btnRegister.addEventListener('click', async function () {
            const emailInput = document.getElementById('emailInput');
            const passwordInput = document.getElementById('passwordInput');
            const scndpasswordInput = document.getElementById('scndpasswordInput');
            const nameInput = document.getElementById('nameInput');

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();
            const password2 = scndpasswordInput.value.trim();
            const name = nameInput.value.trim();

            if (email.length >= 5 && password.length >= 8 && password2 === password && email.includes("@") && name.length > 2) {
                try {
                    const res = await fetch('http://192.168.10.25:3000/api/auth/register', {
                        method: "POST",
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({ email, name, password })
                    });

                    if (res.ok) {
                        alert("Sikeres regisztráció!");
                        window.location.href = '../login.html';
                        emailInput.value = '';
                        passwordInput.value = '';
                        scndpasswordInput.value = '';
                        nameInput.value = '';
                    } else {
                        const errorMessage = res.status === 400 
                            ? "Hibás adatokat küldtél!"
                            : res.status === 500 
                            ? "Szerverhiba, próbáld újra később."
                            : `Váratlan hiba: ${res.status}`;
                        alert(`Hiba: ${errorMessage}`);
                        console.error("Válasz hiba:", await res.text());
                    }
                } catch (err) {
                    console.error("Fetch hiba:", err);
                    alert("Hálózati hiba történt. Próbáld újra később.");
                }
            } else {
                if (!email.includes("@")) {
                    alert("Adj meg egy érvényes email-címet!");
                } else if (password.length <= 7) {
                    alert("A jelszónak legalább 8 karakter hosszúnak kell lennie!");
                } else if (password2 !== password) {
                    alert("A megadott jelszavak nem egyeznek!");
                } else {
                    alert("Minden mezőt ki kell tölteni!");
                }
            }
        });
    } else {
        console.error("A gomb nem található!");
    }
});
