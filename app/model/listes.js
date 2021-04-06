class Liste {
    constructor(nameListe, date, archived) {
        this.nameListe = nameListe
        this.date = date
        this.archived = archived
    }

    toString() {
        return `${this.nameListe}`
    }
}