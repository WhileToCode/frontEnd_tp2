class Model {
    constructor() {
        this.api = new ListeAPI()
    }
    async getAllListes() {
        //return await this.api.getAll()
        let listes = []
        for (let liste of await this.api.getAll()) {
            liste.builddate = new Date(liste.builddate)
            listes.push(Object.assign(new Liste(), liste))

        }
        return listes
    }
    async getListe(id) {
        try {
            const liste = Object.assign(new Liste(), await this.api.get(id))
            liste.builddate = new Date(liste.builddate)
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
        return this.api.insert(car).then(res => res.status)
    }
    update(liste) {
        return this.api.update(car).then(res => res.status)
    }
}