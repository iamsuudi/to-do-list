import { displayProjectToDos } from "./project";

export default class Category {

    main = document.querySelector('main');

    constructor(project, title, priority, board) {

        this.project = project;
        this.title = title;
        this.board = board;

        this.todos = displayProjectToDos(title);

        this.currentCategorySwitcher();

        // clean the board for new todos
        this.board.innerHTML = '';
        this.board.dataset.priority = priority;

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
    
    displaySpecificProjectTodos() {

        this.todos = displayProjectToDos(this.title);

        import(/* webpackPrefetch: true */ './NewTodo').then(module => {

            const NewTodo = module.default;

            // created dialog Obj (board, todo, title, index, priority)
            let newtodo;

            if (this.priority !== 'all-priority') {
                for (let index = 0; index < this.todos.length; index += 1) {
                    if (this.todos[index].getPriority() === this.priority)
                        newtodo = new NewTodo(this.board, this.todos[index], this.title, index);
                }
            }
            else {
                for (let index = 0; index < this.todos.length; index += 1) {
                    newtodo = new NewTodo(this.board, this.todos[index], this.title, index,);
                }
            }
        });
    }

    divInputController() {

        // check input-div availablity and remove or leave it as needed
        if (this.main.querySelector('div.input') && this.title === 'all-todos')
            this.main.querySelector('div.input').remove();

        else if (!this.main.querySelector('div.input') && this.title !== 'all-todos') {

            import(/* webpackPrefetch: true */ './inputDiv').then(module => {

                const Input = module.default;

                // created input-div object
                const dialogPanel = new Input(this.main, this.board, this.title, this.todos);

            });
        }
    }

}