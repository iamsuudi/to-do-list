import {add} from 'date-fns';
import {createToDo, displayProjectToDos} from "./project";

export default class Input {

    main;

    board;

    title;

    todos;

    content;

    dialog = document.querySelector('dialog.detail');

    constructor(main, board, title, todos) {
        this.main = main;
        this.board = board;
        this.title = title;
        this.todos = todos;

        const div = document.createElement('div');
        div.className = 'input';

        const input = document.createElement('input');
        input.type = "text";
        input.name = "todo-name";
        input.id = "todo-name";
        input.placeholder = "+   Add task";

        const AddBtn = document.createElement('button');
        AddBtn.className = 'submit';
        AddBtn.textContent = 'Add';

        this.board.style.height = '90%';

        div.appendChild(input);
        div.appendChild(AddBtn);
        
        this.main.appendChild(div);

        this.listenToInput();
        this.listenToAddBtn();
    }

    listenToInput() {
        const  input = this.main.querySelector('div.input input');
        const  AddBtn = this.main.querySelector('div.input button.submit');

        // add input listener and render a new todo to the DOM
        input.addEventListener('input', (event) => {

            this.content = event.target.value;

            if (this.content !== '') {
                console.log('not empty');
                AddBtn.classList.add('add');
                input.style.outlineColor = '#0084ffc9';
            }
            else {
                console.log('empty');
                AddBtn.classList.remove('add');
                input.style.outlineColor = '#8e8e92';
            }
        });
    }

    listenToAddBtn() {
        const  input = this.main.querySelector('div.input input');
        const  AddBtn = this.main.querySelector('div.input button.submit');

        AddBtn.addEventListener('click', () => {
    
            if (this.content !== '')
                this.createNewTodo(input);

        });
    }

    createNewTodo(input) {

        // Create a todo object, append it to the array and take the returned the new length value
        const index = createToDo(this.title, this.content, add(new Date(), {days: 7, hours: 8, minutes: 30}), 'medium');
        
        // update todos list 
        this.todos = displayProjectToDos(this.title);

        // create node for the todo
        this.addTodoToDOM(this.todos[index - 1], index - 1);

        input.value = '';
        input.focus();

    }

    checkClicked(event) {

        // a function which responds to todo done checker

        const todo = event.target.parentElement;
        const checkerBtn = event.target;
        const todoNameBtn = todo.querySelector('button.description');
        const index = todoNameBtn.dataset.todoIndex;

        if (this.todos[index].getStatus() === 'done') {
            // undo the task
            todoNameBtn.dataset.status = 'pending';
            checkerBtn.dataset.status = 'pending';
            this.todos[index].setStatus('pending');
        }
        else {
            // do the task
            todoNameBtn.dataset.status = 'done';
            checkerBtn.dataset.status = 'done';
            this.todos[index].setStatus('done');
        }
    }

    todoClicked(event) {

        const todo = event.target;

        todo.classList.add('clicked-todo');

        this.index = todo.dataset.todoIndex;

        import (/* webpackPrefetch: true */ './dialog').then(module => {

            const Dialog = module.default;
        
            // created dialog Obj
            const dialogPanel = new Dialog(this.dialog, this.todos, this.title, this.index, this.priority, todo);

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
}