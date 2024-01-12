import {createToDo, displayToDos} from "./personal";
import './style.sass';

createToDo('do the laundary', 'tomorrow', 'high');
createToDo('pray your selat', 'tomorrow', 'high');
createToDo('do exercise', 'tomorrow', 'high');
createToDo('create some notes', 'tomorrow', 'high');

const todos = displayToDos();

const divList = document.querySelector('div.list');

function checkClicked(event) {
    const todo = event.target.parentElement;
    const button = todo.querySelector('button');
    const todoContainer = todo.parentElement;

    if ( button.className === 'done-task') {
        // undo the task
        button.className = '';

        // move it to the top
        todoContainer.prepend(todo);
    }
    else {
        // do the task
        button.className = 'done-task';

        // move it to the bottom
        todoContainer.appendChild(todo);
    }
}

function render() {

    for(let i = 0; i < todos.length; i += 1) {
        const div = document.createElement('div');
        div.className = 'todo';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('click', checkClicked);
        div.appendChild(checkbox);

        const button = document.createElement('button');
        button.textContent = todos[i].getDescription();
        div.appendChild(button);

        divList.appendChild(div);
    }
}

render();

const input = document.querySelector('div.input input');

// add input listener and render a new todo to the DOM
input.addEventListener('focus', event => {
    window.addEventListener('keydown', e => {
        if (e.code === 'Enter' && event.target.value !== '') {
            // create node for the todo
            const div = document.createElement('div');
            div.className = 'todo';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('click', checkClicked);
            div.appendChild(checkbox);

            const button = document.createElement('button');
            button.textContent = event.target.value;
            div.appendChild(button);
            
            divList.appendChild(div);

            // Creare an onject and append it to the array
            createToDo('personal', event.target.value, 'tomorrow', 'medium');

            event.target.value = '';
            event.target.blur();
        }
    })
});