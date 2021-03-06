class IndexController extends BaseController {
    newarticle = document.getElementById("btnadd");

    constructor() {
        super()
        this.list_id = indexController.SelectedList_id
        this.modif = indexController.SelectedModif

        indexController.SelectedList_id = null

        this.displayTitle()
        this.displayAllFromList()
    }

    async displayTitle(){
        const list_actuel = await this.model.getListe(this.list_id)
        $("#title").innerHTML ="Liste pour "+ list_actuel.namelistes +" du "+list_actuel.date.toISOString().substr(0, 10)
    }

    displayAddArticle(){this.getModal('#modalAddArticle').open()}

    async AddArticle(){
        let article = $('#article').value
        let quantite = $('#nombre').value
        if (article !== "" && article !== null && quantite !== "" && quantite !== null){
            let checked = $('#checkinsert').checked
            let listid = this.list_id
            let newarticle = new Articles(article, quantite, checked, listid)
            await this.modelarticle.insert(newarticle)
            this.displayAllFromList()
        }else{
            indexController.validateRequiredField("#article", "name")
            indexController.validateRequiredField("#nombre", "quantite")

        }
    }

    async displayEditArticle(id){
        const article = await this.modelarticle.getArticle(id)
        $("#nomedit").value = article.articles
        $("#nombreedit").value = article.quantite
        let content = `<button class="modal-close waves-effect waves-light red btn" id="btnConfirmEditList" onclick="indexController.EditArticle(${article.id})" >Modifier</button>`
        $('#editfonc2').innerHTML = content
        this.getModal('#modalEditArticle').open()
        this.displayAllFromList()
    }

    async EditArticle(id){
        try {
            const article = await this.modelarticle.getArticle(id)
            if (article === undefined) {
                this.displayServiceError()
                return
            }
            if (article === null) {
                this.displayNotFoundError()
                return
            }
            article.articles = $("#nomedit").value
            article.quantite = $("#nombreedit").value
            article.checked = $("#check").checked

            await this.modelarticle.update(article)
            this.displayAllFromList()

        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async displayConfirmDeleteArticle(id){

        const article = await this.modelarticle.getArticle(id)

        if (article === undefined) {
            this.displayServiceError()
            return
        }
        if (article === null) {
            this.displayNotFoundError()
            return
        }

        $('#spanDeleteObject2').innerText = article.articles.toString()
        let content =`<button class="modal-close waves-effect waves-green btn-flat" id="btnDelete" onclick="indexController.DeleteArticle(${article.id})">Oui</button>`
        $('#suppfonc2').innerHTML = content
        this.getModal('#modalConfirmDeleteArticle').open()

    }

    async DeleteArticle(id){
        try{

            const article = await this.modelarticle.getArticle(id)
            switch(await this.modelarticle.delete(id)) {
                case 200:
                    this.deletedArticle = article
                    await this.displayDeletedMessage("indexController.undoDeleteArticle()");
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
        if (this.deletedArticle) {
            await this.modelarticle.insert(this.deletedArticle).then(status => {
                if (status == 200) {
                    this.deletedArticle = null
                    this.displayUndoDone()
                    this.displayAllFromList()
                }
            }).catch(_ => this.displayServiceError())
            this.displayAllFromList()

        }}


    async displayAllFromList(){

        if (this.modif === false){
            this.newarticle.style.display = "none";
        }else{
            this.newarticle.style.display = "block";
        }

        try {
            let content = ''
            const articles = await this.modelarticle.getAllFromList(this.list_id)
            for (let article of articles){
                let check = ""
                if (article.checked){
                    check = `<input type="checkbox" class="filled-in" checked="checked" background="red"/> <span>Achet??</span>`
                }
                else {
                    check = `<input type="checkbox" class="filled-in" background="red"/><span>Non Achet??</span>`
                }
                if (this.modif === true){
                content += `<tr><td >${article.articles}</td>
                    <td>${article.quantite}</td>
                    <td onclick="indexController.displaychangeCheck(${article.id})">${check}</td>
                    <td><a class="btn-floating btn-small waves-effect waves-light red " ><i class="material-icons center" onclick="indexController.displayConfirmDeleteArticle(${article.id})">delete_forever</i></a></td>
                    <td><a class="btn-floating btn-small waves-effect waves-light red" ><i class="material-icons center" onclick="indexController.displayEditArticle(${article.id})" >edit</i></a></td>
                    </tr>`
            }else{
                    content += `<tr><td >${article.articles}</td>
                    <td>${article.quantite}</td>
                    <td onclick="indexController.displaychangeCheck(${article.id})">${check}</td>
                     <td><a class="btn-floating btn-small waves-effect waves-light red" ><i class="material-icons center" onclick="indexController.displayEditArticle(${article.id})" >edit</i></a></td>
                    </tr>`
                }
            }
            $("#ArticleTable").innerHTML = content
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async displaychangeCheck(article_id){
        const article = await this.modelarticle.getArticle(article_id)
        if(article.checked === true){
            article.checked = false
            await this.modelarticle.update(article)
        }
        else {
            article.checked = true
            await this.modelarticle.update(article)
        }
        this.displayAllFromList()
    }

}

window.indexController = new IndexController()