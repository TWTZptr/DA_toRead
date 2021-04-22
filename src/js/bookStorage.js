export class BookStorage {
    // TODO: Хранить отдельно прочитанные книги и непрочитанные. Потребность в хранении размера отпадет + можно будет рисовать сначала прочитанные, а потом - непрочитанные
    constructor() {
        this._state = document.getElementById("readlist-state");
        this._toReadContainer = document.getElementById("to-read-container");

        console.log(this.getLocalStorageData());

        const {unmarkedBooks, markedBooks} = this.getLocalStorageData();

        this._unmarkedBooks = unmarkedBooks;
        this._markedBooks = markedBooks;

        this.initRender();

        window.onbeforeunload = saveBooks;
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
        this._markedBooks.forEach(item => this.renderUnmarkedBook());
    }

    setState() {
        this._state.innerHTML = `<div class="right-column-header-state" id="readlist-state">
                                    ${this._unmarkedBooks.length + this._markedBooks.length} books, ${this._markedBooks.length} read
                                 </div>`;
    }

    renderMarkedBook(book) {
        const newDiv = document.createElement("div");
        newDiv.setAttribute("class", "right-column-list-holder__elem");
        newDiv.setAttribute("id", book.key);
        newDiv.innerHTML = `<div class="right-column-list-holder__elem-title">${book.title}</div>
                            <div class="right-column-list-holder__elem-subtitle">${book.subtitle !== undefined ? book.subtitle : "no subtitle"}</div>
                            <div class="right-column-list-holder__elem-author">${book.author_name[0] !== undefined ? book.author_name[0] : "no info about author"}</div>
                            <div class="right-column-list-holder__elem-actions">
                                <button class="right-column-list-holder__elem-actions__button" data-action="unmark">Unmark</button>
                                <button class="right-column-list-holder__elem-actions__button" data-action="remove">Remove from list</button>
                            </div>`;
        this._toReadContainer.appendChild(newDiv);
    }

    renderUnmarkedBook(book) {
        const newDiv = document.createElement("div");
        newDiv.setAttribute("class", "right-column-list-holder__elem");
        newDiv.setAttribute("id", book.key);
        newDiv.innerHTML = `<div class="right-column-list-holder__elem-title">${book.title}</div>
                            <div class="right-column-list-holder__elem-subtitle">${book.subtitle !== undefined ? book.subtitle : "no subtitle"}</div>
                            <div class="right-column-list-holder__elem-author">${book.author_name[0] !== undefined ? book.author_name[0] : "no info about author"}</div>
                            <div class="right-column-list-holder__elem-actions">
                                <button class="right-column-list-holder__elem-actions__button" data-action="mark">Mark as read</button>
                                <button class="right-column-list-holder__elem-actions__button" data-action="remove">Remove from list</button>
                            </div>`;
        this._toReadContainer.appendChild(newDiv);
    }

    isInStorage(id) {
        return this._unmarkedBooks.concat(this._markedBooks).some(item => item.key === id);
    }

    removeBook(container, {target}) {
        if (container.classList.contains("marked")) {
            const bookToDeleteIndex = this._markedBooks.indexOf(item => item.key === container.id);
            this._markedBooks.splice(bookToDeleteIndex, 1);
        } else {
            const bookToDeleteIndex = this._unmarkedBooks.indexOf(item => item.key === container.id);
            this._unmarkedBooks.splice(bookToDeleteIndex, 1);
        }
        container.remove();
    }

    markBook(container, {target}) {
        container.classList.add("marked");
        event.target.innerText = "Unmark";
    }

    unmarkBook(container, {target}) {
        container.classList.remove("marked");
        event.target.innerText = "Mark as read";
    }

    processAction(event) {
        if (event.target.nodeName === "BUTTON") {
            const container = event.target.parentNode.parentNode;

            if (event.target.dataset.action === "mark") {
                if (event.target.innerText === "Mark as read") {
                    this.markBook(container, event);
                } else {
                    this.unmarkBook(container, event);
                }
            } else {
                // remove book
                this.removeBook(container, event);
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
            const buttons = document.getElementById(book.key);

            buttons.addEventListener("click", this.processAction.bind(this));
        }
        return added;
    }

    getBook(id) {
        return this._booksInfo.books.find(item => item.key === id);
    }

    getLocalStorageData() {
        let result;

        let localStorageJson = localStorage.getItem("booksInfo");

        if (localStorageJson === null || localStorageJson === "[]") {
            localStorage.setItem("booksInfo", JSON.stringify({
                unmarkedBooks: [],
                markedBooks: []
            }));
            result = {
                unmarkedBooks: [],
                markedBooks: []
            }
        } else {
            try {
                result = JSON.parse(localStorage.getItem("booksInfo"));
            } catch (e) {
                console.log(`localStorage JSON parse error: ${e.message}`);
            }
        }

        return result;
    }
}
