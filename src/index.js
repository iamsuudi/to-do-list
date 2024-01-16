import {createToDo, displayAllToDos, displayProjectToDos, addProject, projectTitles} from "./project";
import './styles/style.sass';

let titleOfProject = 'personal';

const projects = document.querySelector('div.projects');
let todos = displayProjectToDos(titleOfProject);
const divList = document.querySelector('div.list');
const dialog = document.querySelector('dialog');
const description = document.querySelector('input.todo-description');
const note = document.querySelector('textarea#note');
const cancelDialogBtn = document.querySelector('dialog button.cancel');
const input = document.querySelector('div.input input');

// load projects
window.addEventListener('DOMContentLoaded', () => {
    const titles = projectTitles();
    for(let i = 0; i < titles.length; i += 1) {
        const btn = document.createElement('button');
        btn.className = titles[i].toLowerCase();
        btn.innerHTML = titles[i].toUpperCase();
        projects.appendChild(btn);
    }
});

// a function which responds to todo done checker
function checkClicked(event) {
    const todo = event.target.parentElement;
    const checkerBtn = event.target;
    const todoNameBtn = todo.querySelector('button.description');
    const {index} = todoNameBtn.dataset;

    if (todos[index].getStatus() === 'done') {
        // undo the task
        todoNameBtn.dataset.status = 'pending';
        checkerBtn.dataset.status = 'pending';
        todos[index].setStatus('pending');

        // move it to the top
        divList.prepend(todo);
    }
    else {
        // do the task
        todoNameBtn.dataset.status = 'done';
        checkerBtn.dataset.status = 'done';
        todos[index].setStatus('done');

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

// load todos in a project
function render() {

    for(let i = 0; i < todos.length; i += 1) {
        const div = document.createElement('div');
        div.className = 'todo';

        const btn = document.createElement('button');
        btn.className = 'status-checker';
        btn.addEventListener('click', checkClicked);
        btn.dataset.status = todos[i].getStatus();
        div.appendChild(btn);

        const button = document.createElement('button');
        button.textContent = todos[i].getDescription();
        button.className = 'description';
        button.dataset.index = i;
        button.dataset.status = todos[i].getStatus();
        button.addEventListener('click', todoClicked);
        div.appendChild(button);

        divList.appendChild(div);
    }
}

render();


// add listener to cancel btn
cancelDialogBtn.addEventListener('click', e => {
    e.preventDefault();
    const {index} = dialog.dataset;
    todos[index].setNote(note.value);
    todos[index].setDescription(description.value);
    dialog.close();
    document.querySelector(`button.description[data-index="${index}"]`).textContent = description.value;
});

// add input listener and render a new todo to the DOM
input.addEventListener('focus', event => {
    window.addEventListener('keydown', e => {
        const content = event.target.value;
        if (e.code === 'Enter' && content !== '') {
            // Creare an onject, append it to the array and return the new length
            const index = createToDo(titleOfProject, content, 'tomorrow', 'medium') - 1;
            
            // create node for the todo
            const div = document.createElement('div');
            div.className = 'todo';
            
            const btn = document.createElement('button');
            btn.className = 'status-checker';
            btn.addEventListener('click', checkClicked);
            btn.dataset.status = todos[index].getStatus();
            div.appendChild(btn);
            
            const button = document.createElement('button');
            button.className = 'description';
            button.dataset.index = index;
            button.dataset.status = todos[index].getStatus();


            button.textContent = content;
            button.addEventListener('click', todoClicked);
            div.appendChild(button);
            
            divList.appendChild(div);

            event.target.value = '';
            event.target.blur();
        }
    })
});

// a function which responds when project button clicked
function projectClicked(event) {
    const {target} = event;

    titleOfProject = target.className;
    todos = displayProjectToDos(titleOfProject);
    divList.innerHTML = '';
    render();
}

// add listerner to projects buttons
projects.addEventListener('click', projectClicked);
