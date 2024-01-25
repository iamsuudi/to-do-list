import ToDo from "./toDo";

const todos = {
    personal: [],
    work: [],
    grocery: [],
};

let local = {};

const projects = [];

function sync() {
    
    for (let i = 0; i < projects.length; i += 1) {
        
        const td = todos[projects[i]];
        // console.log(td);
        local[projects[i]] = [];

        for (let j = 0; j < td.length; j += 1) {

            const title = td[j].getTitle();
            const description = td[j].getDescription();
            const dueDate = td[j].getDueDate();
            const priority = td[j].getPriority();
            const note = td[j].getNote();
            const status = td[j].getStatus();
            
            local[projects[i]][j] = [
                title, 
                description, 
                [
                    dueDate.getFullYear(), 
                    dueDate.getMonth(), 
                    dueDate.getDate(), 
                    dueDate.getHours(), 
                    dueDate.getMinutes()
                ], 
                priority, 
                note, 
                status
            ];
        }
    }

    localStorage.setItem("local", JSON.stringify(local));
}

function addProject(title) {
    projects.push(title);
    todos[title] = [];

    // add the project to localStorge
    localStorage.setItem("projects", JSON.stringify(projects));
}

function createToDo(title, description, dueDate, priority) {

    if (!(title in todos))
        addProject(title);

    // create to do object
    const todo = new ToDo(title, description, dueDate, priority);

    // add it to the respective array
    return todos[title].push(todo);
}

function getAlltodos() {
    return projects.map(proj => todos[proj]).flat();
}

function displayProjectToDos(title) {
    if (title === 'all-todos')
        return getAlltodos();
    return todos[title];
}

function getProjectTitles() {
    return projects;
}

function deleteProject(title) {
    delete todos[title];
    const index = projects.indexOf(title);
    projects.splice(index, 1);

    // update projects list in localStorage
    window.localStorage.setItem("projects", JSON.stringify(projects));
}

function getLessThanFrequency(title) {
    const titlesBefore = projects.indexOf(title);
    let TotalLengths = 0;
    for (let i = 0; i < titlesBefore; i += 1) {
        TotalLengths += todos[projects[i]].length;
    }
    return TotalLengths;
}

function deleteTodo(title, todoIndex, arrayType) {

    if (arrayType === 'all-todos') {
        const LessThanFreq = getLessThanFrequency(title);
        todos[title].splice(todoIndex - LessThanFreq, 1);
    }
    else
        todos[title].splice(todoIndex, 1);
}

function loadFromLocalStorage() {
    const newTitlesList = JSON.parse(localStorage.getItem("projects"));

    // load project titles to the projects list
    if (!newTitlesList);
    else
        projects.splice(0, projects.length, ...newTitlesList);

    // load all todos in each project to their respective array in the todos object
    const syncedLocal = JSON.parse(localStorage.getItem("local"));
    
    if ( syncedLocal && Object.keys(syncedLocal).length !== 0 ) { // checks if the localStorage is empty

        local = syncedLocal;

        for (let i = 0; i < projects.length; i += 1) {

            // initialize arrray for the project category to push todos in it
            todos[projects[i]] = [];
            
            // extract datas of specific project category to create todo objects from it
            const core = local[projects[i]];
            
            for (let j = 0; j < core.length; j += 1) {

                // extract data of specific todo object
                const [t, des, dat, prio, note, stat] = core[j];

                // create todo object by the 4 parameters
                const todo = new ToDo(t, des, new Date(...dat), prio);

                todo.setNote(note);

                todo.setStatus(stat);

                // add the created todo object to the array
                todos[projects[i]].push(todo);
            }
        }
    }

    // sync the todos every one second
    setInterval(sync, 1000);
}

// addDefaultsToLocalStorage();
loadFromLocalStorage();


export {createToDo, displayProjectToDos, addProject, getProjectTitles, deleteProject, deleteTodo};