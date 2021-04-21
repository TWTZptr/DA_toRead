'use strict'
// TODO: infinite scroll + search without enter (3+ chars, debounce)

import { BookInfo } from "./bookInfo";

export class BookSearch {
    constructor(api) {
        this._api = api;
        this._searchInput = document.getElementById("search-input");
        this._booksList = document.getElementById("books-list");
        this._resultsInfo = document.getElementById("results-info");
        this._changePageButtons = document.getElementById("change-page-buttons");
        this._prevButton = document.getElementById("prev-button");
        this._nextButton = document.getElementById("next-button");

        this._infoUI = new BookInfo();
        this._selectedPage = null;
        this._searchInput.value = "";
        this._inputBlock = false;
        this._currentPage = 0;
        this._results = [];
        this._currentRequest = "";

        const searchButton = document.getElementById("search-button");

        searchButton.addEventListener("click", this.processSearch.bind(this));
        this._changePageButtons.addEventListener("click", this.changePage.bind(this));
        this._booksList.addEventListener("click", event => {
            if (event.target.classList.contains("left-column-result-wrapper__elem")) {
                let selectedElem = this._results[this._currentPage].docs.find(item => item.key === event.target.dataset.elemId);
                this._infoUI.showInfo(selectedElem);
                this.selectItem(event.target);
            }
        })
    }

    async changePage(event) {
        if (!event.target.classList.contains("inactive") && event.target.nodeName === "BUTTON" && !this._inputBlock) {
            const action = event.target.dataset.action;
            this._inputBlock = true;

            if (action === "prev") {
                this._currentPage--;
            } else {
                this._currentPage++;
            }

            if (this._results[this._currentPage] === undefined) {
                const newPage = await this._api.search(this._currentRequest, this._currentPage + 1);
                this._results.push(newPage);
            }

            this.renderSearchResult(this._results[this._currentPage]);
            this._inputBlock = false;
        }
    }

    processSearch(event) {
        if (!this._inputBlock) {
            this._inputBlock = true;
            event.preventDefault();
            this._currentRequest = this._searchInput.value;
            this._api.search(this._currentRequest, this._currentPage + 1).then(response => {
                this._results.push(response);
                this.renderSearchResult(response);
            }, err => {
                this.processSearchError(err);
            });
        }
    }

    renderSearchResult(data) {
        this._booksList.innerHTML = this.makeSearchResult(data);
        this._resultsInfo.innerHTML = this.makeStats(data.numFound, data.docs.length);
        this.changeButtonsState(data.numFound, data.start);

        this._inputBlock = false;
    }

    makeStats(found, pageSize) {
        return `<div class="left-column-results-bottom-stats">
                   <span class="left-column-results-bottom-stats_elem">
                       Found: ${found}
                   </span>
                   <span class="left-column-results-bottom-stats_elem">
                       Start: ${this._currentPage * 100}
                   </span>
                   <span class="left-column-results-bottom-stats_elem">
                       Page size: ${pageSize}
                   </span>
                </div>`;
    }

    changeButtonsState(numFound, start) {
        if (start !== 0 && this._prevButton.classList.contains("inactive")) {
            this._prevButton.classList.remove("inactive");
        } else {
            if (start === 0 && !this._prevButton.classList.contains("inactive"))
                this._prevButton.classList.add("inactive");
        }

        if (start + 100 < numFound && this._nextButton.classList.contains("inactive")) {
            this._nextButton.classList.remove("inactive");
        } else {
            if (start + 100 > numFound && !this._nextButton.classList.contains("inactive"))
                this._nextButton.classList.add("inactive");
        }

    }

    makeSearchResult(data) {
        let HTML = "";
        if (data.numFound !== 0) {
            data.docs.forEach(item => {
                HTML += `<div class="left-column-result-wrapper__elem" data-elem-id = "${item.key}">
                        ${item.title} (${item.language === undefined ? "no info" : item.language.join(", ")})
                        </div>`;
            });
        } else {
            HTML = `<div class="left-column-result-wrapper__error">Nothing found!</div>`
        }

        return HTML;
    }

    processSearchError(err) {
        console.log(`Error occurred:`);
        console.log(err);
    }

    selectItem(item) {
        if (this._selectedPage) {
            this._selectedPage.classList.remove("left-column-result-wrapper__elem_selected");
        }
        item.classList.add("left-column-result-wrapper__elem_selected");
        this._selectedPage = item;
    }

}