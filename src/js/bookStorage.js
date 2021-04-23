'use strict'

export class BookStorage {
    constructor() {
        this._state = document.getElementById("readlist-state");
        this._markedBooksContainer = document.getElementById("to-read-marked");
        this._unmarkedBooksContainer = document.getElementById("to-read-unmarked");

        console.log(this.getLocalStorageData());

        const { unmarkedBooks, markedBooks } = this.getLocalStorageData();

        this._unmarkedBooks = unmarkedBooks;
        this._markedBooks = markedBooks;

        this.initRender();

        window.onbeforeunload = this.saveBooks.bind(this);
    }

    saveBooks() {
        localStorage.clear();
        localStorage.setItem("booksInfo", JSON.stringify({
            unmarkedBooks: this._unmarkedBooks,
            markedBooks: this._markedBooks
        }));
     }

    initRender() {
        this.setState();

        // add books from storage
        this._unmarkedBooks.forEach(item => this.renderUnmarkedBook(item));
        this._markedBooks.forEach(item => this.renderMarkedBook(item));
    }

    setState() {
        this._state.innerHTML = `<div class="right-column-header-state" id="readlist-state">
                                    ${this._unmarkedBooks.length + this._markedBooks.length} books, ${this._markedBooks.length} read
                                 </div>`;
    }

    renderMarkedBook(book) {
        const newDiv = document.createElement("div");
        newDiv.setAttribute("class", "right-column-list-holder__elem marked");
        newDiv.setAttribute("id", book.key);
        newDiv.innerHTML = `<div class="right-column-list-holder__elem-title">${book.title}</div>
                            <div class="right-column-list-holder__elem-subtitle">${book.subtitle !== undefined ? book.subtitle : "no subtitle"}</div>
                            <div class="right-column-list-holder__elem-author">${book.author_name[0] !== undefined ? book.author_name[0] : "no info about author"}</div>
                            <div class="right-column-list-holder__elem-actions">
                                <button class="right-column-list-holder__elem-actions__button" data-action="unmark">Unmark</button>
                                <button class="right-column-list-holder__elem-actions__button" data-action="remove">Remove from list</button>
                            </div>`;
        this._markedBooksContainer.appendChild(newDiv);
        const buttons = document.getElementById(book.key);
        buttons.addEventListener("click", this.processAction.bind(this));
    }

    renderUnmarkedBook(book) {
        const newDiv = document.createElement("div");
        newDiv.setAttribute("class", "right-column-list-holder__elem");
        newDiv.setAttribute("id", book.key);
        newDiv.innerHTML = `<div class="right-column-list-holder__elem-title">${book.title}</div>
                            <div class="right-column-list-holder__elem-subtitle">${book.subtitle !== undefined ? book.subtitle : "no subtitle"}</div>
                            <div class="right-column-list-holder__elem-author">${book.author_name !== undefined && book.author_name[0] !== undefined ? book.author_name[0] : "no info about author"}</div>
                            <div class="right-column-list-holder__elem-actions">
                                <button class="right-column-list-holder__elem-actions__button" data-action="mark">Mark as read</button>
                                <button class="right-column-list-holder__elem-actions__button" data-action="remove">Remove from list</button>
                            </div>`;
        this._unmarkedBooksContainer.appendChild(newDiv);
        const buttons = document.getElementById(book.key);
        buttons.addEventListener("click", this.processAction.bind(this));
    }

    isInStorage(id) {
        return this._unmarkedBooks.concat(this._markedBooks).some(item => item.key === id);
    }

    removeBook(container) {
        if (container.classList.contains("marked")) {
            const bookToDeleteIndex = this._markedBooks.indexOf(item => item.key === container.id);
            this._markedBooks.splice(bookToDeleteIndex, 1);
        } else {
            const bookToDeleteIndex = this._unmarkedBooks.indexOf(item => item.key === container.id);
            this._unmarkedBooks.splice(bookToDeleteIndex, 1);
        }
        container.remove();
        this.setState();
    }

    markBook(container, {target}) {
        container.classList.add("marked");
        target.innerText = "Unmark";
        target.dataset.action="unmark";

        const bookToMarkIndex = this._unmarkedBooks.findIndex(item => item.key === container.id);
        this._markedBooks.push(this._unmarkedBooks[bookToMarkIndex]);
        this._unmarkedBooks.splice(bookToMarkIndex, 1);
        this._markedBooksContainer.insertAdjacentElement('beforeend', container); // перемещаем в конец отмеченных
    }

    unmarkBook(container, {target}) {
        container.classList.remove("marked");
        target.innerText = "Mark as read";
        target.dataset.action = "mark";

        const bookToUnmarkIndex = this._markedBooks.findIndex(item => item.key === container.id);
        this._unmarkedBooks.push(this._markedBooks[bookToUnmarkIndex]);
        this._markedBooks.splice(bookToUnmarkIndex, 1);
        this._unmarkedBooksContainer.insertAdjacentElement('beforeend', container); // перемещаем в конец неотмеченных
    }

    processAction(event) {
        if (event.target.nodeName === "BUTTON") {
            const container = event.target.parentNode.parentNode;
            if (event.target.dataset.action === "mark" || event.target.dataset.action === "unmark") {
                if (event.target.dataset.action === "mark") {
                    this.markBook(container, event);
                } else {
                    this.unmarkBook(container, event);
                }
            } else {
                // remove book
                this.removeBook(container);
            }
            this.setState();
        }
    }

    addBook(book) {
        let added = false;
        if (!this.isInStorage(book.key)) {
            added = true;
            this._unmarkedBooks.push(book);
            this.renderUnmarkedBook(book);
            this.setState();
        }
        return added;
    }

    getLocalStorageData() {
        let result;

        let localStorageJson = localStorage.getItem("booksInfo");

        if (localStorageJson === null || localStorageJson === "[]") { // Данных нет
            localStorage.setItem("booksInfo", JSON.stringify({
                unmarkedBooks: [],
                markedBooks: []
            }));
            result = {
                unmarkedBooks: [],
                markedBooks: []
            }
        } else { // Данные есть
            try {
                result = JSON.parse(localStorage.getItem("booksInfo"));
            } catch (e) {
                console.log(`localStorage JSON parse error: ${e.message}`);
            }
        }

        return result;
    }
}
