function saveBtn(){
    alert("SIKERES MENTÉS!");
}

const btnEdit = document.querySelector('.btnEdit');
const btnBack = document.querySelector('.btnBack');

//logout
const btnLogout = document.querySelector('.icon-logout');
btnLogout.addEventListener('click', logout);
async function logout() {
    const res = await fetch('http://192.168.10.25:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
        alert(data.message);
        window.location.href = '../index.html';
    } else {
        alert('Hiba a kijelentkezéskor');
    }
}
//

btnBack.addEventListener('click', () => {
    window.location.href = '../profile.html';

});
    btnEdit.addEventListener('click',EditProfilePic);

    async function EditProfilePic()
    {
        const profile_pic=document.querySelector('#fileUpload').files[0];
        console.log(profile_pic);

        const formData = new FormData();
        formData.append('profile_pic', profile_pic);

        const res=await fetch('http://192.168.10.25:3000/api/profile/editProfilePic',{
            method:'PUT',
            body: formData,
            credentials:'include',
        },

        )
        const data=await res.json();

        if(res.ok){
            alert(data.message);
            window.location.href = '../profile.html';
        }else {
            alert('Hiba');
        }
    }