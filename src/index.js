import {createToDo, displayAllToDos, displayProjectToDos, addProject, getProjectTitles, deleteProject, deleteTodo} from "./project";
import './styles/style.sass';

let titleOfProject = 'personal';

const projects = document.querySelector('div.projects');
let todos = displayProjectToDos(titleOfProject);
const titles = getProjectTitles();
const divList = document.querySelector('div.list');
const dialog = document.querySelector('dialog');
const description = document.querySelector('input.todo-description');
const note = document.querySelector('textarea#note');
const cancelDialogBtn = document.querySelector('dialog button.cancel');
const input = document.querySelector('div.input input');


// a function which responds to todo done checker
function checkClicked(event) {
    const todo = event.target.parentElement;
    const checkerBtn = event.target;
    const todoNameBtn = todo.querySelector('button.description');
    const {todoIndex} = todoNameBtn.dataset;

    if (todos[todoIndex].getStatus() === 'done') {
        // undo the task
        todoNameBtn.dataset.status = 'pending';
        checkerBtn.dataset.status = 'pending';
        todos[todoIndex].setStatus('pending');

        // move it to the top
        divList.prepend(todo);
    }
    else {
        // do the task
        todoNameBtn.dataset.status = 'done';
        checkerBtn.dataset.status = 'done';
        todos[todoIndex].setStatus('done');

        // move it to the bottom
        divList.appendChild(todo);
    }
}

function todoClicked(event) {
    event.preventDefault();
    const todo = event.target;
    const {todoIndex} = todo.dataset;
    description.value = todos[todoIndex].getDescription();
    note.value = todos[todoIndex].getNote();
    dialog.showModal();
    dialog.dataset.index = index;
}

function addTodoToDOM(todo, index) {

    // create todo div node
    const todoNode = document.createElement('div');
    todoNode.className = 'todo';

    // create todo status checker button
    const btn = document.createElement('button');
    btn.className = 'status-checker';
    btn.addEventListener('click', checkClicked);   // change appearance when clicked
    btn.dataset.status = todo.getStatus();
    todoNode.appendChild(btn);

    // create todo name button
    const button = document.createElement('button');
    button.textContent = todo.getDescription();
    button.className = 'description';
    button.dataset.todoIndex = index;
    button.dataset.todoTitle = todo.getTitle();
    button.dataset.status = todo.getStatus();
    button.addEventListener('click', todoClicked);  // open detail when clicked
    todoNode.appendChild(button);

    divList.appendChild(todoNode);

    divList.classList.add(todo.getTitle());
}

// a function which responds when project button clicked
function projectClicked(event) {
    
    divList.className = 'list';

    const proj = event.target;

    titleOfProject = proj.className;
    todos = displayProjectToDos(titleOfProject);
    divList.innerHTML = '';

    // load todos in a project
    for(let index = 0; index < todos.length; index += 1) {
        addTodoToDOM(todos[index], index);
    }

    // disable input
    input.removeAttribute('disabled');

    divList.classList.add(titleOfProject);
}

function displayAllTodosCreated() {    
    divList.classList[1] = 'all-todos';
    divList.innerHTML = '';
    todos = displayAllToDos();

    // load todos
    for(let index = 0; index < todos.length; index += 1) {
        addTodoToDOM(todos[index], index);
    }

    // disable input
    input.setAttribute('disabled', 'true');
}

function deleteProjectFromDOM(event) {
    const proj = event.target.parentElement;
    
    const indexOfProject = titles.indexOf(proj.classList[0]);

    // delete object first
    deleteProject(proj.classList[0]);

    // remove from DOM
    proj.remove();
    
    // check if the currently displayed todos are of this project
    if (divList.classList[1] === proj.classList[0]) {
        
        divList.innerHTML = '';
        todos = displayProjectToDos(titles[indexOfProject]);

        // load todos in a project
        for(let index = 0; index < todos.length; index += 1)
            addTodoToDOM(todos[index], index);
    }
}

function addProjectToDOM(title) {
    // create project div node
    const proj = document.createElement('div');
    proj.classList.add(title.toLowerCase(), 'project');

    // add title button
    const titleBtn = document.createElement('button');
    titleBtn.className = title.toLowerCase();
    titleBtn.textContent = title.toUpperCase();
    proj.appendChild(titleBtn);

    // add delete button
    const delBtn = document.createElement('button');
    delBtn.classList.add(title.toLowerCase(), 'small');
    delBtn.addEventListener('click', deleteProjectFromDOM);
    proj.appendChild(delBtn);
    
    // add listener for hovered state to display delete button
    proj.addEventListener('pointerover', () => {
        delBtn.style.visibility = 'visible';
    })

    // add listener for unhovered state to hide delete button
    proj.addEventListener('pointerleave', () => {
        delBtn.style.visibility = 'hidden';
    })

    // add listener for clicked to render its todos
    titleBtn.addEventListener('click', projectClicked);

    projects.appendChild(proj);
}

function createProject() {
    const projInput = document.querySelector('div.new-project');
    if (projInput.innerHTML === '') {

        projInput.style.visibility = 'visible';
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = 'Enter name';
        projInput.appendChild(inp);
    
        inp.addEventListener('focus', event => {
    
            window.addEventListener('keydown', e => {
                const content = event.target.value;
        
                if (e.key === 'Enter' && content !== '') {
                    // add title to the projects list.
                    // initialize the todos[title] list
                    addProject(content.toLowerCase());
                    
                    // add it to the DOM
                    addProjectToDOM(content.toLowerCase());
        
                    event.target.value = '';
                    event.target.blur();
                    projInput.innerHTML = '';
                    projInput.style.visibility = 'hidden';
                }
                else if (e.key === 'Escape') {
                    event.target.value = '';
                    event.target.blur();
                    projInput.innerHTML = '';
                    projInput.style.visibility = 'hidden';
                }
            })
        });

        inp.focus();
    }
}

// load projects
window.addEventListener('DOMContentLoaded', () => {
    
    for(let i = 0; i < titles.length; i += 1)
        addProjectToDOM(titles[i]);
    
});

// load todos in a project
for(let index = 0; index < todos.length; index += 1) {
    addTodoToDOM(todos[index], index);
}

// add listener to all-todos btn
const allTodoBtn = document.querySelector('button.all-todos');
allTodoBtn.addEventListener('click', displayAllTodosCreated);

// add listener to cancel btn
cancelDialogBtn.addEventListener('click', e => {
    e.preventDefault();
    const {todoIndex} = dialog.dataset;
    todos[todoIndex].setNote(note.value);
    todos[todoIndex].setDescription(description.value);
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