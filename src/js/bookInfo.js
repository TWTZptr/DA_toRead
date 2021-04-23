'use strict'

import {BookStorage} from "./bookStorage";

export class BookInfo {
    constructor() {
        this._infoContainer = document.getElementById("book-info-holder");
        this._storage = new BookStorage();
        this._currentBook = null;
        this._messageContainer = document.getElementById("error-message");

    }

    showInfo(item) {
        this._messageContainer.style.display = "none";
        this._infoContainer.innerHTML = `<h2 class="center-column-holder-title>">${item.title}</h2>
                    <div class="center-column-holder-subtitle">${item.subtitle !== undefined ? item.subtitle : ""}</div>
                    <div class="center-column-holder-info">
                        <div class="center-column-holder-info_langs">Languages available: ${item.language !== undefined ? item.language.join(", ") : "no information"}</div>
                        <div class="center-column-holder-info_full-text">Full text available: ${item.has_fulltext ? "yes" : "no"}</div>
                        <div class="center-column-holder-info_first-publish">First publish year: ${item.first_publish_year !== undefined ? item.first_publish_year : "no information"}</div>
                        <div class="center-column-holder-info_years-published">Year published: ${item.publish_year !== undefined ? item.publish_year.join(", ") : "no information"}</div>
                    </div>
                    <button class="center-column-holder-button" id="add-book">Add book to Read List</button>`;
        this._currentBook = item;

        const addBookButton = document.getElementById("add-book");
        addBookButton.addEventListener("click", () => {
            if (!this._storage.addBook(this._currentBook)) {
                this.showMessageError();
            }
        });
    }

    showMessageError() {
        if (this._messageContainer.style.display !== "block") {
            this._messageContainer.style.display = "block";

            setTimeout(() => {
                this._messageContainer.style.display = "none";
            }, 5000);
        }
    }
}