class ModelArticle {
    constructor() {
        this.api = new ArticleAPI()
    }
    async getAllFromList(list_id){
        let articles = []
        for (let article of await this.api.getAllFromList(list_id)){
            articles.push(Object.assign(new Articles(), article))
        }
        return articles
    }

    async getArticle(article_id){
        try {
            let article = Object.assign(new Liste(), await this.api.get(article_id))

            return article
        } catch (e) {
            if (e === 404) return null
            return undefined
        }
    }

    delete(article_id) {
        return this.api.delete(article_id).then(res => res.status)
    }
    insert(article){
        return this.api.insert(article).then(res => res.status)
    }
    update(article) {
        return this.api.update(article).then(res => res.status)
    }

}