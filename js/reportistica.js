/*tabella reportistica*/

const reportData = [
    {
        consulente: "Adriano Pizzo",
        progetto: "Progetto Front",
        dataInizio: "24/07/2024",
        dataFine: "03/09/2024",
        stato: "In ritardo",
        dettagli: "Dettagli del progetto.."
    },
    {
        consulente: "Fabiola Chiericato",
        progetto: "Progetto Back",
        dataInizio: "24/07/2024",
        dataFine: "03/09/2024",
        stato: "Completato",
        dettagli: "Dettagli del progetto.."
    },
    {
        consulente: "Martina Perriera",
        progetto: "Progetto Front",
        dataInizio: "24/07/2024",
        dataFine: "03/09/2024",
        stato: "In corso",
        dettagli: "Dettagli del progetto.."
    },
    {
        consulente: "Luca Barreca",
        progetto: "Progetto Back",
        dataInizio: "24/07/2024",
        dataFine: "03/09/2024",
        stato: "In corso",
        dettagli: "Dettagli del progetto.."
    }
];

function populateTable() {
    const tableBody = document.getElementById("reportTableBody");
    reportData.forEach(report => {
        const row = document.createElement("tr");
        
        Object.values(report).forEach(text => {
            const cell = document.createElement("td");
            cell.textContent = text;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", populateTable);

