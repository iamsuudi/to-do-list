import ToDo from "./toDo";

const todos = [];

function createToDo(description, dueDate, priority, title = 'personal') {
    // create to do object
    const todo = new ToDo(description, dueDate, priority, title);

    // add it to the array
    return todos.push(todo);
}

function displayToDos() {
    return todos;
}

export {createToDo, displayToDos};