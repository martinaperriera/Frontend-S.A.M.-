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

    


document.addEventListener("DOMContentLoaded", () => {
  //variabili di servizio
  const token = localStorage.getItem("token");
  let projectArr = [];
  let mileArr = [];
  let projUsers = [];
  let taskArr = [];
  let myUser = {};
  let changePriorityID;
  let statusArr = [];
  window.showMilestones = async function (projID) {
    document.getElementById("completedRow").innerHTML = "&nbsp";
    document.getElementById("wipRow").innerHTML = "&nbsp";
    document.getElementById("plannedRow").innerHTML = "&nbsp";
    await getMilestones();
    await showMilestones(projID);
  };
  window.closeChangePriorityModalProj = async function (mileID) {
    const statusID = document.getElementById("changePrioritySelect").value;
    await changePriority2(changePriorityID, statusID);
    changePriorityModal.style.display = "none";
    document.getElementById("task-list").innerHTML = "";
    await showProjects(mileID);
    showTasksInModal(mileID);
  };
  window.showTasksInModal = async function(mileID) {
    document.getElementById("task-list").innerHTML = '';
    showTasksInModal(mileID);
    await showProjects(mileID);
  }
  async function showProjects(mileID) {
    await getProjects();
    await getMilestones();
    document.getElementById("nav-tabContent").innerHTML =""
    document.getElementById("list-tab").innerHTML =""
    projectArr.forEach((project) => {
      projUsers = project.projectUsers
      const projectID = project.id;
      const projectBudget = project.budget;
      const projectCompletionDate = project.completion_date;
      let projectEndDate = project.end_date;
      if (projectEndDate == null) {
        projectEndDate = "Da definire";
      }
      let projectExpectedDate = project.expected_date;
      if (projectExpectedDate == null) {
        projectExpectedDate = "Da definire";
      }
      const projectName = project.project_name;
      const projectStartDate = project.start_date;
      const projectStatus = project.status;
      const projectTotal = project.total;
      const projectValue = project.value;
      let projectDsp = project.value;
      const projectCustomerName = project.customer.customer_name;
      const projectCustomerMail = project.customer.customer_email;
      const projectOwnerName = project.user.nomeCompleto;
      const projectDescription = project.description;
      let barColor = (projectValue / projectTotal) * 100;
      switch (true) {
        case (barColor < 5  )  :{
          barColor = "bg-danger"
          projectDsp = projectTotal;
        }
        case barColor < 33: {
          barColor = "bg-danger";
          break;
        }
        case barColor > 33 && barColor < 66: {
          barColor = "bg-warning";
          break;
        }
        case barColor > 66: {
          barColor = "bg-info";
          break;
        }
        default:
          barColor = "";
          break;
      }
      //TEMPLATE della lista del progetto
      let projectListItem = document.createElement("a");
      projectListItem.className = "list-group-item list-group-item-action";
      projectListItem.id = `list-${projectID}-list`;
      projectListItem.setAttribute("data-bs-toggle", "list");
      projectListItem.setAttribute("role", "tab");
      projectListItem.setAttribute("aria-controls", `list-${projectID}`);
      projectListItem.setAttribute("href", `#list-${projectID}`);
      projectListItem.setAttribute("onclick", `showMilestones(${projectID})`);
      projectListItem.innerHTML = `${projectName}`;
      //
      let userList = document.createElement("ul")
        projUsers.forEach((user) => {
          listItem = document.createElement("li")
          listItem.className = "col-6 col-lg-4"
          listItem.innerHTML = `${user.nomeCompleto}`
          userList.appendChild(listItem)
        })
      let projectCard = document.createElement("div");
      projectCard.className = "tab-pane fade";
      projectCard.id = `list-${projectID}`;
      projectCard.setAttribute("role", "tabpanel");
      projectCard.setAttribute("aria-labelledby", `list-${projectID}-list`);
      //TEMPLATE DEL PROGETTO
      if (projectCompletionDate == null)
        projectCard.innerHTML = `
           <div class="card">
           <div class="accordion accordion-flush" id="accordion${projectID}">
               <div class="card-header p-2">
                   <h4 class="card-title text-center projName">${projectName}</h5>
                       <p class="text-center">Committente: ${projectCustomerName}</p>
               </div>

               <div class="card-body">
                   <p class="card-text">${projectDescription}</p>
                   <div class="progress">
                       <div class="progress-bar progress-bar-striped ${barColor} progress-bar-animated" role="progressbar"
                           aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" 
                           style="width: ${(projectDsp / projectTotal) * 100}%"> <i class="fa-solid fa-dragon" style="color:lime" small ><span style="color: white"> ${projectValue} / ${projectTotal}</span></i></div>
                   </div>
               </div>
               <div class="accordion-item">
                   <h2 class="accordion-header">
                       <button class="accordion-button projBtn" type="button" data-bs-toggle="collapse"
                           data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                           Più informazioni..
                       </button>
                   </h2>
                   <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordion${projectID}">
                       <div class="accordion-body projBody">
                           <div class="row">
                               <div class="col-6">
                               PO: ${projectOwnerName} <br>
                               Budget: ${projectBudget} <br>
                               Stato: ${projectStatus} <br>
                               </div>
                               <div class="col-6">
                               Data di inizio: ${projectStartDate} <br>
                               Deadline: ${projectEndDate} <br>
                               Termine previsto: ${projectExpectedDate}
                               </div>
                               <strong>Utenti : <br></strong> 
                               <div class="row">
                               ${userList.innerHTML}
                                   </div>
                           </div>

                       </div>
                   </div>
               </div>
           </div>
       </div>
      `;
      else
      //se progetto è completato
        projectCard.innerHTML = `
      <div class="card">
      <div class="accordion accordion-flush" id="accordion${projectID}">
          <div class="card-header p-2">
              <h4 class="card-title text-center projName"><i class="fa-solid fa-crown" style="color: gold"></i> &nbsp; ${projectName}</h5>
                  <p class="text-center">Committente: ${projectCustomerName}</p>
          </div>

          <div class="card-body">
              <p class="card-text">${projectDescription}</p>
              <div class="progress">
                  <div class="progress-bar  progress-bar-striped bg-success progress-bar-animated" role="progressbar"
                      aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><i class="fa-solid fa-dragon" style="color:lime" small ><span style="color: white">&nbsp;${projectTotal}&nbsp;</span></i></div>
              </div>
          </div>
          <div class="accordion-item">
              <h2 class="accordion-header">
                  <button class="accordion-button projBtn" type="button" data-bs-toggle="collapse"
                      data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                      Più informazioni..
                  </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordion${projectID}">
                  <div class="accordion-body projBody">
                      <div class="row">
                          <div class="col-6">
                          PO: ${projectOwnerName} <br>
                          Budget: ${projectBudget} <br>
                          <span style="color:green"> Stato: Completo </span><br>
                          </div>
                          <div class="col-6">
                          Data di inizio: ${projectStartDate} <br>
                          Completamento: ${projectCompletionDate}
                          </div>
                      </div>

                  </div>
              </div>
          </div>
      </div>
  </div>
 `;
      //
      document.getElementById("list-tab").appendChild(projectListItem);
      document.getElementById("nav-tabContent").appendChild(projectCard);
    });
    if(mileID){
      mileArr.forEach((mile) => {
        if (mile.id == mileID)
        {
          document
      .getElementById(`list-${mile.projectID}-list`).classList.add("active");
      
    document
      .getElementById(`list-${mile.projectID}`).classList.add("active", "show");
        }
      })
    }
  }

  async function showMilestones(projID) {
    mileArr.forEach((m) => {
      const mileID = m.id;
      let mileCompletion = m.completion_date;
        let mileEnd = m.end_date;
      if ( mileEnd == null)
        mileEnd = "Da definire"
      const mileDesc = m.mile_desc;
      const mileName = m.mile_name;
      const mileOwnerID = m.mileOwnerID;
      const mileStart = m.start_date;
      const mileProjectID = m.projectID      ;
      let mileTotal = m.mile_total;
        let mileValue = m.mile_value;
        let mileDsp= m.mile_value;
        let mileIcon = m.mile_icon;
      if (mileIcon == null)
        mileIcon = "bi bi-list-task"
      let barColor = (mileValue / mileTotal) * 100;
      switch (true) {
        case (barColor < 5  )  :{
          barColor = "bg-danger"
          mileDsp = mileTotal;
          break;
        }
        case barColor < 33: {
          barColor = "bg-danger";
          break;
        }
        case barColor > 33 && barColor < 66: {
          barColor = "bg-warning";
          break;
        }
        case barColor > 66 && barColor <98: {
          barColor = "bg-info";
          break;
        }
        case barColor > 98: {
          barColor = "bg-success"
          break;
        }
        default:
          barColor = "";
          break;
      }
      
      //check
    if (projID == mileProjectID){
      let mileItem = document.createElement("div")
      mileItem.className = "col-6 col-lg-4";
      mileItem.id = `mile${mileID}`;
     //inserire modale per assegnarsi le task
      mileItem.innerHTML = `
        <div class="p-2 single-timeline-content d-flex wow fadeInLeft" data-wow-delay="0.3s" data-bs-target="#mileTaskModal" data-bs-toggle="modal" onclick="showTasksInModal(${mileID})"
            style="visibility: visible; animation-delay: 0.3s; animation-name: fadeInLeft;">
            <div class="timeline-icon"><i class="${mileIcon} " style="margin: 0px" aria-hidden="true"></i></div>
            <div class="timeline-text" style="min-width: 120px">
                <h6 class="border-bottom">${mileName}</h6>
                <p class="border_bottom">${mileDesc}</p>
                <div class="progress mt-3">
                <div class="progress-bar progress-bar-striped ${barColor} progress-bar-animated" role="progressbar"
                    aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"
                    style="width: ${((mileDsp+1) / (mileTotal+1)) * 100}%"> <i class="fa-solid fa-dragon" style="color:lime" small ><span style="color: white"> ${mileValue} / ${mileTotal}</span></i></div>
            </div> <br>
           

        </div>

        </div>
      `
      if (mileTotal != mileValue && mileValue > 0)
      document.getElementById("wipRow").appendChild(mileItem);
      else if (mileTotal == mileValue && mileTotal>0)
        document.getElementById("completedRow").appendChild(mileItem);
      else if (mileValue == 0)
        document.getElementById("plannedRow").appendChild(mileItem);
      else
      document.getElementById("completedRow").appendChild(mileItem);
    }
    
    });
    
  }
  async function getMilestones() {
    mileArr = [];
    try {
      const response = await fetch(`http://localhost:8080/api/milestones`, {
        method: "GET",
        headers: {
          token: token,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        data.forEach((element) => {
          mileArr.push(element);
        });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }

  //PRENDE TUTTI I PROGETTI ASSEGNATI A USER LOGGATO
  async function getProjects() {
    try {
      const response = await fetch("http://localhost:8080/api/projects/user", {
        method: "GET",
        headers: {
          token: token,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        projectArr = [];
        data.forEach((element) => {
          projectArr.push(element);
        });
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  } 

  async function showTasksInModal(mileID) {
    document.getElementById("switchCompleted").setAttribute("onclick", `filterTasks(${mileID})`)
    let milestone
    let projectUsers
    mileArr.forEach((m) => {
      if (m.id == mileID)
        milestone = m;
    })
    projectArr.forEach((project) => {
      if(project.id == milestone.projectID)
        projectUsers = project.projectUsers 
    })
    await getMileTasks(mileID);
    taskArr.forEach((task) => {
      //se task status = Completata mostra la task
      if(document.getElementById("switchCompleted").checked || !document.getElementById("switchCompleted").checked && (task.status.status) != "Completata")
      {
      const taskID = task.id;
      const taskName = task.task_name;
      const taskDescription = task.task_desc;
      let taskUserName = "Da assegnare"
      let taskAssigned = false;
      projectUsers.forEach((user) => {
        if (user.id == task.userID){
          taskUserName = user.nomeCompleto
          taskAssigned = true;
        }
      });
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
      //TEMPLATE DELLA TASK
      let listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.id = `task${taskID}`;
      if(taskAssigned && myUser.id != task.userID)
        listItem.innerHTML = `
         <div class="row"> 
        <div class="col-3"> 
        <div class="border-end">
        <div class="" style="color : ${taskStatusColor}">${taskPriority} <br> <span class="badge text-bg-secondary">${taskValue} <i class="fa-solid fa-dragon" style="color:lime" ></i>    </span></div>
        <div class="taskSub">Creazione: <br>${taskCreated}</div>                
        <div class="taskSub">Deadline: <br>${taskEndDate}</div>   
        </div>
        </div>
        <div class="col-7"> 
        <div class="text-center border-end">
        <div class="taskSub">${taskUserName}</div>
        <div class="mt-1 mb-1"><strong>${taskName}</strong></div>
        <div class="">${taskDescription}</div>
        </div>
        </div>
        <div class="col-1"> 
        </div>
        </div>
              `;
              //
      else if(taskAssigned && myUser.id == task.userID)
      listItem.innerHTML = `
        <div class="row"> 
                <div class="col-3"> 
                <div class="border-end">
                <div class="" style="color : ${taskStatusColor}">${taskPriority} <br> <span class="badge text-bg-secondary">${taskValue} <i class="fa-solid fa-dragon" style="color:lime" ></i>    </span></div>
                <div class="taskSub">Creazione: <br>${taskCreated}</div>                
                <div class="taskSub">Deadline: <br>${taskEndDate}</div>   
                </div>
                </div>
                <div class="col-7"> 
                <div class="text-center border-end">
                <div class="taskSub">${taskUserName}</div>
                <div class="mt-1 mb-1"><strong>${taskName}</strong></div>
                <div class="">${taskDescription}</div>
                </div>
                </div>
                <div class="col-1"> 
                <div class="">
                <button class="ms-1 border-0 btn-transition btn btn-outline-warning" onclick="showChangePriorityModal2(${taskID})">
                <i class="fa-solid fa-clock-rotate-left"></i>
                </button>
           
               
                <button class="ms-1 border-0 btn-transition btn btn-outline-success" onclick="completeTask(${taskID}, ${milestone.id})">
                     <i class="fa-solid fa-check"></i> 
               </button>
                </div>
                </div>
                </div>
                </div>
                </div>
            `;
      //
      else if(!taskAssigned)
      listItem.innerHTML = `
      <div class="row"> 
            <div class="col-3"> 
                <div class="border-end">
                <div class="" style="color : ${taskStatusColor}">${taskPriority} <br> <span class="badge text-bg-secondary">${taskValue} <i class="fa-solid fa-dragon" style="color:lime" ></i>    </span></div>
                <div class="taskSub">Creazione: <br>${taskCreated}</div>                
                <div class="taskSub">Deadline: <br>${taskEndDate}</div>   
                </div>
                </div>
                <div class="col-7"> 
                <div class="text-center border-end">
                <div class="taskSub">${taskUserName}</div>
                <div class="mt-1 mb-1"><strong>${taskName}</strong></div>
                <div class="">${taskDescription}</div>
                </div>
              </div>
              <div class="col-1"> 
              <div class="widget-content-right">
          <button class="ms-1 border-0 btn-transition btn btn-outline-success" onclick="selfAssign(${taskID}, ${milestone.id})">
                     <i class="fa-solid fa-user-plus"></i> 
               </button>
             </button>
              </div>
              </div>
              </div>
              </div>
              </div>
          `;
    if(taskAssigned == true)
    document.getElementById("task-list").appendChild(listItem);
    else
  document.getElementById("xcloseStatusModal").setAttribute("onclick", `closeChangePriorityModalProj(${milestone.id})`)
      
      }
  });
  //PER METTERE TASK COMPLETATA
  //ATTUALMENTE INUTILIZZATA LATO MANAGER
  window.completeTask = async function (taskID, mileID) {
    await completeTask(taskID);
    document.getElementById("task-list").innerHTML = "";
    await showProjects(mileID);
    showTasksInModal(mileID);
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
        const data = await response.json();
        document.getElementById("completedRow").innerHTML = "&nbsp";
        document.getElementById("wipRow").innerHTML = "&nbsp";
        document.getElementById("plannedRow").innerHTML = "&nbsp";
        await getMilestones();
        await showMilestones(data.project_id);
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  }
  //
  //
  }
  window.selfAssign = async function (taskID, mileID) {
    await selfAssign(taskID)
    document.getElementById("task-list").innerHTML = "";
    showProjects(mileID);
    showTasksInModal(mileID);
  } 
  window.filterTasks = async function (mileID) {
    document.getElementById("task-list").innerHTML = "";
    showProjects(mileID);
    showTasksInModal(mileID);
  }


  async function selfAssign(taskID) {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/selfassign/${taskID}`, {
        method: "GET",
        headers: {
          token: token,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  }
  


async function getMileTasks(mileID) {
  try {
    const response = await fetch(`http://localhost:8080/api/tasks/milestone/${mileID}`, {
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
window.showChangePriorityModal2 = function (taskID) {
  populateSelectWithArray(
    statusArr,
    "changePrioritySelect",
    "status",
    "Status non validi"
  );
  changePriorityModal.style.display = "block";
  changePriorityID = taskID;
};
//riempe statusArr[] con tutti gli status delle task a db
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

async function checkUser() {
  try {
    const response = await fetch(`http://localhost:8080/api/users/me`, {
      method: "GET",
      headers: {
        token: token,
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      myUser = data;
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}  async function changePriority2(taskID, statusID) {
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
    if (response.status === 202) {
      const data = await response.json();
      document.getElementById("completedRow").innerHTML = "&nbsp";
      document.getElementById("wipRow").innerHTML = "&nbsp";
      document.getElementById("plannedRow").innerHTML = "&nbsp";
      await getMilestones();
      await showMilestones(data.project_id);
    }
    
  } catch (error) {
    console.error("Error completing task:", error);
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
async function startup() {
  await showProjects();
 await showMilestones(projectArr[0].id)
  document
      .getElementById("list-tab")
      .firstElementChild.classList.add("active");
    document
      .getElementById("nav-tabContent")
      .firstElementChild.classList.add("active", "show");
  checkUser();
  fillStatusArr();
}
  //ROBA DA RUNNARE
 startup()
});

/*
//bar chart
// Definisci i valori per i vari stati di completamento
const statusValues = {
  'To Do': 0,
  'In Progress': 25,
  'Testing': 50,
  'Completed': 75,
  'Done': 100
};

// Funzione per processare i dati dei progetti e calcolare il livello di completamento per ogni progetto
function processProjectCompletion(projects) {
  const projectCompletion = {};

  projects.forEach(project => {
      const projectName = project.project_name;
      const projectStatus = project.status;

      if (!projectName) {
          console.warn('Nome del progetto mancante:', project);
          return;
      }

      if (!projectCompletion[projectName]) {
          projectCompletion[projectName] = { totalValue: 0, count: 0 };
      }

      const statusValue = statusValues[projectStatus] || 0;
      projectCompletion[projectName].totalValue += statusValue;
      projectCompletion[projectName].count++;
  });

  Object.keys(projectCompletion).forEach(project => {
      const data = projectCompletion[project];
      if (data.count > 0) {
          projectCompletion[project] = Math.round((data.totalValue / (data.count * 100)) * 100);
      } else {
          projectCompletion[project] = 0;
      }
  });

  console.log('Project Completion:', projectCompletion);
  return projectCompletion;
}

// Funzione per creare la bar chart
function createCompletionChart(labels, completionData) {
  const ctx = document.getElementById('completionChart').getContext('2d');
  const chartData = {
      labels: labels,
      datasets: [
          {
              label: 'Livello di Completamento (%)',
              data: completionData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
          }
      ]
  };

  const config = {
      type: 'bar',
      data: chartData,
      options: {
          responsive: true,
          plugins: {
              title: {
                  display: true,
                  text: 'Livello di Completamento dei Progetti'
              },
              tooltip: {
                  mode: 'index',
                  intersect: false,
              },
          },
          scales: {
              x: {
                  display: true,
                  title: {
                      display: true,
                      text: 'Progetti'
                  }
              },
              y: {
                  display: true,
                  title: {
                      display: true,
                      text: 'Completamento (%)'
                  },
                  beginAtZero: true,
                  max: 100
              }
          }
      },
  };

  new Chart(ctx, config);
}

// Funzione per recuperare i dati dall'API e processarli
async function fetchProjectCompletionData(userId) {
  try {
      const response = await fetch('http://localhost:8080/api/projects');
      const projects = await response.json();

      console.log('Progetti:', projects);
      console.log('ID Utente:', userId);

      // Filtrare i progetti in base all'utente specifico
      const filteredProjects = projects.filter(project => project.owner_id === userId);

      console.log('Progetti Filtrati:', filteredProjects);

      // Processare i dati dei progetti per ottenere il completamento
      const projectCompletion = processProjectCompletion(filteredProjects);

      // Estrarre le labels (nomi dei progetti) e i dataset dai dati processati
      const labels = Object.keys(projectCompletion);
      const completionData = labels.map(project => projectCompletion[project]);

      console.log('Labels:', labels);
      console.log('Completion Data:', completionData);

      // Configurare e creare la chart
      createCompletionChart(labels, completionData);

  } catch (error) {
      console.error('Errore nel recupero dei dati:', error);
  }
}

// Funzione per ottenere l'ID dell'utente dal token
function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) {
      throw new Error('Token non trovato, l\'utente potrebbe non essere autenticato');
  }
  console.log('Token dell\'utente:', token); // Verifica il valore del token
  return token; // Assumi che il token sia l'ID dell'utente o gestisci come necessario
}

// Chiamare la funzione per caricare i dati e creare la chart per l'utente loggato
const loggedInUserId = getUserIdFromToken();
fetchProjectCompletionData(loggedInUserId);
*/ 

// Definizione della funzione getColorForStatus
function getColorForStatus(status) {
  switch (status?.toLowerCase()) {
      case 'completato':
          return 'green';
      case 'testing':
          return 'yellow';
      case 'dev ok':
          return 'blue';
      case 'in progress':
          return 'orange';
      case 'to do':
          return 'red';
      default:
          return 'grey';
  }
}

// Supponendo che l'utente abbia un token o un ID associato
const userId = localStorage.getItem('token');

fetch(`http://localhost:8080/api/projects`)
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
