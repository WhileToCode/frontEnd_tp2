class Model {
    constructor() {
        this.api = new ListAPI()
    }

    async getAllListes() {
        //return await this.api.getAll()
        let listes = []
        for (let liste of await this.api.getAllLists()) {
            liste.date = new Date(liste.date)
            listes.push(Object.assign(new Liste(), liste))

        }
        return listes
    }

    async getListe(id) {
        try {
            const liste = Object.assign(new Liste(), await this.api.getList(id))
            liste.date = new Date(liste.date)
            return liste
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }

    delete(id) {
        return this.api.delete(id).then(res => res.status)
    }

    insert(liste) {
        return this.api.insert(liste).then(res => res.status)
    }

    update(liste) {
        return this.api.update(liste).then(res => res.status)
    }
}