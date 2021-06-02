const serviceBaseUrl3 = "http://localhost:3333/listes"


class ListAPI extends BaseAPIService{
    constructor()
     {
        super("listes");
    }
    getAllLists() {
        return fetchJSON(serviceBaseUrl3, this.token)
    }

    getList(list_id) {
        return fetchJSON(`${serviceBaseUrl3}/${list_id}`, this.token)
    }
    delete(list_id) {
        return fetch(`${serviceBaseUrl3}/${list_id}`,  { method: 'DELETE' })
    }

    insert(list) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(serviceBaseUrl3, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(list)
        })
    }

    update(list) {
        this.headers.set( 'Content-Type', 'application/json' )
        return fetch(serviceBaseUrl3, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(list)
        })
    }
}
