class IndexController extends BaseController {
    newlist = document.getElementById("btnadd");
    ListEncour = document.getElementById("btncour");
    historique = document.getElementById("historique");
  //  listdeleted = document.getElementById("btndeleted");



    constructor() {
        super()
        this.ListEncour.style.display = "none";
            if (window.displayArchived){
                 this.displayAllListsArchived()
            }
            else {
                 this.displayAllLists()
            }
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
            const listArchi = list.archived
            list.namelistes = $("#listeEdit").value
            list.date = $("#dateEdit").value
            list.archived = $("#archi").checked

            await this.model.update(list)
            if (listArchi){
                this.displayAllListsArchived()
            }else{
                this.displayAllLists()
            }

        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async AddList(){
        let liste = $('#liste').value
        if (liste === "" || liste === null){
            indexController.validateRequiredField("#liste", "name")
        }else{
        let date = $('#date').value
        indexController.validateRequiredField("#date", "date")
        let archive = $('#archiinsert').checked
        let newlist = new Liste(liste, date, archive, false)
        await this.model.insert(newlist)
        await this.displayAllLists()
        }
    }

 /*   async displayConfirmDeleteDefinitively(id){
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
        let content =`<button class="modal-close waves-effect waves-green btn-flat" id="btnDelete" onclick="indexController.DeleteListDefinitively(${list.id})">Oui</button>
                <button class="modal-close waves-effect waves-green btn-flat" id="btnAnnulDelete" onclick="indexController.displayAllLists()">Annulé</button>`
        $('#suppfonc').innerHTML = content
        this.getModal('#modalConfirmDelete').open()
        this.displayAllLists()
    }*/

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
        let content =`<button class="modal-close waves-effect waves-green btn-flat" id="btnDelete" onclick="indexController.DeleteList(${list.id})">Oui</button>
                <button class="modal-close waves-effect waves-green btn-flat" id="btnAnnulDelete" onclick="indexController.displayAllLists()">Annulé</button>`
        $('#suppfonc').innerHTML = content
        this.getModal('#modalConfirmDelete').open()
    }

    async undoDelete(){
        if (this.deletedList) {
            this.deletedList.deleted = false
            this.model.update(this.deletedList).then(status => {
                if (status == 200) {
                    let pageActu = this.deletedList.archived
                    this.deletedList = null
                    this.displayUndoDone()
                    if (!pageActu){ this.displayAllLists()}
                    else if (pageActu){ this.displayAllListsArchived()}                }
            }).catch(_ => this.displayServiceError())
        }}

 /*   async DeleteListDefinitively(id){
        try{

            const list = await this.model.getListe(id)
            switch(await this.model.delete(id)) {
                case 200:
                    break
                case 404:
                    this.displayNotFoundError();
                    break
                default:
                    this.displayServiceError()
            }
            this.displayAllListsDeleted()


        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }*/

    async DeleteList(id){
        try{
            const list = await this.model.getListe(id)
            list.deleted = true
            switch(await this.model.update(list)) {
                case 200:
                    this.deletedList = list
                    await this.displayDeletedMessage("indexController.undoDelete()");
                    let pageActu = list.archived
                    if (!pageActu){ this.displayAllLists()}
                    else if (pageActu){ await this.displayAllListsArchived()}
                    break
                case 404:
                    this.displayNotFoundError();
                    break
                default:
                    this.displayServiceError()
            }
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
        this.newlist.style.display = "block";
        this.historique.style.display = "block";
        this.ListEncour.style.display = "none";
      //  this.listdeleted.style.display = "block";
        window.displayArchived = false
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
                if (!list.archived && !list.deleted) {
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
        this.newlist.style.display = "none";
        this.historique.style.display = "none";
     //   this.listdeleted.style.display = "block";
        window.displayArchived = true
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
                if (list.archived && !list.deleted) {
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

  /*  async displayAllListsDeleted(){
        this.ListEncour.style.display = "block";
        this.newlist.style.display = "none";
        this.historique.style.display = "block";
        this.listdeleted.style.display = "none";

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
                if (list.deleted) {
                    content += `<tr><td onclick="indexController.displayList(${list.id})">${list.namelistes}</td>
                    <td>${date}</td>
                    <td>${check}</td>

                      <td><a class="btn-floating btn-small waves-effect waves-light red " ><i class="material-icons center" onclick="indexController.displayConfirmDeleteDefinitively(${list.id})">delete_forever</i></a></td>
                    <td><a class="btn-floating btn-small waves-effect waves-light red" ><i class="material-icons center" onclick="indexController.displayEditList(${list.id})">edit</i></a></td>

                    </tr>`
                }
            }
            $("#ListTable").innerHTML = content
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }*/
}

window.indexController = new IndexController()
