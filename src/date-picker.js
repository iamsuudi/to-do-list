import {formatDistanceToNow, format} from 'date-fns';

export default class DatePicker {

    #div;

    #todos;

    #index;

    constructor(div, todos, index) {
        this.#div = div;
        this.#todos = todos;
        this.#index = index;

        this.display();
    }

    display() {
        this.#div.classList.add('visible');
    }

    renderData(parag, dateInp, timeInp) {
  
        // Show the formatted time left for the todo
        parag.textContent = formatDistanceToNow(this.#todos[this.#index].getDueDate()).concat(' left');
        
        // get dueDate info from the clicked todo object and extract date from it for input-date
        dateInp.value = format(this.#todos[this.#index].getDueDate(), 'yyyy-MM-dd');
        
        // set minimum date as today in case the user wanted to update dueDate
        dateInp.min = format(new Date(), 'yyyy-MM-dd');

        // get dueDate info from the clicked todo object and extract time from it for input-time
        timeInp.value = format(this.#todos[this.#index].getDueDate(), 'hh:mm');
        
    }

    listenToCancelBtn(cancelBtn) {
        
        cancelBtn.addEventListener('click', () => {
            setTimeout(() => {
                this.#div.classList.remove('visible');
            }, 250);
            delete this;
        });
    }

    extractDate(dateInp) {

        const dateArray = dateInp.value.split('-');

        dateArray[1] = Number(dateArray[1])-1;

        return dateArray;
    }

    extractTime(timeInp) {
        return timeInp.value.split(':');
    }

    listenToSetBtn(setBtn, dateInp, timeInp) {
        
        setBtn.addEventListener('click', () => {

            // get date
            const date = this.extractDate(dateInp);

            // get time
            const time = this.extractTime(timeInp);

            // sync the change
            this.#todos[this.#index].setDueDate(new Date(...date, ...time));

            // cancel the div panel
            setTimeout(() => {
                this.#div.classList.remove('visible');
            }, 250);
        });
    }
}