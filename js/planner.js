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

 
// Define an array to store events
let events = [];
 
// letiables to store event input fields and reminder list
let eventDateInput =
    document.getElementById("eventDate");
let eventTitleInput =
    document.getElementById("eventTitle");
let eventDescriptionInput =
    document.getElementById("eventDescription");
let reminderList =
    document.getElementById("reminderList");
 
// Counter to generate unique event IDs
let eventIdCounter = 1;
 
// Function to add events
function addEvent() {
    let date = eventDateInput.value;
    let title = eventTitleInput.value;
    let description = eventDescriptionInput.value;
 
    if (date && title) {
        // Create a unique event ID
        let eventId = eventIdCounter++;
 
        events.push(
            {
                id: eventId, date: date,
                title: title,
                description: description
            }
        );
        showCalendar(currentMonth, currentYear);
        eventDateInput.value = "";
        eventTitleInput.value = "";
        eventDescriptionInput.value = "";
        displayReminders();
    }
}
 
// Function to delete an event by ID
function deleteEvent(eventId) {
    // Find the index of the event with the given ID
    let eventIndex =
        events.findIndex((event) =>
            event.id === eventId);
 
    if (eventIndex !== -1) {
        // Remove the event from the events array
        events.splice(eventIndex, 1);
        showCalendar(currentMonth, currentYear);
        displayReminders();
    }
}
 
// Function to display reminders
function displayReminders() {
    reminderList.innerHTML = "";
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let eventDate = new Date(event.date);
        if (eventDate.getMonth() ===
            currentMonth &&
            eventDate.getFullYear() ===
            currentYear) {
            let listItem = document.createElement("li");
            listItem.innerHTML =
                `<strong>${event.title}</strong> - 
            ${event.description} on 
            ${eventDate.toLocaleDateString()}`;
 
            // Add a delete button for each reminder item
            let deleteButton =
                document.createElement("button");
            deleteButton.className = "delete-event";
            deleteButton.textContent = "Delete";
            deleteButton.onclick = function () {
                deleteEvent(event.id);
            };
 
            listItem.appendChild(deleteButton);
            reminderList.appendChild(listItem);
        }
    }
}
 
// Function to generate a range of 
// years for the year select input
function generate_year_range(start, end) {
    let years = "";
    for (let year = start; year <= end; year++) {
        years += "<option value='" +
            year + "'>" + year + "</option>";
    }
    return years;
}
 
// Initialize date-related letiables
today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");
 
createYear = generate_year_range(1970, 2050);
 
document.getElementById("year").innerHTML = createYear;
 
let calendar = document.getElementById("calendar");
 
let months = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre"
];
let days = [
    "Dom", "Lun", "Mar", "Mer",
    "Gio", "Ven", "Sab"];
 
$dataHead = "<tr>";
for (dhead in days) {
    $dataHead += "<th data-days='" +
        days[dhead] + "'>" +
        days[dhead] + "</th>";
}
$dataHead += "</tr>";
 
document.getElementById("thead-month").innerHTML = $dataHead;
 
monthAndYear =
    document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);
 
// Function to navigate to the next month
function next() {
    currentYear = currentMonth === 11 ?
        currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}
 
// Function to navigate to the previous month
function previous() {
    currentYear = currentMonth === 0 ?
        currentYear - 1 : currentYear;
    currentMonth = currentMonth === 0 ?
        11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}
 
// Function to jump to a specific month and year
function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}
 
// Function to display the calendar
function showCalendar(month, year) {
    let firstDay = new Date(year, month, 1).getDay();
    tbl = document.getElementById("calendar-body");
    tbl.innerHTML = "";
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;
 
    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                cell = document.createElement("td");
                cell.setAttribute("data-date", date);
                cell.setAttribute("data-month", month + 1);
                cell.setAttribute("data-year", year);
                cell.setAttribute("data-month_name", months[month]);
                cell.className = "date-picker";
                cell.innerHTML = "<span>" + date + "</span";
 
                if (
                    date === today.getDate() &&
                    year === today.getFullYear() &&
                    month === today.getMonth()
                ) {
                    cell.className = "date-picker selected";
                }
 
                // Check if there are events on this date
                if (hasEventOnDate(date, month, year)) {
                    cell.classList.add("event-marker");
                    cell.appendChild(
                        createEventTooltip(date, month, year)
                 );
                }
 
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row);
    }
 
    displayReminders();
}
 
// Function to create an event tooltip
function createEventTooltip(date, month, year) {
    let tooltip = document.createElement("div");
    tooltip.className = "event-tooltip";
    let eventsOnDate = getEventsOnDate(date, month, year);
    for (let i = 0; i < eventsOnDate.length; i++) {
        let event = eventsOnDate[i];
        let eventDate = new Date(event.date);
        let eventText = `<strong>${event.title}</strong> - 
            ${event.description} on 
            ${eventDate.toLocaleDateString()}`;
        let eventElement = document.createElement("p");
        eventElement.innerHTML = eventText;
        tooltip.appendChild(eventElement);
    }
    return tooltip;
}
 
// Function to get events on a specific date
function getEventsOnDate(date, month, year) {
    return events.filter(function (event) {
        let eventDate = new Date(event.date);
        return (
            eventDate.getDate() === date &&
            eventDate.getMonth() === month &&
            eventDate.getFullYear() === year
        );
    });
}
 
// Function to check if there are events on a specific date
function hasEventOnDate(date, month, year) {
    return getEventsOnDate(date, month, year).length > 0;
}
 
// Function to get the number of days in a month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}
 
// Call the showCalendar function initially to display the calendar
showCalendar(currentMonth, currentYear);