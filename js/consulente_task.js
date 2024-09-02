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

//tasks
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("load", function () {
        fillStatusArr();
        showTasks();
    });

    const token = localStorage.getItem("token");
    let projectArr = [];
    const taskList = document.getElementById("task-list");
    const complTaskList = document.getElementById("completed-task-list");
    const newTaskList = document.getElementById("task-list-hp"); // Aggiungi il riferimento al nuovo task list

    async function showTasks() {
        await getUserTasks();
        await fillProjectArr();

        taskArr.forEach((task) => {
            const taskID = task.id;
            const taskName = task.task_name;
            const taskDescription = task.task_desc;
            const taskPriority = task.status.status;
            const taskStatusColor = task.status.color;
            const taskValue = task.value;
            let taskMileName = task.milestone.mile_name || "Nessuna milestone assegnata!";
            let taskEndDate = task.end_date || "Scadenza indefinita";
            const taskCreated = task.start_date;
            const taskProjectID = task.project_id;
            let taskProjectName = projectArr.find(p => p.id == taskProjectID)?.project_name || "Progetto sconosciuto";

            let listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.id = `task${taskID}`;
            listItem.innerHTML = `
                <div class="row card-task"> 
        <div class="widget-content p-0">
            <div class="widget-content-wrapper d-flex align-items-center">
                <div class="col-2 d-flex flex-column justify-content-center"> 
                    <div class="widget-content-left">
                        <div class="widget-heading" style="color : ${taskStatusColor}">${taskPriority}</div>
                        <div class="widget-subheading">Creazione: ${taskCreated}</div>
                        <div class="widget-subheading">Scadenza: ${taskEndDate}</div>   
                    </div>
                </div>
                <div class="col-6 d-flex flex-column align-items-center justify-content-center"> 
                    <div class="p-2 text-center border-start border-end">
                        <div class="widget-subheading">${taskMileName}</div>
                        <div class="widget-heading mb-2"><strong>${taskName}</strong></div>
                        <div class="widget-subheading">${taskDescription}</div>
                    </div>
                </div>
                <div class="col-4 d-flex align-items-center justify-content-end"> 
                    <div class="widget-content-right d-flex gap-2">
                        <button class="border-0 btn-transition btn btn-outline-warning" onclick="showChangePriorityModal(${taskID})">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                        </button>
                        <button class="border-0 btn-transition btn btn-outline-success" onclick="completeTask(${taskID})">
                            <i class="fa-solid fa-check"></i> 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
            `;

            if (taskPriority == "Completata") {
                complTaskList?.appendChild(listItem);
            } else {
                taskList?.appendChild(listItem);
                newTaskList?.appendChild(listItem.cloneNode(true));  // Aggiungi la task anche nella nuova lista
            }
        });
    }

    async function getUserTasks() {
        try {
            const response = await fetch("http://localhost:8080/api/tasks/user", {
                method: "GET",
                headers: {
                    token: token,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                taskArr = data; // Usa direttamente la risposta JSON per popolare taskArr
            } else {
                console.error("Failed to fetch tasks:", response.status);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

    async function fillProjectArr() {
        try {
            const response = await fetch("http://localhost:8080/api/projects/user", {
                method: "GET",
                headers: {
                    token: token,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                projectArr = data; // Popola projectArr con la risposta JSON
            } else {
                console.error("Failed to fetch projects:", response.status);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    window.completeTask = function (taskID) {
        completeTask(taskID);
    };



    async function completeTask(taskID) {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/complete/${taskID}`, {
                method: "GET",
                headers: {
                    token: token,
                },
            });
            if (response.status === 200) {
                document.getElementById("task-list").innerHTML = "";
                if (document.getElementById('completed-task-list'))
                document.getElementById("completed-task-list").innerHTML = "";
                showTasks();
            }
        } catch (error) {
            console.error("Error completing task:", error);
        }
    }

    window.showChangePriorityModal = function (taskID) {
        populateSelectWithArray(statusArr, "changePrioritySelect", "status", "Status non validi");
        changePriorityModal.style.display = "block";
        changePriorityID = taskID;
    };

    window.closeChangePriorityModal = async function () {
        const statusID = document.getElementById("changePrioritySelect").value;
        await changePriority(changePriorityID, statusID);
        changePriorityModal.style.display = "none";
        document.getElementById("task-list").innerHTML = "";
        showTasks();
    };

    async function fillStatusArr() {
        try {
            const response = await fetch("http://localhost:8080/api/status", {
                method: "GET",
                headers: {
                    token: token,
                },
            });
            if (response.status === 200) {
                const data = await response.json();
                statusArr = data; // Popola statusArr con la risposta JSON
            } else {
                console.error("Failed to fetch statuses:", response.status);
            }
        } catch (error) {
            console.error("Error fetching statuses:", error);
        }
    }

    async function changePriority(taskID, statusID) {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/changestatus/${taskID}/${statusID}`, {
                method: "PUT",
                headers: {
                    token: token,
                },
            });
            if (response.status !== 200) {
                console.error("Failed to change task priority:", response.status);
            }
        } catch (error) {
            console.error("Error changing task priority:", error);
        }
    }

    function populateSelectWithArray(array, selectId, nameProp, message) {
        const selectElement = document.getElementById(selectId);
        if (array.length > 0) {
            selectElement.innerHTML = '<option>Nessuna scelta</option>';
            array.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.id;
                option.id = `${nameProp}${item.id}`;
                option.textContent = item[nameProp];
                selectElement.appendChild(option);
            });
        } else {
            selectElement.innerHTML = "";
            const option = document.createElement("option");
            option.textContent = message;
            selectElement.appendChild(option);
        }
    }
});








/* to do list */
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("load", function () {
      fillStatusArr();
      showTasks();
    });
    //VARIABILI DI SERVIZIO
    const token = localStorage.getItem("token");
  
    //array che contiene progetti
    let projectArr = [];
    //costanti che puntano agli elementi sulla pagina
    const taskList = document.getElementById("task-list");
    const complTaskList = document.getElementById("completed-task-list");
    const changePriorityModal = document.getElementById("changePriorityModal");
  
    //
    //CARICA LE TASK E MOSTRA A CLIENT
    //qui dentro si trova il template delle task mostrate al consulente
    //e del nome della categoria.
    //showtasks aggiorna a db quello che viene mostrato a schermo e viene
    //chiamata piu volte.
    async function showTasks() {
      await getUserTasks();
      await fillProjectArr();
      taskArr.forEach((task) => {
        const taskID = task.id;
        const taskName = task.task_name;
        const taskDescription = task.task_desc;
        //status della task
        const taskPriority = task.status.status;
        const taskStatusColor = task.status.color;
        const taskValue = task.value;
        let taskMileName;
        if (task.milestone.mile_name != null)
          taskMileName = task.milestone.mile_name
       else  taskMileName = "Nessuna milestone assegnata!"
        //scadenza
        let taskEndDate = task.end_date;
        const taskCreated = task.start_date;
        //se c'è la scadenza la mette altrimenti scrive indefinita
        if (taskEndDate == null) taskEndDate = "Scadenza indefinita";
        const taskProjectID = task.project_id;
        let taskProjectName;
        projectArr.forEach((project) => {
          if (project.id == taskProjectID) taskProjectName = project.project_name;
        });
        //
        let projectListItem = document.createElement("li");
        projectListItem.className = "p-2";
        if(taskPriority!= "Completata")
        projectListItem.id = `listaProgetto${taskProjectID}`;
        else 
        projectListItem.id = `listaProgettoCompletato${taskProjectID}`;
        //TEMPLATE DEL NOME DELLA CATEGORIA
        projectListItem.innerHTML = `
              <h5 class="text-center">${taskProjectName}</h5>`;
        //
        let listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.id = `task${taskID}`;
        //TEMPLATE DELLA TASK
        listItem.innerHTML = `
          <div class="row"> 
                  <div class="widget-content p-0">
                  <div class="widget-content-wrapper">
                  <div class="col-2"> 
                  <div class="widget-content-left">
                  <div class="widget-heading border-1" style="color : ${taskStatusColor}">${taskPriority} <br><span class="badge text-bg-secondary">${taskValue} <i class="fa-solid fa-dragon" style="color:lime" ></i>    </span>  </div>
                  
                  <div class="widget-subheading">Creazione: <br>${taskCreated}</div>
                  <div class="widget-subheading ms-auto">Scadenza: <br>${taskEndDate}</div>   
                  </div>
                  </div>
                  <div class="col-8"> 
                  <div class="p-2 text-center border-start border-end">
                  <div class="widget-subheading">${taskMileName}</div>
                  <div class="widget-heading mb-2"><strong>${taskName}</strong></div>
                  <div class="widget-subheading">${taskDescription}</div>
                  </div>
                  </div>
                  <div class="col-1"> 
                  <div class="widget-content-right">
                  <button class="ms-1 border-0 btn-transition btn btn-outline-warning" onclick="showChangePriorityModal(${taskID})">
                  <i class="fa-solid fa-clock-rotate-left"></i>
                  </button>
               
                  <button class="ms-1 border-0 btn-transition btn btn-outline-success" onclick="completeTask(${taskID})">
                       <i class="fa-solid fa-check"></i> 
                 </button>
                  </div>
                  </div>
                  </div>
                  </div>
                  </div>
              `;
        //
        let listaProgetto;
        if (taskPriority == "Completata") {
          listaProgetto = document.getElementById(
            `listaProgettoCompletato${taskProjectID}`
          );
        } else {
          listaProgetto = document.getElementById(
            `listaProgetto${taskProjectID}`
          );
        }
  
        if (listaProgetto == null && taskPriority == "Completata") {
          if(complTaskList!=null)
          complTaskList.appendChild(projectListItem);
          projectListItem.appendChild(listItem);
        } else if (listaProgetto == null) {
          taskList.appendChild(projectListItem);
          projectListItem.appendChild(listItem);
        } else listaProgetto.appendChild(listItem);
      });
    }
    //PRENDE LE TASK ASSEGNATE AL MANAGER E RIEMPE TASKARR
    async function getUserTasks() {
      try {
        const response = await fetch("http://localhost:8080/api/tasks/user", {
          method: "GET",
          headers: {
            token: token,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          taskArr = [];
          data.forEach((element) => {
            taskArr.push(element);
          });
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
  
    //riempe ProjectArr
    async function fillProjectArr() {
      try {
        const response = await fetch("http://localhost:8080/api/projects/user", {
          method: "GET",
          headers: {
            token: token,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          data.forEach((element) => {
            projectArr.push(element);
          });
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
  
    //PER METTERE TASK COMPLETATA
    //ATTUALMENTE INUTILIZZATA LATO MANAGER
    window.completeTask = function (taskID) {
      completeTask(taskID);
    };
    //FETCH
    async function completeTask(taskID) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/tasks/complete/${taskID}`,
          {
            method: "GET",
            headers: {
              token: token,
            },
          }
        );
        if (response.status === 200) {
          document.getElementById("task-list").innerHTML = "";
          if (document.getElementById('completed-task-list'))
          document.getElementById("completed-task-list").innerHTML ="";
          showTasks();
        }
      } catch (error) {
        console.error("Error completing task:", error);
      }
    }
    //
    //
  
    //CAMBIA STATUS DELLA TASK
    //variabili di servizio
    let changePriorityID;
    let statusArr = [];
  
    //
    //mostra modal cambia status
    window.showChangePriorityModal = function (taskID) {
      populateSelectWithArray(
        statusArr,
        "changePrioritySelect",
        "status",
        "Status non validi"
      );
      changePriorityModal.style.display = "block";
      changePriorityID = taskID;
    };
  
    // chiudi modal cambia status
    window.closeChangePriorityModal = async function () {
      const statusID = document.getElementById("changePrioritySelect").value;
      await changePriority(changePriorityID, statusID);
      changePriorityModal.style.display = "none";
      document.getElementById("task-list").innerHTML = "";
      showTasks();
    };
    //riempe statusArr[] con tutti gli status delle task possibili e poi riempe
    //la SELECT nel pararmetro
    async function fillStatusArr() {
      try {
        const response = await fetch("http://localhost:8080/api/status", {
          method: "GET",
          headers: {
            token: token,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          statusArr = [];
          data.forEach((element) => {
            statusArr.push(element);
          });
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
  
    //fetch e salva a db
    async function changePriority(taskID, statusID) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/tasks/changestatus/${taskID}/${statusID}`,
          {
            method: "PUT",
            headers: {
              token: token,
            },
          }
        );
        if (response.status === 200) {
        }
      } catch (error) {
        console.error("Error completing task:", error);
      }
    }
  
   
  
    //funzione di servizio che prende 4 argomenti e riempe una select
    //array: lista di elementi che hanno una proprieta id e una proprieta "nome"
    //nameProp: definisce il "nome" ovvero quale sarà la casella che contiene il testo mostrato nella select
    //message: in caso il db non ritorna risultati inserisce nella select un option null con un messaggio
    function populateSelectWithArray(array, selectId, nameProp, message) {
      const selectElement = document.getElementById(selectId);
      if (array.length > 0) {
        selectElement.innerHTML = '<option>Nessuna scelta</option>';
        array.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id;
          option.id = `${nameProp}${item.id}`;
          option.textContent = item[nameProp];
          if (nameProp === "status") option.classList.add();
          selectElement.appendChild(option);
        });
      } else {
        selectElement.innerHTML = "";
        const option = document.createElement("option");
        option.textContent = message;
        selectElement.appendChild(option);
      }
    }
  });
  
  //grafico che mostra l'andamento del completamento delle task (rispetto a quelle assegnate)
// Funzione per recuperare i dati dall'API e processarli
async function fetchProjectData(userId) {
  try {
      const response = await fetch('http://localhost:8080/api/tasks');
      const tasks = await response.json();

      // Filtrare e processare le tasks per l'utente specifico
      const tasksPerMonth = processTasks(tasks, userId);

      // Estrarre le labels (mesi) e i dataset dai dati processati
      const labels = Object.keys(tasksPerMonth);
      const assignedData = labels.map(month => tasksPerMonth[month].assigned);
      const completedData = labels.map(month => tasksPerMonth[month].completed);

      // Configurare e creare la chart
      createChart(labels, assignedData, completedData);

  } catch (error) {
      console.error('Errore nel recupero dei dati:', error);
  }
}

// Funzione per processare le tasks e calcolare i totali per mese
function processTasks(tasks, userId) {
  const tasksPerMonth = {};

  tasks.forEach(task => {
      // Controllo che la task sia assegnata all'utente specifico
      if (task.userID === userId) {
          const month = new Date(task.start_date).toLocaleString('default', { month: 'long' });

          // Inizializzare il mese se non ancora presente
          if (!tasksPerMonth[month]) {
              tasksPerMonth[month] = { assigned: 0, completed: 0 };
          }

          // Incrementare il contatore dei progetti assegnati
          tasksPerMonth[month].assigned++;

          // Incrementare il contatore dei progetti completati se lo status è "Completata"
          if (task.status && task.status.status === 'Completata') {
              tasksPerMonth[month].completed++;
          }
      }
  });

  return tasksPerMonth;
}

// Funzione per creare la line chart
function createChart(labels, assignedData, completedData) {
  const ctx = document.getElementById('projectChart').getContext('2d');
  const chartData = {
      labels: labels,
      datasets: [
          {
              label: 'Progetti Assegnati',
              data: assignedData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.4,
          },
          {
              label: 'Progetti Completati',
              data: completedData,
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              fill: true,
              tension: 0.4,
          }
      ]
  };

  const config = {
      type: 'line',
      data: chartData,
      options: {
          responsive: true,
          plugins: {
              title: {
                  display: true,
                  text: 'Andamento dei Progetti Assegnati e Completati'
              },
              tooltip: {
                  mode: 'index',
                  intersect: false,
              },
          },
          interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
          },
          scales: {
              x: {
                  display: true,
                  title: {
                      display: true,
                      text: 'Mese'
                  }
              },
              y: {
                  display: true,
                  title: {
                      display: true,
                      text: 'Numero di Progetti'
                  },
                  beginAtZero: true
              }
          },
          animations: {
              tension: {
                  duration: 1000,
                  easing: 'linear',
                  from: 0.4,
                  to: 0.4,
                  loop: true
              }
          }
      },
  };

  new Chart(ctx, config);
}

// Chiamare la funzione per caricare i dati e creare la chart per l'utente loggato
const loggedInUserId = 7; // Assicurati di avere l'ID dell'utente loggato
fetchProjectData(loggedInUserId);

