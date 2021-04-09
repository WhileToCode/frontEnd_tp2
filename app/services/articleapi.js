const serviceBaseUrl2 = "http://localhost:3333/articles"

class ArticleAPI {
    getAll() {
        return fetchJSON(serviceBaseUrl2)
    }

    getAllFromList(list_id){
        return fetchJSON(`${serviceBaseUrl2}/listes/${list_id}`)
    }

    getArticle(id) {
        return fetchJSON(`${serviceBaseUrl2}/${id}`)
    }

    delete(id) {
        return fetch(`${serviceBaseUrl2}/${id}`, { method: 'DELETE' })
    }

    insert(article) {
        return fetch(serviceBaseUrl2, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article)
        })
    }

    update(article) {
        return fetch(serviceBaseUrl2, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article)
        })
    }
}
