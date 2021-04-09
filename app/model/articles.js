class Articles {
    constructor(article, quantity, checked) {
        this.article = article
        this.quantity = quantity
        this.checked = checked
        this.id = null
    }

    toString() {
        return `${this.article}`
    }
}
