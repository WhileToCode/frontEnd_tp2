class Liste {
    constructor(namelistes, date, archived) {
        this.namelistes = namelistes
        this.date = date
        this.archived = archived
      //  this.id = null
    }

    toString() {
        return `${this.namelistes}`
    }
}