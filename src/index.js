import {createToDo, displayToDos} from "./personal";
import './style.sass';

createToDo('do the laundary', 'tomorrow', 'high');
createToDo('pray your selat', 'tomorrow', 'high');
createToDo('do exercise', 'tomorrow', 'high');
createToDo('create some notes', 'tomorrow', 'high');

const todos = displayToDos();

const divList = document.querySelector('div.list');

function render() {

    todos.forEach(td => {
        const p = document.createElement('p');
        p.textContent = td.getDescription();
        divList.appendChild(p);
    });
}

render();

const input = document.querySelector('input');

// add input listener and render a new todo to the DOM
input.addEventListener('focus', event => {
    window.addEventListener('keydown', e => {
        if (e.code === 'Enter' && event.target.value !== '') {
            // create node for the DOM
            const td = document.createElement('p');
            td.textContent = event.target.value;

            // Creare an onject and append it to the array
            createToDo('personal', event.target.value, 'tomorrow', 'medium');

            event.target.value = '';
            event.target.blur();

            divList.appendChild(td);
        }
    })
});