import {createToDo, displayToDos} from "./home";
import './style.sass';

createToDo('personal', 'do the laundary', 'tomorrow', 'high');
createToDo('personal', 'pray your selat', 'tomorrow', 'high');
createToDo('personal', 'do exercise', 'tomorrow', 'high');
createToDo('personal', 'create some notes', 'tomorrow', 'high');

const todos = displayToDos();

function render() {
    const divList = document.querySelector('div.list');

    todos.forEach(td => {
        const p = document.createElement('p');
        p.textContent = td.getDescription();
        divList.appendChild(p);
    });
}

render();