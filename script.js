document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del modal
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalPrice = document.getElementById('modal-price');
    const modalRating = document.getElementById('modal-rating');
    const modalDescription = document.getElementById('modal-description');
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));

    // Referencia al input de búsqueda
    const searchInput = document.querySelector('.input-group input');

    // Función para abrir el modal con la información de la tarjeta
    function openModal(item) {
        modalImage.src = item.image;
        modalName.textContent = item.name;
        modalPrice.textContent = item.price;
        modalRating.textContent = item.rating;
        modalDescription.textContent = item.description;
        detailsModal.show();
    }

    // Función para crear tarjetas de destinos o viajes
    function createCard(item, container) {
        const card = document.createElement('div');
        card.className = 'col-6 col-md-4 mb-4';
        card.innerHTML = `
            <div class="destination-card">
                <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                <p class="mt-2 mb-0">${item.name}</p>
                <small>${item.price} ${item.rating || ''}</small>
            </div>
        `;
        card.addEventListener('click', () => openModal(item));
        container.appendChild(card);
    }

    // Función para cargar los destinos y viajes (puede filtrarse por búsqueda)
    function loadDestinations(filteredData = null) {
        const dataToLoad = filteredData || {
            popularDestinations: [],
            adventureTrips: []
        };

        const popularDestinationsContainer = document.getElementById('popular-destinations');
        const adventureTripsContainer = document.getElementById('adventure-trips');
        popularDestinationsContainer.innerHTML = '';
        adventureTripsContainer.innerHTML = '';

        dataToLoad.popularDestinations.forEach(destination => createCard(destination, popularDestinationsContainer));
        dataToLoad.adventureTrips.forEach(trip => createCard(trip, adventureTripsContainer));
    }

    // Función para cargar los datos y aplicar el filtro de búsqueda
    function fetchAndFilterData(query) {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Filtrar destinos y viajes de aventura según la búsqueda
                const filteredPopularDestinations = data.popularDestinations.filter(destination =>
                    destination.name.toLowerCase().includes(query.toLowerCase())
                );

                const filteredAdventureTrips = data.adventureTrips.filter(trip =>
                    trip.name.toLowerCase().includes(query.toLowerCase())
                );

                const filteredData = {
                    popularDestinations: filteredPopularDestinations,
                    adventureTrips: filteredAdventureTrips
                };

                // Cargar los destinos filtrados
                loadDestinations(filteredData);
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    }

    // Función para cargar destinos limitados
    function loadLimitedDestinations() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                loadDestinations(data); // Cargar todos los destinos sin filtrar
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    }

    // Event listener para filtrar los destinos cuando el usuario escribe en el campo de búsqueda
    searchInput.addEventListener('input', function(event) {
        const query = event.target.value;
        fetchAndFilterData(query); // Filtrar y mostrar los resultados
    });

    // Función para guardar la reserva en localStorage
    function saveReservation(destination) {
        let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
        reservations.push(destination); // Agregar el destino al array de reservas
        localStorage.setItem('reservations', JSON.stringify(reservations)); // Guardar en localStorage
    }

    // Función para manejar el clic en el botón Book Now
    const bookButton = document.querySelector('.book');
    if (bookButton) {
        bookButton.onclick = () => {
            const item = {
                name: modalName.textContent,
                price: modalPrice.textContent,
                rating: modalRating.textContent,
                image: modalImage.src,
                description: modalDescription.textContent
            };
            saveReservation(item); // Guardar la reserva
            window.location.href = 'perfil.html'; // Redirigir al perfil
        };
    }

    // Cargar los destinos cuando se cargue la página
    loadLimitedDestinations();
});
