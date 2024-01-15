import {createToDo, displayAllToDos, displayProjectToDos, addProject, projectTitles} from "./project";
import './styles/style.sass';

let titleOfProject = 'personal';

const todos = displayToDos();

const projects = document.querySelector('div.projects');
let todos = displayProjectToDos(titleOfProject);
const divList = document.querySelector('div.list');
const dialog = document.querySelector('dialog');
const description = document.querySelector('input.todo-description');
const note = document.querySelector('textarea#note');
const cancelDialogBtn = document.querySelector('dialog button.cancel');

// load projects
window.addEventListener('DOMContentLoaded', () => {
    const btn = document.createElement('button');
    const titles = projectTitles();
    for(let i = 0; i < titles.length; i += 1) {
        btn.className = titles[i].toLowerCase();
        btn.textContent = titles[i];
        projects.appendChild(btn.cloneNode());
    }
});

// a function which responds to todo done checker
function checkClicked(event) {
    const todo = event.target.parentElement;
    const descBtn = todo.querySelector('button.description');

    if (descBtn.dataset.status === 'done') {
        // undo the task
        descBtn.dataset.status = 'not';
        event.target.dataset.status = 'not';

        // move it to the top
        divList.prepend(todo);
    }
    else {
        // do the task
        descBtn.dataset.status = 'done';
        event.target.dataset.status = 'done';

        // move it to the bottom
        divList.appendChild(todo);
    }
}

function todoClicked(event) {
    event.preventDefault();
    const {index} = event.target.dataset;
    description.value = todos[index].getDescription();
    note.value = todos[index].getNote();
    dialog.showModal();
    dialog.dataset.index = index;
}

// add listener to cancel btn
cancelDialogBtn.addEventListener('click', e => {
    e.preventDefault();
    const {index} = dialog.dataset;
    todos[index].setNote(note.value);
    todos[index].setDescription(description.value);
    dialog.close();
    document.querySelector(`button.description[data-index="${index}"]`).textContent = description.value;
});

function render() {

    for(let i = 0; i < todos.length; i += 1) {
        const div = document.createElement('div');
        div.className = 'todo';

        const btn = document.createElement('button');
        btn.className = 'done-or-not';
        btn.addEventListener('click', checkClicked);
        btn.dataset.status = 'not';
        div.appendChild(btn);

        const button = document.createElement('button');
        button.textContent = todos[i].getDescription();
        button.className = 'description';
        button.dataset.index = i;
        button.dataset.status = 'not';
        button.addEventListener('click', todoClicked);
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

            const btn = document.createElement('button');
            btn.className = 'status-checker';
            btn.addEventListener('click', checkClicked);
            btn.dataset.status = 'not';
            div.appendChild(btn);

            const button = document.createElement('button');
            button.className = 'description';
            button.dataset.status = 'not';

            // Creare an onject, append it to the array and return the new length
            button.dataset.index = createToDo('personal', event.target.value, 'tomorrow', 'medium') - 1;

            button.textContent = event.target.value;
            button.addEventListener('click', todoClicked);
            div.appendChild(button);
            
            divList.appendChild(div);

            event.target.value = '';
            event.target.blur();
        }
    })
});
