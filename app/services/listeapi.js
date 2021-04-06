const serviceBaseUrl = "http://localhost:3333/liste"

class ListeAPI {
    getAll() {
        return fetchJSON(serviceBaseUrl)
    }
    get(id) {
        return fetchJSON(`${serviceBaseUrl}/${id}`)
    }
    delete(id) {
        return fetch(`${serviceBaseUrl}/${id}`, { method: 'DELETE' })
    }
    insert(liste) {
        return fetch(serviceBaseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(liste)
        })
    }
    update(liste) {
        return fetch(serviceBaseUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(liste)
        })
    }
}
