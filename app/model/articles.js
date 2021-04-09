class Articles {
    constructor(articles, quantite, checked) {
        this.articles = articles
        this.quantite = quantite
        this.checked = checked
        this.id = null
    }

    toString() {
        return `${this.articles}`
    }
}
