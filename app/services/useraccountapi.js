serviceBaseUrlUserAccount = "http://localhost:3333/useraccount"

class UserAccountAPI extends BaseAPIService {
    constructor() {
        super("useraccount")
    }
    authenticate(login, password) {
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded')
        return new Promise((resolve, reject) => fetch(`${this.url}/authenticate`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}&password=${password}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    }

    getAllUser1() {
        return fetchJSON(serviceBaseUrlUserAccount, this.token)
    }

    getByLogin(login){
        return fetchJSON(`${serviceBaseUrlUserAccount}/login/${login}`)
    }

    getUser1(displayUser) {
        return fetchJSON(`${serviceBaseUrlUserAccount}/${displayUser}` )
    }

    getNotpartage(list_id) {
        return fetchJSON(`${serviceBaseUrlUserAccount}/notPartage/${list_id}`, this.token)
    }
}
