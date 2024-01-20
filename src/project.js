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
    
            local[projects[i]][j] = [title, description, dueDate, priority, note, status];
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

function displayProjectToDos(title) {
    return todos[title];
}

function getProjectTitles() {
    return projects;
}

function displayAllToDos() {
    return projects.map(proj => todos[proj]).flat();
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
    
    if ( syncedLocal && Object.keys(syncedLocal).length !== 0 ) {
        local = syncedLocal;
        for (let i = 0; i < projects.length; i += 1) {

            if (!todos[projects[i]])
                todos[projects[i]] = [];
            
            // create to do object
            const core = local[projects[i]];

            for (let j = 0; j < core.length; j += 1) {
                const param = core[j].slice(0, 4);
                const todo = new ToDo(...param);
                todo.setNote(core[j][4]);
                todo.setStatus(core[j][5]);
                todos[projects[i]].push(todo);
            }
        }
    }

    // sync the todos every one second
    setInterval(sync, 1000);
}

// addDefaultsToLocalStorage();
loadFromLocalStorage();

/* // add default todos to personal category
createToDo('personal', 'Do the laundary', 'today', 'high');
createToDo('personal', 'Pray your selat', 'today', 'high');
createToDo('personal', 'Do exercise', 'today', 'high');
createToDo('personal', 'Create some notes', 'tomorrow', 'high');

// add default todos to work category
createToDo('work', 'Do the assignment', 'tonight', 'high');
createToDo('work', 'Submit your proposal', 'wednesday', 'high');
createToDo('work', 'Write your CV', 'sunday', 'high');
createToDo('work', 'Connect with 10 people', 'today', 'high');

// add default todos to grocery category
createToDo('grocery', 'Go to grocery 1 and buy avocado', 'tomorrow', 'high');
createToDo('grocery', 'Buy salad', 'today', 'high');
createToDo('grocery', 'Buy some milk', 'tomorrow', 'high'); */


export {createToDo, displayAllToDos, displayProjectToDos, addProject, getProjectTitles, deleteProject, deleteTodo};