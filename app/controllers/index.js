class IndexController extends BaseController {
    newline = document.getElementById("btnadd");
    ListEncour = document.getElementById("btncour");
    historique = document.getElementById("historique");


    constructor() {
        super()
        this.displayAllLists()
        this.ListEncour.style.display = "none";
    }

    displayAddList(){
        this.getModal('#modalAddList').open()
    }

    async displayEditList(id){
        const list = await this.model.getListe(id)
        $("#listeEdit").value = list.namelistes
        $("#dateEdit").value = list.date.toISOString().substr(0, 10)
        let content = `<button class="modal-close waves-effect waves-light red btn" id="btnConfirmEditList" onclick="indexController.EditList(${list.id})" >Modifier</button>`
        $('#editfonc').innerHTML = content
        this.getModal('#modalEditList').open()
        this.displayAllLists()
    }

    async EditList(id){
        try {

            const list = await this.model.getListe(id)
            if (list === undefined) {
                this.displayServiceError()
                return
            }
            if (list === null) {
                this.displayNotFoundError()
                return
            }
            list.namelistes = $("#listeEdit").value
            list.date = $("#dateEdit").value
            list.archived = $("#archi").checked

            await this.model.update(list)
            this.displayAllLists()

        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async AddList(){
        let liste = $('#liste').value
        let date = $('#date').value
        let archive = $('#archiinsert').checked

        let newlist = new Liste(liste, date, archive)
        await this.model.insert(newlist)
        console.log(`${newlist}`)
        await this.displayAllLists()
    }

    async displayConfirmDelete(id){
        const list = await this.model.getListe(id)

        if (list === undefined) {
            this.displayServiceError()
            return
        }
        if (list === null) {
            this.displayNotFoundError()
            return
        }
        $('#spanDeleteObject').innerText = list.namelistes.toString()
        let content =`<button class="modal-close waves-effect waves-green btn-flat" id="btnDelete" onclick="indexController.DeleteList(${list.id})">Oui</button>`
        $('#suppfonc').innerHTML = content
        this.getModal('#modalConfirmDelete').open()
        this.displayAllLists()
    }

    async undoDelete(){
        if (this.deletedList) {
            this.model.insert(this.deletedList).then(status => {
                if (status == 200) {
                    this.deletedList = null
                    this.displayUndoDone()
                    this.displayAllLists()
                }
            }).catch(_ => this.displayServiceError())
            this.displayAllLists()
        }}

    async DeleteList(id){
        try{

            const list = await this.model.getListe(id)
            switch(await this.model.delete(id)) {
                case 200:
                    this.deletedList = list
                    await this.displayDeletedMessage("indexController.undoDelete()");
                    break
                case 404:
                    this.displayNotFoundError();
                    break
                default:
                    this.displayServiceError()
            }
            this.displayAllLists()


        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }

    }

    displayList(id){
        this.SelectedList_id = id
        navigate('articles')


    }

    async displayAllLists(){
        this.newline.style.display = "block";
        this.historique.style.display = "block";
        this.ListEncour.style.display = "none";

        let content = ''
        const listes = await this.model.getAllListes()
        try {
            for (let list of listes) {
                let check = ""
                if (list.archived){
                    check = `<input type="checkbox" class="filled-in red" checked="checked"/> <span>Archivé</span>`
                }
                else {
                    check = `<input type="checkbox" class="filled-in red"/><span>Non Archivé</span>`
                }
                const date = list.date.toLocaleDateString()
                if (!list.archived) {
                    content += `<tr><td onclick="indexController.displayList(${list.id})">${list.namelistes}</td>
                    <td>${date}</td>
                    <td>${check}</td>

                      <td><a class="btn-floating btn-small waves-effect waves-light red " ><i class="material-icons center" onclick="indexController.displayConfirmDelete(${list.id})">delete_forever</i></a></td>
                    <td><a class="btn-floating btn-small waves-effect waves-light red" ><i class="material-icons center" onclick="indexController.displayEditList(${list.id})">edit</i></a></td>

                    </tr>`
                }
            }
            $("#ListTable").innerHTML = content
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }
    async displayAllListsArchived(){
        this.ListEncour.style.display = "block";
        this.newline.style.display = "none";
        this.historique.style.display = "none";


        let content = ''
        const listes = await this.model.getAllListes()
        try {
            for (let list of listes) {
                let check = ""
                if (list.archived){
                    check = `<input type="checkbox" class="filled-in red" checked="checked"/> <span>Archivé</span>`
                }
                else {
                    check = `<input type="checkbox" class="filled-in red"/><span>Non Archivé</span>`
                }
                const date = list.date.toLocaleDateString()
                if (list.archived) {
                    content += `<tr><td onclick="indexController.displayList(${list.id})">${list.namelistes}</td>
                    <td>${date}</td>
                    <td>${check}</td>

                      <td><a class="btn-floating btn-small waves-effect waves-light red " ><i class="material-icons center" onclick="indexController.displayConfirmDelete(${list.id})">delete_forever</i></a></td>
                    <td><a class="btn-floating btn-small waves-effect waves-light red" ><i class="material-icons center" onclick="indexController.displayEditList(${list.id})">edit</i></a></td>

                    </tr>`
                }
            }
            $("#ListTable").innerHTML = content
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

}

window.indexController = new IndexController()
