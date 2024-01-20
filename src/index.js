import {createToDo, displayAllToDos, displayProjectToDos, addProject, getProjectTitles, deleteProject, deleteTodo} from "./project";
import './styles/style.sass';

let titleOfProject = 'all-todos';

const projects = document.querySelector('div.projects');
let todos = displayProjectToDos(titleOfProject);
const titles = getProjectTitles();
const divList = document.querySelector('div.list');
const dialog = document.querySelector('dialog');
const description = document.querySelector('input.todo-description');
const note = document.querySelector('textarea#note');
const cancelDialogBtn = document.querySelector('dialog button.cancel');
const deleteTodoBtn = document.querySelector('dialog button.delete');
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
    dialog.dataset.todoIndex = todoIndex;
    todo.classList.add('clicked');

    const spanTitle = dialog.querySelector('span.title');
    spanTitle.textContent = event.target.dataset.todoTitle;
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

}

function fixTodoIndices(initialIndex) {  // after one is deleted
    const allTodoBtns = document.querySelectorAll(`div.list button[data-todo-index]`);

    allTodoBtns.forEach(btn => {
        console.log(btn.dataset.todoIndex);
        if(Number(btn.dataset.todoIndex) >= Number(initialIndex))
            btn.dataset.todoIndex -= 1;
    });
}

function deleteTodoFromDOM(event) {
    const clickedTodo = document.querySelector('button.clicked');
    const {todoTitle} = clickedTodo.dataset;
    const {todoIndex} = clickedTodo.dataset;

    // delete the todo object from array
    deleteTodo(todoTitle, todoIndex, divList.classList[1]);

    // close the dialog
    dialog.close();
    
    // delete the todo from the DOM
    clickedTodo.parentElement.remove();

    // fix the data-index of the following todo-items
    fixTodoIndices(todoIndex);
}

// a function which responds when project button clicked
function projectClicked(event) {
    const currentProject = document.querySelector('button.current-project');
    currentProject.classList.remove('current-project');
    
    divList.className = 'list';

    const proj = event.target;

    titleOfProject = proj.className;
    proj.classList.add('current-project');
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

function displayAllTodosCreated(event) {
    const currentProject = document.querySelector('button.current-project');
    currentProject.classList.remove('current-project');
    event.target.classList.add('current-project');
    
    divList.className = 'list';
    divList.classList.add('all-todos');
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

        /*  if the current project being deleted is the last project,
            make the first project the next one 
        */
        if (indexOfProject === titles.length)
            todos = displayProjectToDos(titles[0]);
        else
            todos = displayProjectToDos(titles[indexOfProject]);

        // load todos in the next project
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
    if(title.toLowerCase() === titleOfProject) {
        titleBtn.classList.add('current-project');
    }
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

// load todos in thedefault project
divList.classList.add(titleOfProject);
for(let index = 0; index < todos.length; index += 1) {
    addTodoToDOM(todos[index], index);
}

// add listener to the btn which displays all todos
const allTodoBtn = document.querySelector('button.all-todos');
allTodoBtn.addEventListener('click', displayAllTodosCreated);

// add listener to cancel btn
cancelDialogBtn.addEventListener('click', e => {
    e.preventDefault();
    const {todoIndex} = dialog.dataset;
    todos[todoIndex].setNote(note.value);
    todos[todoIndex].setDescription(description.value);
    dialog.close();

    const clickedTodo = document.querySelector('button.clicked');
    clickedTodo.textContent = description.value;
    clickedTodo.classList.remove('clicked');
});

// add listener to delete btn of todos
deleteTodoBtn.addEventListener('click', deleteTodoFromDOM);

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
const addProjectBtn = document.querySelector('div.projects-top button.small');
// addProjectBtn.style.visibility = 'visible';
addProjectBtn.addEventListener('click', createProject);