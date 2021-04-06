const serviceBaseUrl = "http://localhost:3333/articles"

class ArticleAPI {
    getAll() {
        return fetchJSON(serviceBaseUrl)
    }
    get(id) {
        return fetchJSON(`${serviceBaseUrl}/${id}`)
    }
    delete(id) {
        return fetch(`${serviceBaseUrl}/${id}`, { method: 'DELETE' })
    }
    insert(article) {
        return fetch(serviceBaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article)
        })
    }
    update(article) {
        return fetch(serviceBaseUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articles)
        })
    }
}
