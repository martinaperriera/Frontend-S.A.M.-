// Supponiamo di avere questi dati per i task e i progetti
const userProgress = {
    tasksCompleted: 50,
    projectsCompleted: 10
};

// Badge disponibili
const badges = [
    { id: 1, name: 'Task Beginner', criteria: { tasksCompleted: 10 }, icon: 'img/badges/badge1.svg' },
    { id: 2, name: 'Task Master', criteria: { tasksCompleted: 50 }, icon: 'img/badges/badge2.gif' },
    { id: 3, name: 'Project Starter', criteria: { projectsCompleted: 5 }, icon: 'img/badges/badge3.gif' },
    { id: 4, name: 'Project Leader', criteria: { projectsCompleted: 10 }, icon: 'img/badges/badge4.gif' }
];

// Funzione per verificare quali badge sono stati guadagnati
function getEarnedBadges(userProgress, badges) {
    return badges.filter(badge => {
        const { tasksCompleted, projectsCompleted } = userProgress;
        const { tasksCompleted: requiredTasks, projectsCompleted: requiredProjects } = badge.criteria;

        return (requiredTasks ? tasksCompleted >= requiredTasks : true) &&
               (requiredProjects ? projectsCompleted >= requiredProjects : true);
    });
}

// Funzione per visualizzare i badge nel medagliere
function displayBadges(badges) {
    const container = document.querySelector('.badges-container');
    container.innerHTML = ''; // Pulisce il contenitore dei badge

    badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.classList.add('badge');
        badgeElement.innerHTML = `<img src="${badge.icon}" alt="${badge.name}" title="${badge.name}">`;
        container.appendChild(badgeElement);
    });
}

// Otteniamo i badge guadagnati e li visualizziamo
const earnedBadges = getEarnedBadges(userProgress, badges);
displayBadges(earnedBadges);


// Supponiamo che l'utente abbia completato un nuovo task
userProgress.tasksCompleted += 1;

// Ricontrolliamo i badge guadagnati
const updatedBadges = getEarnedBadges(userProgress, badges);

// Aggiorniamo la visualizzazione dei badge
displayBadges(updatedBadges);