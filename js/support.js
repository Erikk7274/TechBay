document.addEventListener('DOMContentLoaded', function () {
    const btnSend = document.querySelector('.btnSend');
    const btnBack = document.querySelector('.btnBack');
    // const backendImage = document.querySelector('.backendImage'); 

    // fetch('https://nodejs312.dszcbaross.edu.hu/profile/profilePic', {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `Bearer YOUR_JWT_TOKEN`
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.profilePicUrl) {
    //         document.getElementById('profileImage').src = data.profilePicUrl;
    //     }
    // });

    // document.getElementById('profilePicForm').addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append('profile_pic', document.getElementById('profilePic').files[0]);

    //     fetch('https://nodejs312.dszcbaross.edu.hu/profile/editProfilePic', {
    //         method: 'PUT',
    //         headers: {
    //             'Authorization': `Bearer YOUR_JWT_TOKEN`
    //         },
    //         body: formData
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         if (data.profilePicUrl) {
    //             document.getElementById('profileImage').src = data.profilePicUrl;
    //         }
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    // });

    if (btnBack) {
        btnBack.addEventListener('click', () => {
            console.log('Back button clicked');
            window.location.href = '../profile.html';
        });
    }

    if (btnSend) {
        btnSend.addEventListener('click', function () {
            console.log('Send button clicked');
            const emailInput = document.getElementById('emailInput');
            const messageInput = document.getElementById('messageInput');

            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            if (email.length >= 5 && message && email.includes("@")) {
                alert("Az üzenet sikeresen elküldve!");
                emailInput.value = '';
                messageInput.value = '';
            } else {
                if (!email.includes("@")) {
                    alert("Helyes E-mail címet adj meg!");
                } else {
                    alert("Minden mezőt ki kell tölteni!");
                }
            }
        });
    }
});
