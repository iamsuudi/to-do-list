import {addProject, getProjectTitles, deleteProject} from "./project";
import './styles/style.sass';

let titleOfProject = 'all-todos';
let currentPriority = 'all-priority';

const titles = getProjectTitles();

const projects = document.querySelector('div.projects');
const allTodoBtn = document.querySelector('button.all-todos');
const divList = document.querySelector('div.list');

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

    import (/* webpackPrefetch: true */ './category').then(module => {

        const Category = module.default;
    
        // created new Category obj
        const newCategory = new Category(event.target, titleOfProject, currentPriority, divList);

    });
}

function displayDefaultCategoryTodos(category) {
        
    // update currentTitle and currentPriority
    UpdateCurrentTitleAndPriority(category);

    import (/* webpackPrefetch: true */ './category').then(module => {

        const Category = module.default;
    
        // created new Category obj
        const newCategory = new Category(category, titleOfProject, currentPriority, divList);

    });
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

        if (titles.length === 0) {
            // if it is the only project avialable
            titleOfProject = 'all-todos';
            displayDefaultCategoryTodos(allTodoBtn);
        }
        else if (indexOfProject === titles.length) {
            // if it is the last of the available projects
            const nextCategory = projects.querySelector(`button.${titles[0]}`);
            displayDefaultCategoryTodos(nextCategory);
        }
        else {
            // if it is from the middle
            const nextCategory = projects.querySelector(`button.${titles[indexOfProject]}`);
            displayDefaultCategoryTodos(nextCategory);
        }
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

function addListenerToCategoryBtns(category) {

    // add listener to the btn which displays all todos
    category.addEventListener('click', categoryClicked);
    
    // add listener to priority buttons
    const priorityBtns = document.querySelectorAll('aside div.priorities button');
    priorityBtns.forEach(btn => btn.addEventListener('click', categoryClicked));

    return Promise.resolve(category);
}

function displayProjects(category) {

    for(let i = 0; i < titles.length; i += 1)
        addProjectToDOM(titles[i]);

    return Promise.resolve(category);
}

const loadSyncedProjects = new Promise((resolve, reject) => {

    window.addEventListener('DOMContentLoaded', () => {
        resolve(allTodoBtn);
    });
})

loadSyncedProjects.then(displayProjects).then(addListenerToCategoryBtns).then(displayDefaultCategoryTodos).catch(err => {
    console.log(err);
});

// add listener to projects header button for creating new category/project
const addProjectBtn = document.querySelector('div.projects-top button.small');
addProjectBtn.addEventListener('click', createProject);