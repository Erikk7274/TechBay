document.addEventListener('DOMContentLoaded', function () {
    const row = document.getElementById('row');
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modalText');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const modalClose = document.getElementById('modalClose');

    // Sample PC data for the cards
    const pcs = [
        { name: 'PC 1', details: 'Részletek a PC 1-ről' },
        { name: 'PC 2', details: 'Részletek a PC 2-ről' },
        { name: 'PC 3', details: 'Részletek a PC 3-ról' }
    ];

    // Render cards and handle click for modal
    pcs.forEach(pc => {
        const card = document.createElement('div');
        card.classList.add('col-md-4');
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${pc.name}</h5>
                    <p class="card-text">Klikk ide a részletekhez</p>
                    <button class="btn btn-primary" id="modalOpenButton-${pc.name}">Megtekintés</button>
                </div>
            </div>
        `;
        row.appendChild(card);

        // Handle button click to show modal
        const modalOpenButton = document.getElementById(`modalOpenButton-${pc.name}`);
        modalOpenButton.addEventListener('click', () => {
            showModal(pc.details);
        });
    });

    // Show modal function
    function showModal(details) {
        modal.style.display = 'block';
        modalText.textContent = details;
    }

    // Close modal
    modalCloseButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

});
