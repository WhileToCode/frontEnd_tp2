class IndexController extends BaseController {
    constructor() {
        super()
        this.list_id = indexController.SelectedList_id
        indexController.SelectedList_id = null

        this.displayTitle()
        this.displayAllFromList()
    }
    async displayTitle(){
        const list_actuel = await this.model.getListe(this.list_id)
        $("#title").innerHTML ="Liste pour "+list_actuel.nameliste+" du "+list_actuel.date.toISOString().substr(0, 10)
    }
    displayAddArticle(){this.getModal('#modalAddArticle').open()}

    async AddArticle(){
        let article = $('#article').value
        let quantity = $('#nombre').value
        let checked = $('#checkinsert').checked
        let list_id = this.list_id
        let newarticle = new Articles(article, quantity, checked, list_id)
        await this.model.insert(newarticle)
        console.log(`${newarticle}`)
        this.displayAllFromList()
    }

    async displayEditArticle(article_id){
        const article = await this.modelarticle.getArticle(article_id)
        $("#nomedit").value = article.article
        $("#nombreedit").value = article.quantity
        let content = `<a href="#" class="modal-close waves-effect waves-light purple btn" id="btnConfirmEditList" onclick="indexController.EditItem(${article.article_id})" >Modifier</a>`
        $('#editfonc2').innerHTML = content
        this.getModal('#modalEditArticle').open()
    }

    async EditArticle(article_id){
        try {

            const article = await this.liste.getItem(article_id)
            if (article === undefined) {
                this.displayServiceError()
                return
            }
            if (article === null) {
                this.displayNotFoundError()
                return
            }
            article.article = $("#nomedit").value
            article.quantity = $("#nombreedit").value
            article.checked = $("#check").checked

            await this.ModelArticle.update(article)
            this.displayAllFromList()

        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async displayConfirmDeleteArticle(article_id){

        const article = await this.modelarticle.getArticle(article_id)

        if (article === undefined) {
            this.displayServiceError()
            return
        }
        if (article === null) {
            this.displayNotFoundError()
            return
        }

        $('#spanDeleteObject2').innerText = article.article.toString()
        let content =`<a href="#" class="modal-close waves-effect waves-green btn-flat" id="btnDelete" onclick="indexController.DeleteArticle(${article.article_id})">Oui</a>`
        $('#suppfonc2').innerHTML = content
        this.getModal('#modalConfirmDeleteItem').open()

    }

    async DeleteArticle(article_id){
        try{

            const article = await this.model.getItem(article_id)
            switch(await this.modelArticle.delete(article_id)) {
                case 200:
                    this.deletedItem = article
                    await this.displayDeletedMessage("indexController.undoDeleteItem()");
                    break
                case 404:
                    this.displayNotFoundError();
                    break
                default:
                    this.displayServiceError()
            }
            this.displayAllFromList()


        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async undoDeleteArticle(){
        if (this.deletedItem) {
            await this.model.insert(this.deletedItem).then(status => {
                if (status == 200) {
                    this.deletedItem = null
                    this.displayUndoDone()
                    this.displayAllFromList()
                }
            }).catch(_ => this.displayServiceError())
        }}


    async displayAllFromList(){
        try {
            let content = ''
            const items = await this.modelitem.getAllFromList(this.list_id)

            for (let item of items){
                let check = ""
                if (item.checked){
                    check = `<input type="checkbox" class="filled-in" checked="checked" background="purple"/> <span>Acheté</span>`
                }
                else {
                    check = `<input type="checkbox" class="filled-in" background="purple"/><span>Non Acheté</span>`
                }
                content += `<tr><td >${item.label}</td>
                    <td>${item.quantity}</td>
                    <td>${check}</td>
                    <td><a class="btn-floating btn-small waves-effect waves-light purple " ><i class="material-icons center" onclick="indexController.displayConfirmDeleteAticle(${item.item_id})">delete_forever</i></a></td>
                    <td><a class="btn-floating btn-small waves-effect waves-light purple" ><i class="material-icons center" onclick="indexController.displayEditArticle(${item.item_id})" >edit</i></a></td>
                    </tr>`
            }
            $("#ItemTable").innerHTML = content
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

}

window.indexController = new IndexController()