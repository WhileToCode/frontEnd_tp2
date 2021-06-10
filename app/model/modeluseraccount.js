class ModelUserAccount {
    constructor() {
        this.api = new UserAccountAPI()
    }

    async getAllUser() {
        let users = []
        for (let user of await this.api.getAllUser1()) {
            users.push(Object.assign(new UserAccount(), user))

        }
        return users
    }

    async getNotpartage(liste_id) {
        let users = []
        for (let user of await this.api.getNotpartage(liste_id)) {
            users.push(Object.assign(new UserAccount(), user))

        }
        return users
    }

    async getUser(displayUser) {
        try {
            const user = Object.assign(new UserAccount(), await this.api.getUser1(displayUser))
            return user
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }

    async getByLogin(login) {
        try {
            const user = Object.assign(new UserAccount(), await this.api.getByLogin(login))
            return user
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }

    delete(id) {
        return this.api.delete(id).then(res => res.status)
    }

    insert(newuser) {
        return this.api.insert(newuser).then(res => res.status)
    }

    update(liste) {
        return this.api.update(liste).then(res => res.status)
    }
}