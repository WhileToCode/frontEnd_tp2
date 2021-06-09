class ModelPartage {
    constructor() {
        this.api = new PartageAPI()
    }

   /* async getAllMyPartage() {
        //return await this.api.getAll()
        let partages = []
        for (let partage of await this.api.getAllMyPartage()) {
            partages.push(Object.assign(new Partage(), partage))

        }
        return partages
    }*/


    async getPartage(id) {
        try {
            const liste = Object.assign(new Liste(), await this.api.getPartage(id))
            liste.date = new Date(liste.date)
            return liste
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
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

    async getBylistid(liste_id){
        let partages = []
        for (let partage of await this.api.getBylistid(liste_id)) {
            partages.push(Object.assign(new Partage(), partage))
        }
        return partages
    }

    async getByLogin(login){
        for(let partage of await this.api.getBylogin(login)) {
            partage.push(Object.assign(new Partage(), partage))
        }
        return partage
    }

    async getAllPartage() {
        //return await this.api.getAll()
        let partages = []
        for (let partage of await this.api.getAllPartage()) {
            partages.push(Object.assign(new Partage(), partage))

        }
        return partages
    }

    delete(id) {
        return this.api.delete(id).then(res => res.status)
    }

    insert(partage) {
        return this.api.insert(partage).then(res => res.status)
    }

    update(liste) {
        return this.api.update(liste).then(res => res.status)
    }
}