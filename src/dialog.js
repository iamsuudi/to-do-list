import {deleteTodo} from "./project";
import './styles/_detail-panel.sass';

export default class Dialog {

    #panel;

    #todos;

    #title;

    #index;

    #priority;

    #clickedTodo;

    #divPriorities = document.querySelector('dialog div.priorities');

    #divDatePicker = document.querySelector('div.date-picker');

    constructor(panel, todos, title, index, priority, clickedTodo) {

        this.#panel = panel;
        this.#todos = todos;
        this.#title = title;
        this.#index = index;
        this.#priority = priority;
        this.#clickedTodo = clickedTodo;


        // update the title on dialog header
        const spanTitle = this.Panel.querySelector('span.title');
        spanTitle.textContent = this.#clickedTodo.dataset.todoTitle;

        // display Description and Note of the todo
        this.renderDescriptionAndNote();
        
        this.#panel.showModal();

        // add listener to date picker
        const remindmeBtn = document.querySelector('button.remindme');
        remindmeBtn.addEventListener('click', this.displayDatePicker);


        // add listener to changing-priority button
        const changePriorityBtn = document.querySelector('button.change-priority');
        changePriorityBtn.addEventListener('click', this.displaypriorityPanel);


        // add listener to delete button of todos
        const deleteTodoBtn = document.querySelector('dialog button.delete');
        deleteTodoBtn.addEventListener('click', this.deleteTodoClicked);


        // add listener to cancel button of dialog
        const cancelDialogBtn = document.querySelector('dialog button.cancel');
        cancelDialogBtn.addEventListener('click', this.cancelDialogClicked);
    }

    renderDescriptionAndNote() {

        const description = document.querySelector('input.todo-description');
        const note = document.querySelector('textarea#note');
    
        description.value = this.#todos[this.#index].getDescription();
        note.value = this.#todos[this.#index].getNote();
    
        // update and sync description and note dynamically on change
        this.SyncDescriptionAndNoteDynamically(description, note);
    }

    SyncDescriptionAndNoteDynamically(description, note) {

        // listen to change and update dynamically
        description.addEventListener('input', e => {
    
            // sync to the todo object
            this.#todos[this.#index].setDescription(e.target.value);
    
            // sync to the todo DOM
            this.#clickedTodo.textContent = e.target.value;
        })
        note.addEventListener('input', e => {
            this.#todos[this.#index].setNote(e.target.value);
        })
    }
    
    displayDatePicker() {

        const formatted = this.#divDatePicker.querySelector('p.formatted');
        const dateInp = this.#divDatePicker.querySelector('input#date');
        const timeInp = this.#divDatePicker.querySelector('input#time');
        
        const cancelBtn = this.#divDatePicker.querySelector('button.cancel');
        const setBtn = this.#divDatePicker.querySelector('button.set');

        import (/* webpackPrefetch: true */ './date-picker').then(module => {
            const DatePicker = module.default;
        
            // created datePicker Obj
            const datePicker = new DatePicker(this.#divDatePicker, this.#todos, this.#index);
            
            datePicker.renderData(formatted, dateInp, timeInp);
        
            datePicker.listenToCancelBtn(cancelBtn);
        
            datePicker.listenToSetBtn(setBtn, dateInp, timeInp);
        });
    }

    displaypriorityPanel() {
    
        function changePriorityClicked(e) {

            if (e.target.className === 'cancel')
                setTimeout(() => {
                    this.#divPriorities.classList.remove('visible');
                }, 200);
            else {
                const currentSelctedPriority = this.#divPriorities.querySelector('button.selected');
    
                if (currentSelctedPriority)
                    currentSelctedPriority.classList.remove('selected');
    
                this.#todos[this.#index].setPriority(e.target.className);
    
                e.target.classList.add('selected');
    
                if (this.#priority !== 'all-todos')
                    this.#clickedTodo.parentElement.remove();
            }
        }

        this.renderCurrentTodoPriority();
    
        this.#divPriorities.classList.add('visible');
    
        this.#divPriorities.querySelectorAll('button').forEach(btn => btn.addEventListener('click', changePriorityClicked));
    }

    renderCurrentTodoPriority() {
        
        this.#divPriorities.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.classList[0] === this.#todos[this.#index].getPriority())
                btn.classList.add('selected');
        });
    }

    deleteTodoClicked() {
    
        const {todoTitle} = this.#clickedTodo.dataset;
    
        // delete the todo object from array
        deleteTodo(todoTitle, this.#index, this.#title);
    
        // close the dialog
        this.#panel.close();
        
        // delete the todo from the DOM
        this.#clickedTodo.parentElement.remove();
    
        // fix the data-index of the following todo-items
        this.fixTodoIndices();
    }

    fixTodoIndices() {

        const allTodoBtns = document.querySelectorAll(`div.list button[data-todo-index]`);
    
        allTodoBtns.forEach(btn => {
            console.log(btn.dataset.todoIndex);
            if(Number(btn.dataset.todoIndex) >= Number(this.#index))
                btn.dataset.todoIndex -= 1;
        });
    }

    cancelDialogClicked()  {
    
        this.#panel.close();
    
        // close priority changing panel if not closed
        this.#divPriorities.classList.remove('visible');

        // close date-picker panel
        this.#divDatePicker.classList.remove('visible');
    }
     
}