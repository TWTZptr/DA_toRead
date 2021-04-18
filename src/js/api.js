'use strict'

export class Api {
    async search(q, pageNum) {
        const url = `https://openlibrary.org/search.json?q=${q}&page=${pageNum}`;
        console.log(`fetch url: ${url}`);
        const result = await fetch(url);
        return await result.json();
    }
}