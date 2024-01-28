import {formatDistanceToNow, format} from 'date-fns';

export default class DatePicker {

    #todoObj;

    #div;


    constructor(div, todoObj) {

        this.#div = div;
        this.#todoObj = todoObj;

        this.parag = this.#div.querySelector('p.formatted');

        this.dateInp = this.#div.querySelector('input#date');

        this.timeInp = this.#div.querySelector('input#time');
        
        this.cancelBtn = this.#div.querySelector('button.cancel');

        this.setBtn = this.#div.querySelector('button.set');

        this.display();

        this.renderData();

        this.listenToCancelBtn();

        this.listenToSetBtn();
    }

    display() {
        this.#div.classList.add('visible');
    }

    renderData() {
  
        // Show the formatted time left for the todo
        this.parag.textContent = formatDistanceToNow(this.#todoObj.getDueDate()).concat(' left');
        
        // get dueDate info from the clicked todo object and extract date from it for input-date
        this.dateInp.value = format(this.#todoObj.getDueDate(), 'yyyy-MM-dd');
        
        // set minimum date as today in case the user wanted to update dueDate
        this.dateInp.min = format(new Date(), 'yyyy-MM-dd');

        // get dueDate info from the clicked todo object and extract time from it for input-time
        this.timeInp.value = format(this.#todoObj.getDueDate(), 'hh:mm');
        
    }

    listenToCancelBtn() {
        
        this.cancelBtn.addEventListener('click', () => {
            setTimeout(() => {
                this.#div.classList.remove('visible');
            }, 250);
            delete this;
        });
    }

    extractDate() {

        const dateArray = this.dateInp.value.split('-');

        dateArray[1] = Number(dateArray[1])-1;

        return dateArray;
    }

    extractTime() {
        return this.timeInp.value.split(':');
    }

    listenToSetBtn() {
        
        this.setBtn.addEventListener('click', () => {

            // get date
            const date = this.extractDate();

            // get time
            const time = this.extractTime();

            // sync the change
            this.#todoObj.setDueDate(new Date(...date, ...time));

            // cancel the div panel
            setTimeout(() => {
                this.#div.classList.remove('visible');
            }, 250);
        });
    }
}