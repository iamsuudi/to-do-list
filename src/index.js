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
        button.dataset.index = i;
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

            // Creare an onject, append it to the array and return the new length
            button.dataset.index = createToDo('personal', event.target.value, 'tomorrow', 'medium') - 1;

            button.textContent = event.target.value;
            div.appendChild(button);
            
            divList.appendChild(div);

            event.target.value = '';
            event.target.blur();
        }
    })
});

const dialog = document.querySelector('dialog');
const description = document.querySelector('p[class="todo-description"]');
const note = document.querySelector('textarea');

// add listener to todo-btns
const todoButtons = document.querySelectorAll('div.todo button');
todoButtons.forEach(btn => {
    btn.addEventListener('click', event => {
        event.preventDefault();
        const index = event.target.dataset.index;
        description.textContent = todos[index].getDescription();
        note.value = todos[index].getNote();
        dialog.showModal();
    })
})

// add listener to cancel btn
const cancelDialogBtn = document.querySelector('dialog button.cancel');
cancelDialogBtn.addEventListener('click', event => {
    event.preventDefault();
    dialog.close();
})