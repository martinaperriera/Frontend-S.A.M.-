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
                <div class="row"> 
                    <div class="widget-content p-0">
                        <div class="widget-content-wrapper">
                            <div class="col-2"> 
                                <div class="widget-content-left">
                                    <div class="widget-heading" style="color : ${taskStatusColor}">${taskPriority}</div>
                                    <div class="widget-subheading">Creazione: ${taskCreated}</div>
                                    <div class="widget-subheading">Scadenza: ${taskEndDate}</div>   
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
