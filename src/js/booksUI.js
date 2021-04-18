'use strict'

export class BooksUI {
    constructor(api) {
        this._api = api;
        this._searchInput = document.getElementById("search-input");
        this._bookInfoHolder = document.getElementById("book-info-holder");
        this._booksList = document.getElementById("books-list");
        this._resultsInfo = document.getElementById("results-info");
        this._searchInput.value = "";

        const searchButton = document.getElementById("search-button");

        searchButton.addEventListener("click", event => {
            // TODO: на время выполнения запроса блокировать все новые нажатия кнопки
            event.preventDefault();
            const searchValue = this._searchInput.value;
            this._api.search(searchValue, 1).then(response => {
                this.processSearchResult(response);
            }, err => {
                this.processSearchError(err);
            });
        });
    }

    processSearchResult(data) {
        console.log(data);
        let HTML = "";

        data.docs.forEach(item => {
            HTML+= `<div class="left-column-result-wrapper__elem">${item.title} 
                    (${item.language === undefined ? "no info" : item.language.join(", ")})</div>`;
        });

        this._booksList.innerHTML = HTML;
        HTML = `    <div class="left-column-results-info-stats">
                        <span class="left-column-results-info-stats_elem">
                            Found: ${data.numFound}
                        </span>
                        <span class="left-column-results-info-stats_elem">
                            Start: ${data.start}
                        </span>
                        <span class="left-column-results-info-stats_elem">
                             Page size: 100
                        </span>
                    </div>`;

        this._resultsInfo.innerHTML = HTML;
    }

    processSearchError(err) {
        console.log(`Error occurred!`);
        console.log(err);
    }
}