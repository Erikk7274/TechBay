function saveBtn() {
    alert("SIKERES MENTÉS!");
}

const btnEdit = document.querySelector('.btnEdit');
const btnBack = document.querySelector('.btnBack');


const btnLogout = document.querySelector('.icon-logout');
btnLogout.addEventListener('click', logout);
async function logout() {
    const res = await fetch('https://nodejs312.dszcbaross.edu.hu/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });



    const data = await res.json();

    if (res.ok) {
        alert(data.message);
        window.location.href = 'https://techbay2.netlify.app/index.html';
    } else {
        alert('Hiba a kijelentkezéskor');
    }
}
//

btnBack.addEventListener('click', () => {
    window.location.href = 'https://techbay2.netlify.app/profile.html';
});
btnEdit.addEventListener('click', EditProfilePic);

async function EditProfilePic() {
    const profile_pic = document.querySelector('#fileUpload').files[0];
    console.log(profile_pic);

    const formData = new FormData();
    formData.append('profile_pic', profile_pic);

    const res = await fetch('https://nodejs312.dszcbaross.edu.hu/api/profile/editProfilePic', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
    });

    const data = await res.json();

    if (res.ok) {
        alert(data.message);
        window.location.href = 'https://techbay2.netlify.app/profile.html';
    } else {
        alert('Hiba');
    }
}

