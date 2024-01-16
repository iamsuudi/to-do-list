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

    for(let index = 0; index < todos.length; index += 1) {
        addTodoToDOM(todos[index], index);
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
            // Creare a todo object, append it to the array and return the new length
            const index = createToDo(titleOfProject, content, 'tomorrow', 'medium') - 1;
            
            // create node for the todo
            addTodoToDOM(todos[index], index);

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


// add listener to projects header button for hovering effect
const projectsHeader = document.querySelector('div.projects-top');
projectsHeader.addEventListener('pointerover', () => {
    const addBtn = projectsHeader.querySelector('button.small');
    addBtn.style.visibility = 'visible';
    addBtn.addEventListener('click', createProject);
});

projectsHeader.addEventListener('pointerleave', () => {
    const addBtn = projectsHeader.querySelector('button.small');
    addBtn.style.visibility = 'hidden';
});


// add listener to priority header button for hovering effect
const priorityHeader = document.querySelector('div.priority');
priorityHeader.addEventListener('pointerover', () => {
    const addBtn = priorityHeader.querySelector('button.small');
    addBtn.style.visibility = 'visible';
});

priorityHeader.addEventListener('pointerleave', () => {
    const addBtn = priorityHeader.querySelector('button.small');
    addBtn.style.visibility = 'hidden';
});