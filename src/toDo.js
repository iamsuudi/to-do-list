
export default class ToDo {

    #title;

    #description;

    #dueDate;

    #priority;

    constructor(title, description, dueDate, priority) {
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
    }

    getTitle = () => this.#title;

    getDescription = () => this.#description;

    getDueDate = () => this.#dueDate;

    getPriority = () => this.#priority;

    setTitle (title) {
        this.#title = title;
    }

    setDescription(description) {
        this.#description = description;
    }

    setDueDate(dueDate) {
        this.#dueDate = dueDate;
    }

    setPriority(priority) {
        this.#priority = priority;
    }
    
}