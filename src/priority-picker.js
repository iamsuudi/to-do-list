

export default class Priority {

    divPriorities = document.querySelector('dialog div.priorities');

    constructor(todoObj, priority, clickedTodo) {

        this.todoObj = todoObj;
        this.priority = priority;
        this.clickedTodo = clickedTodo;

        // render the current todos priority
        this.renderCurrentTodoPriority();

        // make the priority panel visible
        this.divPriorities.classList.add('visible');

        // add listener to the buttons
        this.listenToBtns();
    }

    renderCurrentTodoPriority() {

        this.divPriorities.querySelectorAll('button').forEach(btn => {

            btn.classList.remove('selected');

            if (btn.classList[0] === this.todoObj.getPriority()) {
                btn.classList.add('selected');
            }
        });
    }

    btnClicked(clickedBtn) {

        if (clickedBtn.className === 'cancel')
            setTimeout(() => {
                this.divPriorities.classList.remove('visible');
            }, 200);
        else {

            this.switchCurrentSelectedPriorityBtn(clickedBtn);

            // sync the change to the todo object
            this.todoObj.setPriority(clickedBtn.classList[0]);
            
            // remove todo if it's in a different priority category
            if (this.priority !== 'all-priority')
                this.clickedTodo.parentElement.remove();
        }
    }

    listenToBtns() {

        const allPriorityBtns = this.divPriorities.querySelectorAll('button');

        allPriorityBtns.forEach(btn => {

            btn.addEventListener('click', event => {

                this.btnClicked(event.target);

            });
        })
    }

    switchCurrentSelectedPriorityBtn(clickedBtn) {

        const currentSelctedPriority = this.divPriorities.querySelector('button.selected');

        if (currentSelctedPriority)
            currentSelctedPriority.classList.remove('selected');

        clickedBtn.classList.add('selected');
    }
}