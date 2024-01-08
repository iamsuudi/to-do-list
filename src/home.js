import ToDo from "./toDo";

const todos = [];

function createToDo(title, description, dueDate, priority) {
    // create to do object
    const todo = new ToDo(title, description, dueDate, priority);

    // add it to the array
    todos.push(todo);
}

function displayToDos() {
    console.log(todos.map(td => td.getDescription()).join('\n'));
}

export {createToDo, displayToDos};