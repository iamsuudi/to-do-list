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

export {createToDo, displayAllToDos, displayProjectToDos, addProject, projectTitles};