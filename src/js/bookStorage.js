export class BookStorage {
    // TODO: Хранить отдельно прочитанные книги и непрочитанные. Потребность в хранении размера отпадет + можно будет рисовать сначала прочитанные, а потом - непрочитанные
    constructor() {
        this._state = document.getElementById("readlist-state");
        this._toReadContainer = document.getElementById("to-read-container");

        this._booksInfo = this.getLocalStorageData();

        this.setState();
    }

    setState() {
        this._state.innerHTML = `<div class="right-column-header-state" id="readlist-state">
                                    ${this._booksInfo.books.length} books, ${this._booksInfo.markedBooksCount} read
                                 </div>`;
    }

    renderBook(book) {
        const newDiv = document.createElement("div");
        newDiv.setAttribute("class", "right-column-list-holder__elem");
        newDiv.innerHTML = `<div class="right-column-list-holder__elem-title">${book.title}</div>
                            <div class="right-column-list-holder__elem-subtitle">${book.subtitle !== undefined ? book.subtitle : "no subtitle"}</div>
                            <div class="right-column-list-holder__elem-author">${book.author_name[0] !== undefined ? book.author_name[0] : "no info about author"}</div>
                            <div class="right-column-list-holder__elem-actions" id="${book.key}">
                                <button class="right-column-list-holder__elem-actions__button" data-action="mark">Mark as read</button>
                                <button class="right-column-list-holder__elem-actions__button" data-action="remove">Remove from list</button>
                            </div>`;
        this._toReadContainer.appendChild(newDiv);
    }

    removeBook(id) {

    }

    addBook(book) {
        this._booksInfo.books.push(book);
        this.renderBook(book);

        const buttons = document.getElementById(book.key);

        buttons.addEventListener("click", event => {
            const container = event.target.parentNode.parentNode;
            if (event.target.dataset.action === "mark") {
                if (event.target.innerText === "Mark as read") {
                    container.classList.add("marked");
                    event.target.innerText = "Unmark";
                } else {
                    container.classList.remove("marked");
                    event.target.innerText = "Mark as read";
                }

            } else {

            }
        })
    }

    getBook(id) {
        return this._booksInfo.books.find(item => item.key === id);
    }

    markBook(book) {
        book.mark = true;
    }

    unmarkBook(book) {
        book.mark = false;
    }

    setReadContainer() {
        let HTML;

        this._booksInfo.books.forEach(item => {
           HTML += ``;
        });
    }

    getLocalStorageData() {
        let result;

        let localJson = localStorage.getItem("booksInfo");

        if (localJson === null || localJson === "[]") {
            localStorage.setItem("booksInfo", JSON.stringify({
                books: [],
                markedBooksCount: 0
            }));
            this._storage = [];
            this._markedBooksCount = 0;
        } else {
            try {
                result = JSON.parse(localStorage.getItem("booksInfo"));
            } catch (e) {
                console.log(`localStorage JSON parse error: ${e.message}`);
                result = null;
            }
        }

        return result;
    }
}
