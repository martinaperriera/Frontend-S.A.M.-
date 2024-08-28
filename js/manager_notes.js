// Seleziona gli elementi della DOM
const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupTitle = popupBox.querySelector("header p");
const closeIcon = popupBox.querySelector("header i");
const titleTag = popupBox.querySelector("input");
const descTag = popupBox.querySelector("textarea");
const addBtn = popupBox.querySelector("button");
const notesContainer = document.querySelector(".notes-container"); // Aggiungi un contenitore per le note

const months = ["January", "February", "March", "April", "May", "June", "July",
                 "August", "September", "October", "November", "December"];
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

// Mostra il popup per aggiungere una nota
addBox.addEventListener("click", () => {
    popupTitle.innerText = "Add a new Note";
    addBtn.innerText = "Add Note";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

// Chiudi il popup
closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

// Mostra le note salvate
function showNotes() {
    if (!notes) return;
    notesContainer.innerHTML = ""; // Pulisce il contenitore delle note esistenti
    notes.forEach((note, id) => {
        let filterDesc = note.description.replace(/\n/g, '<br/>'); // Usa regex per sostituire i ritorni a capo
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        notesContainer.insertAdjacentHTML("beforeend", liTag);
    });
}
showNotes();

// Mostra il menu delle azioni della nota
function showMenu(elem) {
    const menu = elem.parentElement.querySelector(".menu");
    menu.classList.add("show");
    document.addEventListener("click", e => {
        if (!elem.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove("show");
        }
    });
}

// Elimina una nota
function deleteNote(noteId) {
    let confirmDel = confirm("Are you sure you want to delete this note?");
    if (!confirmDel) return;
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

// Aggiorna una nota esistente
function updateNote(noteId, title, filterDesc) {
    let description = filterDesc.replace(/<br\/>/g, '\n'); // Usa regex per sostituire i <br/> con i ritorni a capo
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Update a Note";
    addBtn.innerText = "Update Note";
}

// Aggiungi o aggiorna una nota
addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
        description = descTag.value.trim();
    if (title || description) {
        let currentDate = new Date(),
            month = months[currentDate.getMonth()],
            day = currentDate.getDate(),
            year = currentDate.getFullYear();

        let noteInfo = { title, description, date: `${month} ${day}, ${year}` }; // Corretto il formato della data
        if (!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo;
        }
        localStorage.setItem("notes", JSON.stringify(notes));
        showNotes();
        closeIcon.click();
    }
});
