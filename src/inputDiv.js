import {add} from 'date-fns';
import {createToDo, displayProjectToDos} from "./project";

export default class Input {

    main;

    board;

    title;

    todos;

    content;

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

        this.board.style.height = '90%';

        // add input listener and render a new todo to the DOM
        input.addEventListener('focus', this.newTodoInputListener);

        div.appendChild(input);
        
        this.main.appendChild(div);
    }

    newTodoInputListener(event) {

        this.content = event.target.value;

        window.addEventListener('keydown', this.createNewTodo);
    }

    createNewTodo(event) {
        
        if (event.code === 'Enter' && this.content !== '') {
            console.log('creating new todo');
            
            // Create a todo object, append it to the array and take the returned the new length value
            const index = createToDo(this.title, this.content, add(new Date(), {days: 7, hours: 8, minutes: 30}), 'medium');
            console.log('created new todo');
            // update todos list 
            this.todos = displayProjectToDos(this.title);

            // create node for the todo
            this.addTodoToDOM(this.todos[index], index - 1);
            console.log('added new todo to DOM');

            document.querySelector('div.input input').value = '';
            // event.target.blur();
        }
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