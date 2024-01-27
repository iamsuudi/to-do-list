import {displayProjectToDos} from "./project";
import Input from './inputDiv';
import './styles/_aside.sass';
import './styles/_main-todo-list.sass';

export default class Category {

    project;

    todos;

    title;

    priority;

    index;

    board;

    #dialog = document.querySelector('dialog.detail');

    #main = document.querySelector('main');

    constructor(project, title, priority, board) {

        this.project = project;
        console.log(this.title);
        this.title = title;
        console.log(this.title);
        this.priority = priority;
        this.board = board;

        this.currentCategorySwitcher();

        // clean the board for new todos
        this.board.innerHTML = '';

        // display todos of the category on the board
        this.displaySpecificProjectTodos();

        // display input div if needed
        this.divInputController();
    }

    currentCategorySwitcher() {

        const currentCategory = document.querySelector('button.current-category');

        if (currentCategory)
            currentCategory.classList.remove('current-category');

        this.project.classList.add('current-category');
    }

    checkClicked(event) {

        // a function which responds to todo done checker

        const todo = event.target.parentElement;
        const checkerBtn = event.target;
        const todoNameBtn = todo.querySelector('button.description');

        if (this.todos[this.index].getStatus() === 'done') {
            // undo the task
            todoNameBtn.dataset.status = 'pending';
            checkerBtn.dataset.status = 'pending';
            this.todos[this.index].setStatus('pending');
        }
        else {
            // do the task
            todoNameBtn.dataset.status = 'done';
            checkerBtn.dataset.status = 'done';
            this.todos[this.index].setStatus('done');
        }
    }

    todoClicked(event) {

        const todo = event.target;

        todo.classList.add('clicked-todo');

        this.index = todo.dataset.todoIndex;

        import (/* webpackPrefetch: true */ './dialog').then(module => {

            const Dialog = module.default;
        
            // created dialog Obj
            const dialogPanel = new Dialog(this.#dialog, this.todos, this.title, this.index, this.priority, todo);

        });
    }

    addTodoToDOM(todo, index) {

        // create todo div node
        const todoNode = document.createElement('div');
        todoNode.className = 'todo';
    
        // create todo status checker button
        const btn = document.createElement('button');
        btn.className = 'status-checker';
        btn.addEventListener('click', this.checkClicked);   // change appearance when clicked
        btn.dataset.status = todo.getStatus();
        todoNode.appendChild(btn);
    
        // create todo name button
        const button = document.createElement('button');
        button.textContent = todo.getDescription();
        button.className = 'description';
        button.dataset.todoIndex = index;
        button.dataset.todoTitle = todo.getTitle();
        button.dataset.status = todo.getStatus();
        button.addEventListener('click', this.todoClicked);  // open detail when clicked
        todoNode.appendChild(button);


        const number = this.board.children.length;
        todoNode.style.animationDuration = `${number*10 + 500}ms`;
        todoNode.style.animationDelay = `${number*10}ms`;
    
        this.board.appendChild(todoNode);
        this.board.scrollTo(0, this.board.scrollHeight);
    
    }
    
    displaySpecificProjectTodos() {

        this.todos = displayProjectToDos(this.title);
    
        if (this.priority !== 'all-priority') {
            for(let index = 0; index < this.todos.length; index += 1) {
                if (this.todos[index].getPriority() === this.priority)
                    this.addTodoToDOM(this.todos[index], index);
            }
        }
        else {
            for(let index = 0; index < this.todos.length; index += 1) {
                this.addTodoToDOM(this.todos[index], index);
            }
        }
    }

    divInputController() {

        // check input-div availablity and remove or leave it as needed
        if (this.#main.querySelector('div.input') && this.title === 'all-todos')
            this.#main.querySelector('div.input').remove();
    
        else if (!this.#main.querySelector('div.input') && this.title !== 'all-todos') {
            
            // created dialog Obj (main, board, title, todos)
            const inputDiv = new Input(this.#main, this.board, this.title, this.todos);

        }
    }
    
}