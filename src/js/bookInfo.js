import {BookStorage} from "./bookStorage";

export class BookInfo {
    constructor() {
        this._infoContainer = document.getElementById("book-info-holder");
        this._storage = new BookStorage();
        this._currentBook = null;
    }

    showInfo(item) {
        this._infoContainer.innerHTML = `<h2 class="center-column-title>">${item.title}</h2>
                    <div class="center-column-subtitle">${item.subtitle !== undefined ? item.subtitle : ""}</div>
                    <div class="center-column-info">
                        <div class="center-column-info_langs">Languages available: ${item.language !== undefined ? item.language.join(", ") : "no information"}</div>
                        <div class="center-column-info_full-text">Full text available: ${item.has_fulltext ? "yes" : "no"}</div>
                        <div class="center-column-info_first-publish">First publish year: ${item.first_publish_year !== undefined ? item.first_publish_year : "no information"}</div>
                        <div class="center-column-info_years-published">Year published: ${item.publish_year !== undefined ? item.publish_year.join(", ") : "no information"}</div>
                    </div>
                    <button class="center-column-button" id="add-book">Add book to Read List</button>`;
        this._currentBook = item;

        const addBookButton = document.getElementById("add-book");
        addBookButton.addEventListener("click", event => {
            this._storage.addBook(this._currentBook);
        });
    }
}