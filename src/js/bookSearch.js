'use strict'
// TODO: search without enter (3+ chars, debounce)

import { BookInfo } from "./bookInfo";

export class BookSearch {
    constructor(api) {
        this._api = api;
        this._searchInput = document.getElementById("search-input");
        this._booksList = document.getElementById("books-list");
        this._resultsInfo = document.getElementById("results-info");
        this._loadingMessage = document.getElementById("loading-message");
        this._resultContainer = document.getElementById("result-container");

        this._infoUI = new BookInfo();
        this._results = [];
        this._numFound = 0;
        this._fetchBlock = false;
        this._selectedPage = null;
        this._searchInput.value = "";
        this._currentPage = 0;
        this._currentRequest = "";
        this._debounceTimeoutID = null;

        this._booksList.addEventListener("click", event => {
            if (event.target.classList.contains("left-column-result-wrapper-results__elem")) {
                this._infoUI.showInfo(this._results[event.target.dataset.elemId]);
                this.selectItem(event.target);
            }
        });

        this._searchInput.addEventListener("input", event => {
            if (this._searchInput.value.length >= 3) {

                if (this._debounceTimeoutID) {
                    this._api.stopFetch();
                    clearTimeout(this._debounceTimeoutID);
                }

                this._debounceTimeoutID = setTimeout(() => {
                    this._debounceTimeoutID = null;
                    this.processSearch(event);
                }, 500);
            }
        });

        this._resultContainer.addEventListener("scroll", () => {
            if (!this._fetchBlock && this._resultContainer.scrollTop + this._resultContainer.clientHeight + 6000 > this._resultContainer.scrollHeight) {
                this.loadData();
            }
        });
    }

    processSearch(event) {
        event.preventDefault();
        if (this._currentRequest !== this._searchInput.value && this._searchInput.value !== "") {
            this._results = [];
            this._booksList.innerHTML = "";
            this._currentRequest = this._searchInput.value;
            this.loadData();
        }
    }

    loadData() {
        this.showLoadingMessage();
        this._fetchBlock = true;
        this._api.search(this._currentRequest, this._currentPage + 1).then(response => {
            this._results = this._results.concat(response.docs);
            this._numFound = response.numFound;

            this._currentPage++;
            this.renderSearchResult(response.docs);
            if (this._results.length < response.numFound) {
                this._fetchBlock = false;
            }
            this.hideLoadingMessage();
        }, err => {
            this.processSearchError(err);
            this.hideLoadingMessage();
        });
    }

    renderSearchResult(data) {
        this._booksList.innerHTML += this.makeSearchResult(data);
        this._resultsInfo.innerHTML = this.makeStats();
    }

    makeStats() {
        return `<span class="left-column-results-bottom-info_elem">
                    Found: ${this._numFound}
               </span>
               <span class="left-column-results-bottom-info_elem">
                   Loaded: ${this._results.length}
               </span>`;
    }

    makeSearchResult(data) {
        let HTML = "";
        if (data.length !== 0) {
            data.forEach((item, index) => {
                HTML += `<div class="left-column-result-wrapper-results__elem" data-elem-id = "${index + (this._currentPage - 1) * 100}">
                        ${item.title} (${item.language === undefined ? "no info" : item.language.join(", ")})
                        </div>`;
            });
        } else {
            HTML = `<div class="left-column-result-wrapper-results__error">Nothing found!</div>`
        }

        return HTML;
    }

    processSearchError(err) {
        console.log(err);
    }

    selectItem(item) {
        if (this._selectedPage) {
            this._selectedPage.classList.remove("left-column-result-wrapper__elem_selected");
        }

        item.classList.add("left-column-result-wrapper__elem_selected");
        this._selectedPage = item;
    }

    showLoadingMessage() {
        this._loadingMessage.style.display = "block";
    }

    hideLoadingMessage() {
        this._loadingMessage.style.display = "none";
    }
}