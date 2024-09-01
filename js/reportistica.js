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


// Funzione per ottenere il colore in base allo stato
function getColorForStatus(status) {
    switch (status?.toLowerCase()) {
        case 'completato':
            return 'green';
        case 'testing':
            return 'pink';
        case 'dev ok':
            return 'blue';
        case 'in progress':
            return 'purple';
        case 'to do':
            return 'red';
        default:
            return 'black';
    }
}

// Recupero dei progetti e generazione delle barre del grafico
fetch('http://localhost:8080/api/projects')
    .then(response => response.json())
    .then(data => {
        console.log('Data parsed:', data); // Verifica i dati ricevuti

        const container = document.querySelector('.simple-bar-chart');
        container.innerHTML = '';

        data.forEach((project) => {
            let progressPercentage = 0;

            switch (project.status?.toLowerCase()) {
                case 'completato':
                    progressPercentage = 100;
                    break;
                case 'testing':
                    progressPercentage = 70;
                    break;
                case 'dev ok':
                    progressPercentage = 50;
                    break;
                case 'in progress':
                    progressPercentage = 30;
                    break;
                case 'to do':
                    progressPercentage = 10;
                    break;
                default:
                    progressPercentage = 0;
            }

            console.log(`Project ${project.project_name} - Status: ${project.status}, Percentage: ${progressPercentage}`);

            // Creazione dell'elemento barra
            const item = document.createElement('div');
            item.classList.add('item');
            item.style.setProperty('--clr', getColorForStatus(project.status));
            item.style.setProperty('--val', progressPercentage);

            // Creazione delle etichette (label e value)
            const label = document.createElement('div');
            label.classList.add('label');
            label.textContent = project.project_name;

            const value = document.createElement('div');
            value.classList.add('value');
            value.textContent = `${progressPercentage}%`;

            // Aggiunta degli elementi 'value' e 'label' sotto la barra
            item.appendChild(value);
            item.appendChild(label);

            // Aggiungi l'elemento item (che contiene la barra, il valore e il label) al contenitore
            container.appendChild(item);
        });
    })
    .catch(error => console.error('Error fetching projects:', error));


/*tabella reportistica*/

// Funzione per formattare la data (opzionale)
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Funzione per inserire i dati nella tabella
function populateTable(data) {
    const tableBody = document.getElementById('reportTableBody');
    tableBody.innerHTML = ''; // Pulisce la tabella prima di inserire i dati

    data.forEach((project) => {
        // Crea una riga per ogni progetto
        const row = document.createElement('tr');

        // Crea le celle con i dati del progetto
        const progettoCell = document.createElement('td');
        const dataInizioCell = document.createElement('td');
        const dataFineCell = document.createElement('td');
        const statoCell = document.createElement('td');
        const dettagliCell = document.createElement('td');

        // Inserisci i dati nelle celle
        progettoCell.textContent = project.project_name;
        dataInizioCell.textContent = formatDate(project.start_date);
        dataFineCell.textContent = formatDate(project.end_date);
        statoCell.textContent = project.status;
        dettagliCell.textContent = project.value; // Usa il campo value per i dettagli

        // Aggiungi le celle alla riga
        row.appendChild(progettoCell);
        row.appendChild(dataInizioCell);
        row.appendChild(dataFineCell);
        row.appendChild(statoCell);
        row.appendChild(dettagliCell);

        // Aggiungi la riga al corpo della tabella
        tableBody.appendChild(row);
    });
}

// Funzione per recuperare i dati dal database
function fetchDataAndPopulateTable() {
    fetch('http://localhost:8080/api/projects')
        .then(response => response.json())
        .then(data => {
            console.log('Data received:', data); // Verifica i dati ricevuti
            populateTable(data); // Popola la tabella con i dati
        })
        .catch(error => console.error('Error fetching projects:', error));
}

// Chiama la funzione per caricare i dati al caricamento della pagina
document.addEventListener('DOMContentLoaded', fetchDataAndPopulateTable);


//andamento cons e man
async function loadAndVisualizeData() {
    try {
        // Recupera i dati dall'endpoint
        const response = await fetch('http://localhost:8080/api/projects');
        
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verifica i dati ricevuti
        console.log('Data received:', data);

        // Trasforma i dati per il grafico
        const userPerformance = {};

        data.forEach(item => {
            const userId = item.user.id;
            const userName = item.user.nomeCompleto;
            const total = parseFloat(item.total) || 0;

            if (!userPerformance[userId]) {
                userPerformance[userId] = {
                    name: userName,
                    totals: []
                };
            }
            userPerformance[userId].totals.push(total);
        });

        const performanceData = Object.keys(userPerformance).map(userId => ({
            name: userPerformance[userId].name,
            totals: userPerformance[userId].totals
        }));

        console.log('Performance Data:', performanceData);

        // Crea il grafico
        createLineChart(performanceData);
        
    } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
    }
}

function createLineChart(data) {
    const ctx = document.getElementById('performanceChart').getContext('2d');

    // Preparazione dei dati per Chart.js
    const datasets = data.map(user => ({
        label: user.name,
        data: user.totals.map((total, index) => ({ x: index + 1, y: total })),
        borderColor: getRandomColor(),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fill: false
    }));

    // Crea il grafico
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Task Index'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Total Performance'
                    }
                }
            }
        }
    });
}

// Funzione per generare colori casuali per le linee
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Carica e visualizza i dati quando il documento è pronto
document.addEventListener('DOMContentLoaded', loadAndVisualizeData);

//download report
// Funzione per ottenere il colore in base allo stato
function getColorForStatus(status) {
    switch (status?.toLowerCase()) {
        case 'completato':
            return 'green';
        case 'testing':
            return 'pink';
        case 'dev ok':
            return 'blue';
        case 'in progress':
            return 'purple';
        case 'to do':
            return 'red';
        default:
            return 'black';
    }
}

// Recupero dei progetti e generazione delle barre del grafico
fetch('http://localhost:8080/api/projects')
    .then(response => response.json())
    .then(data => {
        console.log('Data parsed:', data); // Verifica i dati ricevuti

        const container = document.querySelector('.simple-bar-chart');
        container.innerHTML = '';

        data.forEach((project) => {
            let progressPercentage = 0;

            switch (project.status?.toLowerCase()) {
                case 'completato':
                    progressPercentage = 100;
                    break;
                case 'testing':
                    progressPercentage = 70;
                    break;
                case 'dev ok':
                    progressPercentage = 50;
                    break;
                case 'in progress':
                    progressPercentage = 30;
                    break;
                case 'to do':
                    progressPercentage = 10;
                    break;
                default:
                    progressPercentage = 0;
            }

            console.log(`Project ${project.project_name} - Status: ${project.status}, Percentage: ${progressPercentage}`);

            // Creazione dell'elemento barra
            const item = document.createElement('div');
            item.classList.add('item');
            item.style.setProperty('--clr', getColorForStatus(project.status));
            item.style.setProperty('--val', progressPercentage);

            // Creazione delle etichette (label e value)
            const label = document.createElement('div');
            label.classList.add('label');
            label.textContent = project.project_name;

            const value = document.createElement('div');
            value.classList.add('value');
            value.textContent = `${progressPercentage}%`;

            // Aggiunta degli elementi 'value' e 'label' sotto la barra
            item.appendChild(value);
            item.appendChild(label);

            // Aggiungi l'elemento item (che contiene la barra, il valore e il label) al contenitore
            container.appendChild(item);
        });
    })
    .catch(error => console.error('Error fetching projects:', error));


/*tabella reportistica*/

// Funzione per formattare la data (opzionale)
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Funzione per inserire i dati nella tabella
function populateTable(data) {
    const tableBody = document.getElementById('reportTableBody');
    tableBody.innerHTML = ''; // Pulisce la tabella prima di inserire i dati

    data.forEach((project) => {
        // Crea una riga per ogni progetto
        const row = document.createElement('tr');

        // Crea le celle con i dati del progetto
        const progettoCell = document.createElement('td');
        const dataInizioCell = document.createElement('td');
        const dataFineCell = document.createElement('td');
        const statoCell = document.createElement('td');
        const dettagliCell = document.createElement('td');

        // Inserisci i dati nelle celle
        progettoCell.textContent = project.project_name;
        dataInizioCell.textContent = formatDate(project.start_date);
        dataFineCell.textContent = formatDate(project.end_date);
        statoCell.textContent = project.status;
        dettagliCell.textContent = project.value; // Usa il campo value per i dettagli

        // Aggiungi le celle alla riga
        row.appendChild(progettoCell);
        row.appendChild(dataInizioCell);
        row.appendChild(dataFineCell);
        row.appendChild(statoCell);
        row.appendChild(dettagliCell);

        // Aggiungi la riga al corpo della tabella
        tableBody.appendChild(row);
    });
}

// Funzione per recuperare i dati dal database
function fetchDataAndPopulateTable() {
    fetch('http://localhost:8080/api/projects')
        .then(response => response.json())
        .then(data => {
            console.log('Data received:', data); // Verifica i dati ricevuti
            populateTable(data); // Popola la tabella con i dati
        })
        .catch(error => console.error('Error fetching projects:', error));
}

// Chiama la funzione per caricare i dati al caricamento della pagina
document.addEventListener('DOMContentLoaded', fetchDataAndPopulateTable);

// Funzione per convertire i dati in formato CSV
function convertToCSV(data) {
    const header = ['Progetto', 'Data Inizio', 'Data Fine', 'Stato', 'Punti'];
    const rows = data.map(project => [
        project.project_name,
        formatDate(project.start_date),
        formatDate(project.end_date),
        project.status,
        project.value
    ]);

    return [header, ...rows].map(row => row.join(',')).join('\n');
}

// Funzione per scaricare il CSV
function downloadCSV(csv, filename) {
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

// Funzione per gestire il click del pulsante di download
function handleDownloadClick() {
    fetch('http://localhost:8080/api/projects')
        .then(response => response.json())
        .then(data => {
            const csv = convertToCSV(data);
            downloadCSV(csv, 'report.csv');
        })
        .catch(error => console.error('Error fetching projects for CSV download:', error));
}

// Aggiungi un listener per il pulsante di download
document.getElementById('downloadReport').addEventListener('click', handleDownloadClick);

//andamento cons e man
async function loadAndVisualizeData() {
    try {
        // Recupera i dati dall'endpoint
        const response = await fetch('http://localhost:8080/api/projects');
        
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Verifica i dati ricevuti
        console.log('Data received:', data);

        // Trasforma i dati per il grafico
        const userPerformance = {};

        data.forEach(item => {
            const userId = item.user.id;
            const userName = item.user.nomeCompleto;
            const total = parseFloat(item.total) || 0;

            if (!userPerformance[userId]) {
                userPerformance[userId] = {
                    name: userName,
                    totals: []
                };
            }
            userPerformance[userId].totals.push(total);
        });

        const performanceData = Object.keys(userPerformance).map(userId => ({
            name: userPerformance[userId].name,
            totals: userPerformance[userId].totals
        }));

        console.log('Performance Data:', performanceData);

        // Crea il grafico
        createLineChart(performanceData);
        
    } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
    }
}

function createLineChart(data) {
    const ctx = document.getElementById('performanceChart').getContext('2d');

    // Preparazione dei dati per Chart.js
    const datasets = data.map(user => ({
        label: user.name,
        data: user.totals.map((total, index) => ({ x: index + 1, y: total })),
        borderColor: getRandomColor(),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        fill: false
    }));

    // Crea il grafico
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Task Index'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Total Performance'
                    }
                }
            }
        }
    });
}

// Funzione per generare colori casuali per le linee
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Carica e visualizza i dati quando il documento è pronto
document.addEventListener('DOMContentLoaded', loadAndVisualizeData);