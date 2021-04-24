'use strict'

export class Api {
    constructor() {
        this.controller = null;
    }

    async search(q, pageNum) {
        const url = `https://openlibrary.org/search.json?q=${q}&page=${pageNum}`;
        console.log(`fetch url: ${url}`);
        this.controller = new AbortController();
        const result = await fetch(url, {signal: this.controller.signal});
        return await result.json();
    }

    stopFetch() {
        if (this.controller) this.controller.abort();
    }
}