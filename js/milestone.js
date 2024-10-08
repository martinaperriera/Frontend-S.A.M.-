document.addEventListener('DOMContentLoaded', function() {
    // Funzione per recuperare nome e cognome
    function loadUserName() {
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
    }

    // Funzione per il logout
    function setupLogout() {
        document.getElementById('logoutButton').addEventListener('click', async function(event) {
            event.preventDefault(); 
            console.log('Logout button clicked'); 

            const token = localStorage.getItem('token');
            console.log('Token retrieved:', token); // Log per verificare il token

            const messageElement = document.getElementById('message');

            if (!token) {
                messageElement.textContent = 'No token found';
                messageElement.style.color = 'red';
                console.log('No token found');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': `${token}`
                    }
                });

                console.log('Logout request sent'); // Log per verificare l'invio della richiesta

                if (response.ok) {
                    localStorage.removeItem('token');
                    messageElement.textContent = 'Logout successful';
                    messageElement.style.color = 'green';
                    console.log('Logout successful');
                    setTimeout(() => {
                        window.location.href = 'index.html'; 
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
    }

    // Carica il nome e cognome
    loadUserName();
    
    // Imposta il logout
    setupLogout();
});