function saveBtn() {
    alert("SIKERES MENTÉS!");
}

const btnEdit = document.querySelector('.btnEdit');
const btnBack = document.querySelector('.btnBack');

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
        window.location.href = '../login.html'; // Redirect to login if no token
    } else {
        getMemes(); // Replace with your actual function if needed
    }
});

const btnLogout = document.querySelector('.icon-logout');
btnLogout.addEventListener('click', logout);

async function logout() {
    const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });

    if (res.ok) {
        // Remove token from localStorage and sessionStorage
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        
        alert('Sikeres kijelentkezés');
        window.location.href = '../login.html'; // Redirect to login after logout
    } else {
        alert('Hiba a kijelentkezéskor');
    }
}

btnBack.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/profile.html'; // Redirect to profile page
});

btnEdit.addEventListener('click', EditProfilePic);

async function EditProfilePic() {
    const profile_pic = document.querySelector('#fileUpload').files[0];
    console.log(profile_pic);

    if (!profile_pic) {
        alert('Nincs fájl kiválasztva!');
        return;
    }

    const formData = new FormData();
    formData.append('profile_pic', profile_pic);

    const res = await fetch('/api/profile/editProfilePic', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
    });

    const data = await res.json();

    if (res.ok) {
        alert(data.message);
        window.location.href = 'https://techbay2.netlify.app/profile.html'; // Redirect after successful update
    } else {
        alert('Hiba a profilkép frissítésekor');
    }
}
