import {deleteTodo} from "./project";

export default class Dialog {

    todos;

    title;

    index;

    priority;

    clickedTodo;

    dialog = document.querySelector('dialog.detail');

    divPriorities = document.querySelector('dialog div.priorities');

    divDatePicker = document.querySelector('div.date-picker');

    constructor(todos, title, index, priority, clickedTodo) {

        this.todos = todos;
        this.title = title;
        this.index = index;
        this.priority = priority;
        this.clickedTodo = clickedTodo;


        // update the title on dialog header
        const spanTitle = this.dialog.querySelector('span.title');
        spanTitle.textContent = this.clickedTodo.dataset.todoTitle;

        // display Description and Note of the todo
        this.renderDescriptionAndNote();
        
        this.dialog.showModal();

        // add listener to date picker
        const remindmeBtn = document.querySelector('button.remindme');
        remindmeBtn.addEventListener('click', () => {
            this.displayDatePicker();
        });


        // add listener to changing-priority button
        const changePriorityBtn = document.querySelector('button.change-priority');
        changePriorityBtn.addEventListener('click', () => {
            this.displaypriorityPanel();
        });


        // add listener to delete button of todos
        const deleteTodoBtn = document.querySelector('dialog button.delete');
        deleteTodoBtn.addEventListener('click', () => {
            this.deleteTodoClicked();
        });


        // add listener to cancel button of dialog
        const cancelDialogBtn = document.querySelector('dialog button.cancel');
        cancelDialogBtn.addEventListener('click', () => {
            this.cancelDialogClicked();
        });
    }

    renderDescriptionAndNote() {

        const description = this.dialog.querySelector('input.todo-description');
        const note = this.dialog.querySelector('textarea#note');

        description.value = this.todos[this.index].getDescription();
        note.value = this.todos[this.index].getNote();
    
        // update and sync description and note dynamically on change
        this.SyncDescriptionAndNoteDynamically(description, note);
    }

    SyncDescriptionAndNoteDynamically(description, note) {

        // listen to change and update dynamically
        description.addEventListener('input', e => {
    
            // sync to the todo object
            this.todos[this.index].setDescription(e.target.value);
    
            // sync to the todo DOM
            this.clickedTodo.textContent = e.target.value;
        })
        note.addEventListener('input', e => {
            this.todos[this.index].setNote(e.target.value);
        })
    }
    
    displayDatePicker() {

        import (/* webpackPrefetch: true */ './date-picker').then(module => {

            const DatePicker = module.default;
        
            // created datePicker Obj
            const datePicker = new DatePicker(this.divDatePicker, this.todos, this.index);

        });
    }

    displaypriorityPanel() {

        import (/* webpackPrefetch: true */ './priority-picker').then(module => {

            const Priority = module.default;
        
            // create priority panel Obj (todos, index, priority, clickedTodo)
            const datePicker = new Priority(this.todos, this.index, this.priority, this.clickedTodo);

        });
    }

    deleteTodoClicked() {
    
        const {todoTitle} = this.clickedTodo.dataset;
    
        // delete the todo object from array
        deleteTodo(todoTitle, this.index, this.title);
    
        // close the dialog
        this.panel.close();
        
        // delete the todo from the DOM
        this.clickedTodo.parentElement.remove();
    
        // fix the data-index of the following todo-items
        this.fixTodoIndices();
    }

    fixTodoIndices() {

        const allTodoBtns = document.querySelectorAll(`div.list button[data-todo-index]`);
    
        allTodoBtns.forEach(btn => {
            console.log(btn.dataset.todoIndex);
            if(Number(btn.dataset.todoIndex) >= Number(this.index))
                btn.dataset.todoIndex -= 1;
        });
    }

    cancelDialogClicked()  {
    
        this.dialog.close();
    
        // close priority changing panel if not closed
        this.divPriorities.classList.remove('visible');

        // close date-picker panel
        this.divDatePicker.classList.remove('visible');
    }
     
}