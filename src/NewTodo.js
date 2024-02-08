
export default class NewTodo {

    constructor(board, todo) {

        this.board = board;
        
        this.todo = todo;

        this.addTodoToDOM();
    }

    checkClicked(checkBtn) {

        // a function which responds to todo done checker
        const todo = checkBtn.parentElement;
        const checkerBtn = checkBtn;
        const todoNameBtn = todo.querySelector('button.description');

        if (this.todo.getStatus() === 'done') {
            // undo the task
            todoNameBtn.dataset.status = 'pending';
            checkerBtn.dataset.status = 'pending';
            this.todo.setStatus('pending');
        }
        else {
            // do the task
            todoNameBtn.dataset.status = 'done';
            checkerBtn.dataset.status = 'done';
            this.todo.setStatus('done');
        }
    }

    todoClicked(todoNode) {

        todoNode.classList.add('clicked-todo');

        // this.index = todoNode.dataset.todoIndex;

        import (/* webpackPrefetch: true */ './dialog').then(module => {

            const Dialog = module.default;
            
            // created dialog Obj
            const dialogPanel = new Dialog(this.todo, todoNode);

        });
    }

    addTodoToDOM() {

        // create todo div node
        const todoNode = document.createElement('div');
        todoNode.className = 'todo';
        todoNode.dataset.id = this.todo.getId();
    
        // create todo status checker button
        const btn = document.createElement('button');
        btn.className = 'status-checker';
        btn.addEventListener('click', (event) => {
            // change appearance when clicked
            this.checkClicked(event.target);
        });   
        btn.dataset.status = this.todo.getStatus();
        todoNode.appendChild(btn);
    
        // create todo name button
        const button = document.createElement('button');
        button.textContent = this.todo.getDescription();
        button.className = 'description';
        button.dataset.selectedPriority = this.todo.getTitle();
        button.dataset.status = this.todo.getStatus();
        button.addEventListener('click', (event) => {
            // open detail when clicked
            this.todoClicked(event.target);
        });
        todoNode.appendChild(button);


        const number = this.board.children.length;
        todoNode.style.animationDuration = `${number*10 + 500}ms`;
        todoNode.style.animationDelay = `${number*10}ms`;
    
        this.board.appendChild(todoNode);
        this.board.scrollTo(0, this.board.scrollHeight);
    
    }
 
}