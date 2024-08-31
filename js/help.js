//nome e cognome dinamici sidebar
document.addEventListener('DOMContentLoaded', function() {
    // Recupera il token dal localStorage
    const token = localStorage.getItem('token');
    console.log('Token retrieved:', token); // Verifica se il token è recuperato correttamente

    if (token) { 
        fetch('http://localhost:8080/api/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token // Usa il token recuperato
            },
        })
        .then(response => {
            console.log('Response status:', response.status); // Verifica lo stato della risposta
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('User data:', data); // Verifica i dati ricevuti
            document.getElementById('fullName').textContent = data.nomeCompleto;
        })
        .catch(error => console.error('Error fetching user data:', error));
    } else {
        console.error('Token not found. Please login again.');
    }
});

//logout
document.getElementById('logoutButton').addEventListener('click', async function(event) {
    event.preventDefault(); // Previeni l'azione di default del link
    console.log('Logout button clicked'); // Log per verificare che il click funzioni

    const token = localStorage.getItem('authToken');
    console.log('Token retrieved:', token); // Log per verificare il token

    const messageElement = document.getElementById('message');

    if (!token) {
        messageElement.textContent = 'No token found';
        messageElement.style.color = 'red';
        console.log('No token found');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Logout request sent'); // Log per verificare l'invio della richiesta

        if (response.ok) {
            localStorage.removeItem('authToken');
            messageElement.textContent = 'Logout successful';
            messageElement.style.color = 'green';
            console.log('Logout successful');
            setTimeout(() => {
                window.location.href = 'login.html'; // Redirect to login page after a short delay
            }, 1000);
        } else {
            const errorMessage = await response.text();
            messageElement.textContent = `Logout failed: ${errorMessage}`;
            messageElement.style.color = 'red';
            console.log('Logout failed:', errorMessage);
        }
    } catch (error) {
        console.error('Error during logout:', error);
        messageElement.textContent = 'Error during logout';
        messageElement.style.color = 'red';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(function(item) {
        item.querySelector('.accordion-header').addEventListener('click', function() {
            // Chiudi gli altri accordi
            accordionItems.forEach(function(innerItem) {
                if (innerItem !== item) {
                    innerItem.classList.remove('active');
                }
            });

            // Alterna lo stato attivo
            item.classList.toggle('active');
        });
    });
});

