class Articles {
    constructor(articles, quantite, checked, list_id) {
        this.articles = articles
        this.quantite = quantite
        this.checked = checked
        this.list_id = list_id
    }

    toString() {
        return `${this.articles}`
    }
}
