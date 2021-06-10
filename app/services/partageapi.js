const serviceBaseUrl4 = "http://localhost:3333/partage"


class PartageAPI extends BaseAPIService{
    constructor()
    {
        super("partage");
    }
    getAllLists() {
        return fetchJSON(serviceBaseUrl4, this.token)
    }

    getAllPartage() {
        return fetchJSON("http://localhost:3333/partage", this.token)
    }

    getBylistid(list_id) {
        return fetchJSON(`${serviceBaseUrl4}/${list_id}`, this.token)
    }

    getPartage(partage_id) {
        return fetchJSON(`${serviceBaseUrl4}/${partage_id}`, this.token)
    }
    delete(partage_id) {
        return fetch(`${serviceBaseUrl4}/${partage_id}`,  { method: 'DELETE' })
    }

    insert(partage) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(serviceBaseUrl4, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(partage)
        })
    }

    update(partage) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(serviceBaseUrl4, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(partage)
        })
    }
}
