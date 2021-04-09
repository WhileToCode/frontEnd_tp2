const serviceBaseUrl = "http://localhost:3333/listes"

class ListAPI {
    getAllLists() {
        return fetchJSON(serviceBaseUrl)
    }

    getList(list_id) {
        return fetchJSON(`${serviceBaseUrl}/${list_id}`)
    }
    delete(list_id) {
        return fetch(`${serviceBaseUrl}/${list_id}`, { method: 'DELETE' })
    }

    insert(list) {
        return fetch(serviceBaseUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(list)
        })
    }

    update(list) {
        return fetch(serviceBaseUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(list)
        })
    }
}
