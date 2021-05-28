class Liste {
    constructor(namelistes, date, archived, deleted) {
        this.namelistes = namelistes
        this.date = date
        this.archived = archived
        this.deleted = deleted
      //  this.id = null
    }

    toString() {
        return `${this.namelistes}`
    }
}