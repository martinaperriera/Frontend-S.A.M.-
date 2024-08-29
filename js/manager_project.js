function formatDate(inputDate) {
  const [day, month, year] = inputDate.split("/");
  return `${year}-${month}-${day}`;
}


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
    document.getElementById("unassigned-task-list").innerHTML = "";
    await showProjects(mileID);
    showTasksInModal(mileID);
  };
  window.showTasksInModal = async function(mileID) {
    document.getElementById("task-list").innerHTML = '';
    document.getElementById("unassigned-task-list").innerHTML = '';
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
      //TEMPLATE DELla lista del progetto
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
    //aggiunge riga per nuovo proj
    let projectListItem = document.createElement("a");
    projectListItem.className = "list-group-item list-group-item-action";
    projectListItem.setAttribute("data-bs-toggle", "list");
    projectListItem.setAttribute("role", "tab");
    projectListItem.setAttribute("onclick", `showNewProjectModal()`); 
    projectListItem.innerHTML = `<i class="fa-solid fa-plus"></i> Nuovo Progetto`;
    document.getElementById("list-tab").appendChild(projectListItem);
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
        let mileEnd = m.end_date;
      if ( mileEnd == null)
        mileEnd = "Da definire"
      const mileDesc = m.mile_desc;
      const mileName = m.mile_name;
      const mileOwnerID = m.mileOwnerID;
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
        <div class="p-2 single-timeline-content wow fadeInLeft" data-wow-delay="0.3s" data-bs-target="#mileTaskModal" data-bs-toggle="modal" onclick="showTasksInModal(${mileID})"
            style="visibility: visible; animation-delay: 0.3s; animation-name: fadeInLeft;">
            <div class="row">
            <div class="col-2">
            <div class="timeline-icon me-auto"><i class="${mileIcon} " style="margin: 0px" aria-hidden="true"></i></div>
            </div>
            <div class="col-10">
            <div class="timeline-text" style="min-width: 120px">
                <h6 class="border-bottom">${mileName}</h6>
                <p class="border_bottom">${mileDesc}</p>
                <div class="progress mt-3">
                <div class="progress-bar overflow-visible progress-bar-striped ${barColor} progress-bar-animated" role="progressbar"
                    aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"
                    style="width: ${((mileDsp+1) / (mileTotal+1)) * 100}%"> <i class="fa-solid fa-dragon" style="color:lime" small ><span style="color: white"> ${mileValue} / ${mileTotal}</span></i></div>
            </div> <br>
           

        </div>
            </div>
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
    
    })
    let newMileBtn = document.createElement("button")
    newMileBtn.setAttribute("onclick", `showNewMileModal(${projID})`); 
    newMileBtn.innerHTML = `<i class="fa-solid fa-plus"></i> Nuovo Milestone`;
    document.getElementById("mileBtn").innerHTML="";
    document.getElementById("mileBtn").appendChild(newMileBtn);

  }
  let newMileProj;
  window.showNewMileModal = function (projectID) {
    newMileModal.style.display = "block";
    newMileProj = projectID
  };

  window.closeNewMileModal = async function () {
    newMileModal.style.display = "none";
    await saveMilestone(newMileProj)
   
  }

  async function saveMilestone(projectID) {
    const mileName = document.getElementById("newMileName").value;
    const mileDesc = document.getElementById("newMileDesc").value;
    const mileEnd = document.getElementById("newMileEnd").value;
    const mileIcon = document.getElementById("newMileIcon").value;
    try {
      const response = await fetch("http://localhost:8080/api/milestones", {
        method: "POST",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "mile_name": mileName,
          "mile_desc": mileDesc,
          "mile_icon": mileIcon,
          "mile_value": 0,
          "mile_total": 0,
          "projectID": newMileProj,
          "owner_id": myUser.id,
          "end_date": mileEnd,
        }),
      });
      if (response.status === 200) {
      await showProjects()
      await showMilestones(newMileProj)
      }
    } catch (error) {
      console.error("Error saving task: ", error);
    }
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
      const response = await fetch("http://localhost:8080/api/projects/manager", {
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

    console.log(milestone)
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
      let taskPriority 
      if(task.status.status != null)
        taskPriority = task.status.status;
      else taskPriority = 1
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
      if(taskAssigned)
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
         <div class="dropdown-center" id="dropdown">

              <button class="btn btn-outline-secondary border-0"  type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fa-solid fa-ellipsis"></i>
              </button>
              <button class="ms-2 border-0 btn-transition btn btn-outline-secondary" onclick="showUpdateTaskModal(${taskID},${taskProjectID}, null, ${task.milestone.id})">
                  <i class="fa-regular fa-pen-to-square"></i>   
              </button>
              <button class="border-0 btn-transition btn btn-outline-danger" onclick="deleteTask(${taskID}, ${task.milestone.id})">
                  <i class="fa-solid fa-trash-can"></i>
              </button>
              <ul class="dropdown-menu" style="background-color: #2a2727">
              <li>
            
              <button class="ms-1 border-0 btn-transition btn btn-outline-success" onclick=" showChangePriorityModal2(${taskID})">
                  <i class="fa-solid fa-clock-rotate-left"></i>               
              </button>
              <button class="ms-1 border-0 btn-transition btn btn-outline-warning" onclick="showAssignUserModal(${taskID},${taskProjectID}, ${task.milestone.id})">
                  <i class="fa-solid fa-user-pen"></i>
              </button>
       
              <button class="ms-1 border-0 btn-transition btn btn-outline-danger" onclick="unassignUser(${taskID}, ${task.milestone.id})">
                  <i class="fa-solid fa-user-minus"></i>    
              </button>
       
              </li>
            </ul>
          
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
      <div class="dropdown-center" id="dropdown">

                <button class="btn btn-outline-secondary border-0"  type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fa-solid fa-ellipsis"></i>
              </button>
              <button class="ms-2 border-0 btn-transition btn btn-outline-secondary" onclick="showUpdateTaskModal(${taskID},${taskProjectID}, ${task.userID}, ${task.milestone.id})">
                  <i class="fa-regular fa-pen-to-square"></i>   
              </button>
              <button class="border-0 btn-transition btn btn-outline-danger" onclick="deleteTask(${taskID}, ${task.milestone.id})">
                  <i class="fa-solid fa-trash-can"></i>
              </button>
              <ul class="dropdown-menu" style="background-color: #2a2727">
              <li>
            
              <button class="ms-1 border-0 btn-transition btn btn-outline-success" onclick=" showChangePriorityModal2(${taskID})">
                  <i class="fa-solid fa-clock-rotate-left"></i>               
              </button>
              <button class="ms-1 border-0 btn-transition btn btn-outline-warning" onclick="showAssignUserModal(${taskID},${taskProjectID}, ${task.milestone.id})">
                  <i class="fa-solid fa-user-pen"></i>
              </button>
              </li>
            </ul>
          
          </div>
              </div>
              </div>
              </div>
              </div>
              </div>
          `;
    if(taskAssigned == true)
    document.getElementById("task-list").appendChild(listItem);
    else
    document.getElementById("unassigned-task-list").appendChild(listItem);
  document.getElementById("xcloseStatusModal").setAttribute("onclick", `closeChangePriorityModalProj(${milestone.id})`)
      
      }
  });
  //PER METTERE TASK COMPLETATA
  //ATTUALMENTE INUTILIZZATA LATO MANAGER
  window.completeTask = async function (taskID, mileID) {
    await completeTask(taskID);
    document.getElementById("task-list").innerHTML = "";
    document.getElementById("unassigned-task-list").innerHTML = "";
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
    document.getElementById("unassigned-task-list").innerHTML = "";
    showProjects(mileID);
    showTasksInModal(mileID);
  } 
  window.filterTasks = async function (mileID) {
    document.getElementById("task-list").innerHTML = "";
    document.getElementById("unassigned-task-list").innerHTML = "";
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
window.addEventListener("load", async function() {
  await fillProjectArr();
  await getAllUsers();
  populateSelectWithArray(allUsers, "NewProjUsers", "nomeCompleto", "Nessun consulente trovato")
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
})
async function startup() {

}
  //ROBA DA RUNNARE
 

//VARIABILI DI SERVIZIO
let customerArr = [];
 
   //  mostra add Project Modal
window.showNewProjectModal = function () {
  newProjectModal.style.display = "block";
  fillCustomers()
};

// chiudi add Project Modal
window.closeNewProjectModal = function () {
  newProjectModal.style.display = "none";
  saveProject();
  showProjects();
};

//cerca tutti i progetti assegnati al manager e li conserva in arr
async function fillCustomers() {
try {
  const response = await fetch(
    "http://localhost:8080/api/customers",
    {
      method: "GET",
      headers: {
        token: token,
      },
    }
  );
  if (response.status === 200) {
    const data = await response.json();
    data.forEach((element) => {
      customerArr.push(element);
    });
 }
} catch (error) {
  console.error("Error fetching projects:", error);
}
console.log(customerArr)
populateSelectWithArray(customerArr, "NewProjCustomer", "customer_name", "nessun cliente")
}

async function saveProject() {
//valori form
const projBudget = document.getElementById("newProjBudget").value;
const projEnd = document.getElementById("newProjEnd").value;
const projExpected = document.getElementById("newProjExpected").value;
const projName = document.getElementById("newProjName").value;
const projDesc = document.getElementById("newProjDesc").value;
const projStatus = document.getElementById("newProjStatus").value;
const projCustomerID = document.getElementById("NewProjCustomer").value;
let userSelect = document.getElementById("NewProjUsers")
let projUserIDs = Array.from(userSelect.selectedOptions).map(option => option.value)
let projUsers = [] 
projUserIDs.forEach((userID) => {
    allUsers.forEach((user) => {
        if (user.id == userID)
            projUsers.push(user)
    })
})
if (projUsers.length == 0)
    projUsers = null 
try {
  const response = await fetch("http://localhost:8080/api/projects", {
    method: "POST",
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({

      "project_name": projName,
      "end_date": projEnd,
      "expected_date": projExpected,
      "description" : projDesc,
      "status": projStatus,
      "budget": projBudget,
      "customer": { "id" : projCustomerID

      },
      "value" :0,
      "total" : 0,
      "user": myUser,  
      "projectUsers": projUsers
    }),
  });
  if (response.status === 201) {
  showProjects()
  }
} catch (error) {
  console.error("Error saving task: ", error);
}
}
  //cerca tutti i progetti assegnati al manager e li conserva in arr
  async function fillProjectArr() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/projects/manager",
          {
            method: "GET",
            headers: {
              token: token,
            },
          }
        );
        if (response.status === 200) {
          projectArr = [];
          const data = await response.json();
          data.forEach((element) => {
            projectArr.push(element);
          });
       }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }}
        //CAMBIA STATUS DELLA TASK


// chiudi modal cambia status

//riempe statusArr[] con tutti gli status delle task possibili e poi riempe
//la SELECT nel pararmetro
async function fillStatusSelect(selectID) {
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
  populateSelectWithArray(
    statusArr,
    selectID,
    "status",
    "Status non caricati correttamente"
  );
}

//PER CANCELLARE LA TASK DA DB
async function deleteTask(taskID) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/tasks/${taskID}`,
      {
        method: "DELETE",
        headers: {
          token: token,
        },
      }
    );
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  }
}
 //elimina la task dalla lista
 window.deleteTask = async function (taskID, mileID) {
  let task = document.getElementById(`task${taskID}`);
  if (await deleteTask(taskID)) task.parentElement.removeChild(task);
  document.getElementById("task-list").innerHTML = "";
  document.getElementById("unassigned-task-list").innerHTML = "";
  await showProjects(mileID);
  await showTasksInModal(mileID);
};

async function fillUsersFilter() {
  let allTheUsers = [];
  try {
    const response = await fetch("http://localhost:8080/api/users", {
      method: "GET",
      headers: {
        token: token,
      },
    });
    if (response.status === 202) {
      const data = await response.json();
      data.forEach((user) => {
        allTheUsers.push(user);
      });
      populateSelectWithArray(
        allTheUsers,
        "searchUserID",
        "nomeCompleto",
        "Nessun utente trovato"
      );
    } else console.log("bambo");
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
/* 
ALLORA DEVO METTERE I MILEID NELLE FUNZIONI PER AGGIORNARE TUTTO QUANDO SI DA OK
DEVO FINIRE DI AGGIUSTARE LE FUNZIONALITà DEL MANAGER
CRUD MILESTONE E PROGETTI

*/
async function removeUserFromTask(taskID) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/tasks/unassign/${taskID}`,
      {
        method: "GET",
        headers: {
          token: token,
        },
      }
    );
    if (response.status === 200) {
      document.getElementById("task-list").innerHTML = "";
    }
  } catch (error) {
    console.error("Error completing task:", error);
  }
}

window.unassignUser = async function (taskID, mileID) {
  await removeUserFromTask(taskID);
  document.getElementById("task-list").innerHTML = "";
  document.getElementById("unassigned-task-list").innerHTML = "";
  await showProjects(mileID);
  await showTasksInModal(mileID);
};

//MODIFICA TASK
//varibili di servizio
let taskUpdateID;
let taskUpdateUserID;
let taskUpdateProjectID;
let taskMilestoneID
//  apri update Task Modal
window.showUpdateTaskModal = function (taskID, projectID, userID, mileID) {
  taskUpdateID = taskID;
  taskUpdateProjectID = projectID;
  taskUpdateUserID = userID;
  taskMilestoneID = mileID
  updateTaskModal.style.display = "block";
  document.getElementById("mileTaskModal").style.display ="none"
};

// chiudi update taskModal
window.closeUpdateTaskModal = async function (mileID) {
  if(mileID){
    document.getElementById("task-list").innerHTML = "";
    document.getElementById("unassigned-task-list").innerHTML = "";
    await showProjects(mileID);
    await showTasksInModal(mileID);
  }
  document.getElementById("mileTaskModal").style.display ="block"
  updateTaskModal.style.display = "none";
};

updateTaskForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  document.getElementById("task-list").innerHTML = "";
  await updateTask(taskUpdateID, taskUpdateProjectID, taskUpdateUserID);
  addTaskForm.reset();
  closeUpdateTaskModal(taskMilestoneID);
});

async function updateTask(taskID) {
  //valori form
  const taskName = document.getElementById("updateTaskName").value;
  const taskDescription = document.getElementById(
    "updateTaskDescription"
  ).value;
  const taskEndDate = document.getElementById("updateTaskEndDate").value;
  console.log(taskID);
  const taskValue = document.getElementById("updateTaskValue").value;
  try {
    const response = await fetch(
      `http://localhost:8080/api/tasks/${taskID}`,
      {
        method: "PUT",
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: taskID,
          task_name: taskName,
          task_desc: taskDescription,
          end_date: taskEndDate,
          value: taskValue,
        }),
      }
    );
  } catch (error) {
    console.error("Error saving task: ", error);
  }
}

//
//ASSEGNA TASK a consulente
//variabili di servizio
let assignUserID;
let projectUsers = [];
let assignMileID;
//mostra modale per assegnare consulente a task
window.showAssignUserModal = async function (taskID, projectID, mileID) {
  assignUserModal.style.display = "block";
  //conserva il parametro taskid nella variabile assignuser per salvarlo a db
  assignUserID = taskID;
  assignMileID = mileID;
  //prende tutti gli utenti assegnati al progetto
  await getProjectUsers(projectID);
  //funzione di servizio che riempe le opzioni di una select
  populateSelectWithArray(
    projectUsers,
    "assignUserSelect",
    "nomeCompleto",
    "Non ci sono consulenti assegnati!"
  );
};
//chiude modale per assegnare consulente a task
window.closeAssignUserModal = async function () {
  //qui salva a db chiudendo il modal e usando il valore della select determina user target
  await assignUser(assignUserID);  document.getElementById("task-list").innerHTML = "";
  document.getElementById("unassigned-task-list").innerHTML = "";
  projectUsers = []
  await showProjects(assignMileID);
  await showTasksInModal(assignMileID );
  assignUserModal.style.display = "none";
};

//PER SALVARE A DB IL CONSULENTE ASSEGNATO ALLA TASK
async function assignUser(taskID) {
  let userID = document.getElementById("assignUserSelect").value;
  console.log(taskID)
  console.log(userID)
  try {
    const response = await fetch(
      `http://localhost:8080/api/tasks/assign/${taskID}/${userID}`,
      {
        method: "PUT",
        headers: {
          token: token,
        },
      }
    );
    if (response.status === 200) {
      console.log("pippo")
    }
  } catch (error) {
    console.error("Error fetching project users:", error);
  }
}
//usata per riempire projectUsers[] di tutti gli user che lavorano sul progetto
async function getProjectUsers(projectID) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/projects/${projectID}/users`,
      {
        method: "GET",
        headers: {
          token: token,
        },
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      data.forEach((element) => {
        projectUsers.push(element);
      });
    }
  } catch (error) {
    console.error("Error fetching project users:", error);
  }
}


/* async function showProjects() {
      projectArr.forEach((project) => {
         let newRow = document.createElement('tr')
          newRow.id = `row${project.id}`
          newRow.innerHTML =`
              <td>${project.project_name}</td>
              <td>${project.description}</td>
              <td>${project.customer.customer_name}</td>
              <td>${project.budget}</td>
              <td>${project.status}</td>
              <td>${project.start_date}</td>
              <td>${project.end_date}</td>
              <td>
                  <div class="dropdown-center" id="dropdown">
                      <button class="btn btn-outline-secondary border-0"  type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="fa-solid fa-ellipsis"></i>
                      </button>
                      <button class="ms-2 border-0 btn-transition btn btn-outline-secondary" onclick="">
                          <i class="fa-regular fa-pen-to-square"></i>   
                      </button>
                      <button class="border-0 btn-transition btn btn-outline-danger" onclick="">
                          <i class="fa-solid fa-trash-can"></i>
                      </button>
                      <ul class="dropdown-menu" style="background-color: #2a2727">
                          <li>
              
                              <button class="ms-1 border-0 btn-transition btn btn-outline-success" onclick="">
                                  <i class="fa-solid fa-clock-rotate-left"></i>               
                              </button>
                              <button class="ms-1 border-0 btn-transition btn btn-outline-warning" onclick="">
                                  <i class="fa-solid fa-user-pen"></i>
                              </button>
                              <button class="ms-1 border-0 btn-transition btn btn-outline-danger" onclick="">
                                  <i class="fa-solid fa-user-minus"></i>    
                              </button>
                          </li>
                      </ul>
                  </div>
          </td>
          `
          document.getElementById("projectTableBody").appendChild(newRow)
      })
  }*/
let allUsers = []
  async function getAllUsers() {
      try {
          const response = await fetch(
            "http://localhost:8080/api/users",
            {
              method: "GET",
              headers: {
                token: token,
              },
            }
          );
          if (response.status === 202) {
            const data = await response.json();
            allUsers = [];
            data.forEach((element) => {
                allUsers.push(element);
              });
              console.log(allUsers)
         }
        } catch (error) {
          console.error("Error fetching users:", error);
        }}


  function populateSelectWithArray(array, selectId, nameProp, message) {
      const selectElement = document.getElementById(selectId);
      if (array.length > 0) {
        selectElement.innerHTML = '<option value="null">Nessuna scelta</option>';
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
    document.getElementById('newMileIcon').addEventListener('change', function() {
      var selectedIcon = this.value;
      var previewIcon = document.getElementById('icon-preview');
      
      // Aggiorna la classe dell'icona di anteprima
      previewIcon.className = selectedIcon;
  }); 
    
});
