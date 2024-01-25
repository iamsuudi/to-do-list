import {add, formatDistanceToNow, format} from 'date-fns';
import {createToDo, displayProjectToDos, addProject, getProjectTitles, deleteProject, deleteTodo} from "./project";
import './styles/style.sass';

let titleOfProject = 'all-todos';
let currentPriority = 'all-priority';

const projects = document.querySelector('div.projects');
let todos = displayProjectToDos(titleOfProject);
const titles = getProjectTitles();
const allTodoBtn = document.querySelector('button.all-todos');
const divList = document.querySelector('div.list');
const dialog = document.querySelector('dialog.detail');
const cancelDialogBtn = document.querySelector('dialog button.cancel');
const deleteTodoBtn = document.querySelector('dialog button.delete');
const main = document.querySelector('main');

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
    }
    else {
        // do the task
        todoNameBtn.dataset.status = 'done';
        checkerBtn.dataset.status = 'done';
        todos[todoIndex].setStatus('done');
    }
}

function todoClicked(event) {
    event.preventDefault();

    const description = document.querySelector('input.todo-description');
    const note = document.querySelector('textarea#note');
    
    const todo = event.target;
    const {todoIndex} = todo.dataset;
    description.value = todos[todoIndex].getDescription();
    note.value = todos[todoIndex].getNote();
    dialog.showModal();
    dialog.dataset.todoIndex = todoIndex;
    todo.classList.add('clicked-todo');

    description.addEventListener('input', e => {
        todos[todoIndex].setDescription(e.target.value);
    })
    note.addEventListener('input', e => {
        todos[todoIndex].setNote(e.target.value);
    })

    const divPriorities = document.querySelector('dialog div.priorities');
    divPriorities.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.classList[0] === todos[todoIndex].getPriority())
            btn.classList.add('selected');
    });

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
    const number = divList.children.length;
    todoNode.style.animationDuration = `${number*10 + 500}ms`;
    todoNode.style.animationDelay = `${number*10}ms`;

    divList.appendChild(todoNode);
    divList.scrollTo(0, divList.scrollHeight);

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
    const clickedTodo = document.querySelector('button.clicked-todo');
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

function changePriority(event) {
    const clickedTodo = document.querySelector('button.clicked');
    const {todoIndex} = clickedTodo.dataset;

    const divPriorities = document.querySelector('dialog div.priorities');
    
    function priority(e) {
        if (e.target.className === 'cancel')
            setTimeout(() => {
                divPriorities.classList.remove('visible');
            }, 200);
        else {
            const currentSelctedPriority = divPriorities.querySelector('button.selected');

            if (currentSelctedPriority)
                currentSelctedPriority.classList.remove('selected');

            todos[todoIndex].setPriority(e.target.className);

            e.target.classList.add('selected');

            if (divList.classList[1] && divList.classList[1] !== todos[todoIndex].getPriority())
                clickedTodo.parentElement.remove();
        }
    }

    divPriorities.classList.add('visible');

    divPriorities.querySelectorAll('button').forEach(btn => btn.addEventListener('click', priority));
}

function newTodoInputListener(event) {

    window.addEventListener('keydown', e => {

        const content = event.target.value;

        if (e.code === 'Enter' && content !== '') {
            // Creare a todo object, append it to the array and return the new length
            const index = createToDo(titleOfProject, content, add(new Date(), {days: 7, hours: 8, minutes: 30}), 'medium') - 1;

            todos = displayProjectToDos(titleOfProject);
            // create node for the todo
            addTodoToDOM(todos[index], index);

            event.target.value = '';
            // event.target.blur();
        }
    })
}

function divInputController(title) {

    if (main.querySelector('div.input') && title === 'all-todos')
        main.querySelector('div.input').remove();

    else if (!main.querySelector('div.input') && title !== 'all-todos') {

        const div = document.createElement('div');
        div.className = 'input';

        const input = document.createElement('input');
        input.type = "text";
        input.name = "todo-name";
        input.id = "todo-name";
        input.placeholder = "+   Add task";

        divList.style.height = '90%';

        // add input listener and render a new todo to the DOM
        input.addEventListener('focus', newTodoInputListener);

        div.appendChild(input);
        
        main.appendChild(div);
    }
}

function currentCategorySwitcher(category) {

    const currentCategory = document.querySelector('button.current-category');

    if (currentCategory)
        currentCategory.classList.remove('current-category');

    category.classList.add('current-category');
}

function UpdateCurrentTitleAndPriority(category) {

    if(category.classList.length >= 2)
        [titleOfProject, currentPriority] = category.classList;
    else {
        [titleOfProject] = category.classList;
        currentPriority = 'all-priority';
    }
}

// a function which responds when project button clicked
function categoryClicked(event) {
    
    // update currentTitle and currentPriority
    UpdateCurrentTitleAndPriority(event.target);

    // Switch current-category className to this project
    currentCategorySwitcher(event.target);
    
    // clean board for todos
    divList.innerHTML = '';

    // display todos in of the project on the board
    displaySpecificProjectTodos(titleOfProject);

    // display input div if needed
    divInputController(titleOfProject);
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
        if (titles.length === 0) {
            titleOfProject = 'all-todos';
            currentCategorySwitcher(allTodoBtn);
            displaySpecificProjectTodos(titleOfProject);
            divInputController(titleOfProject);
        }
        else if (indexOfProject === titles.length)
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

    // add listener for clicked project to render its todos
    titleBtn.addEventListener('click', categoryClicked);

    projects.appendChild(proj);
}

function createProject() {

    const projInput = document.querySelector('div.new-project');

    if (projInput.innerHTML === '') {

        projInput.style.visibility = 'visible';
        projInput.classList.add('creating-newproject');

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
                    
                    inp.value = '';
                    projInput.innerHTML = '';
                    projInput.style.visibility = 'hidden';
                    projInput.classList.remove('creating-newproject');
                }
                else if (e.key === 'Escape') {
                    
                    projInput.innerHTML = '';
                    projInput.style.visibility = 'hidden';
                    projInput.classList.remove('creating-newproject');
                }
            })
        });
        
        inp.addEventListener('blur', () => {
            inp.value = '';
            projInput.innerHTML = '';
            projInput.style.visibility = 'hidden';
            projInput.classList.remove('creating-newproject');
        })
        
        inp.focus();

    }
}

function datePicker(event) {
    const clickedTodo = document.querySelector('button.clicked');
    const {todoIndex} = clickedTodo.dataset;

    const divDatePicker = document.querySelector('div.date-picker');

    const formatted = divDatePicker.querySelector('p.formatted');

    const dateInp = divDatePicker.querySelector('input#date');
    const timeInp = divDatePicker.querySelector('input#time');

    const cancelBtn = divDatePicker.querySelector('button.cancel');
    const setBtn = divDatePicker.querySelector('button.set');

    // Make the div visible
    divDatePicker.classList.add('visible');
    
    // Show the formatted time left for the todo
    formatted.textContent = formatDistanceToNow(todos[todoIndex].getDueDate()).concat(' left');
    
    // get dueDate info from the clicked todo object and extract date from it for input-date
    dateInp.value = format(todos[todoIndex].getDueDate(), 'yyyy-MM-dd');
    
    // get dueDate info from the clicked todo object and extract time from it for input-time
    timeInp.value = format(todos[todoIndex].getDueDate(), 'hh:mm');
    
    // set minimum date as today in case the user wanted to update dueDate
    dateInp.min = format(new Date(), 'yyyy-MM-dd');

    // add listener to cancel-button
    cancelBtn.addEventListener('click', () => {
        setTimeout(() => {
            divDatePicker.classList.remove('visible');
        }, 250);
    });

    // Add listner to set-button
    setBtn.addEventListener('click', () => {
        const dateArray = dateInp.value.split('-');
        dateArray[1] = Number(dateArray[1])-1;

        const timeArray = timeInp.value.split(':');

        todos[todoIndex].setDueDate(new Date(...dateArray, ...timeArray));

        setTimeout(() => {
            divDatePicker.classList.remove('visible');
        }, 250);
    });
}

const displaySpecificProjectTodos = (title) => {

    todos = displayProjectToDos(title);

    if (currentPriority !== 'all-priority') {
        for(let index = 0; index < todos.length; index += 1) {
            if (todos[index].getPriority() === currentPriority)
                addTodoToDOM(todos[index], index);
        }
    }
    else {
        for(let index = 0; index < todos.length; index += 1) {
            addTodoToDOM(todos[index], index);
        }
    }
}

function displayProjects(title) {

    for(let i = 0; i < titles.length; i += 1)
        addProjectToDOM(titles[i]);

    return Promise.resolve(title);
}

const loadSyncedProjects = new Promise((resolve, reject) => {

    window.addEventListener('DOMContentLoaded', () => {
        resolve(titleOfProject);
    });
})

function addListenerToCategoryBtns() {

    // add listener to the btn which displays all todos
    allTodoBtn.addEventListener('click', categoryClicked);
    
    // add listener to priority buttons
    const priorityBtns = document.querySelectorAll('aside div.priorities button');
    priorityBtns.forEach(btn => btn.addEventListener('click', categoryClicked));

    return Promise.resolve(titleOfProject);
}

loadSyncedProjects.then(displayProjects).then(addListenerToCategoryBtns).then(displaySpecificProjectTodos).catch(err => {
    console.log(err);
});

// add listener to cancel btn to detail dialog
cancelDialogBtn.addEventListener('click', e => {
    e.preventDefault();
    dialog.close();
    const description = document.querySelector('dialog input.todo-description');
    const clickedTodo = document.querySelector('button.clicked');
    if (clickedTodo) {
        clickedTodo.classList.remove('clicked');
        clickedTodo.textContent = description.value;
    }

    const divPriorities = document.querySelector('dialog div.priorities');
    divPriorities.classList.remove('visible');

    const divDatePicker = document.querySelector('div.date-picker');
    divDatePicker.classList.remove('visible');
});

// add listener to delete btn of todos
deleteTodoBtn.addEventListener('click', deleteTodoFromDOM);

// add listener to projects header button for creating new category/project
const addProjectBtn = document.querySelector('div.projects-top button.small');
addProjectBtn.addEventListener('click', createProject);

// add listener to changing-priority button
const changePriorityBtn = document.querySelector('button.change-priority');
changePriorityBtn.addEventListener('click', changePriority);

// add listener to date picker
const remindmeBtn = document.querySelector('button.remindme');
remindmeBtn.addEventListener('click', datePicker);