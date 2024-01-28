import {add} from 'date-fns';
import {createToDo, displayProjectToDos} from "./project";

export default class Input {

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

        import(/* webpackPrefetch: true */ './NewTodo').then(module => {

            const NewTodo = module.default;

            // created dialog Obj (board, todo, title, index, priority)
            const newtodo = new NewTodo(this.board, this.todos[index - 1], this.title, index - 1, this.priority);
        });

        input.value = '';
        // input.focus();

    }
}