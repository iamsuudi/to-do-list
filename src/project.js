import ToDo from "./toDo";

const todos = {
    personal: [],
    work: [],
    grocery: [],
};

const projects = ['personal', 'work', 'grocery'];

function createToDo(title, description, dueDate, priority) {
    // create to do object
    const todo = new ToDo(title, description, dueDate, priority);

    // add it to the respective array
    return todos[title].push(todo);
}

function displayProjectToDos(title) {
    return todos[title];
}

function addProject(title) {
    projects.push(title);
    todos[title] = [];
}

function projectTitles() {
    return projects;
}

function displayAllToDos() {
    return projects.map(proj => todos[proj]).flat();
}


// add default todos to personal category
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
createToDo('grocery', 'Buy some milk', 'tomorrow', 'high');


export {createToDo, displayAllToDos, displayProjectToDos, addProject, projectTitles};