
export default class ToDo {

    #title;

    #id;

    #description;

    #dueDate;

    #priority;

    #note = '';
    
    #status = 'pending';

    static #uuid = 1000;

    constructor(title, description, dueDate, priority) {
        this.#title = title;
        this.#description = description;
        this.#dueDate = dueDate;
        this.#priority = priority;
        this.#incrementUUID();
    }

    #incrementUUID() {
        ToDo.#uuid += 1;
        this.#id = ToDo.#uuid;
    }

    getId = () => this.#id;

    getTitle = () => this.#title;

    getDescription = () => this.#description;

    getDueDate = () => this.#dueDate;

    getPriority = () => this.#priority;

    getNote = () => this.#note;

    getStatus = () => this.#status;

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

    setNote(note) {
        this.#note = note;
    }
    
    setStatus(status) {
        this.#status = status;
    }
}