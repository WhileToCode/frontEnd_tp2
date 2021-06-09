class IndexController extends BaseController {
    newlist = document.getElementById("btnadd");
    ListEncour = document.getElementById("btncour");
    historique = document.getElementById("historique");
  //  listdeleted = document.getElementById("btndeleted");
    listPart = document.getElementById("btnlistpart")



    constructor() {
        super()
        this.ListEncour.style.display = "none";
        this.listPart.style.display = "block"
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
                <button class="modal-close waves-effect waves-green btn-flat" id="btnAnnulDelete" onclick="indexController.displayAllLists()">Annuler</button>`
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
                    else if (pageActu){ this.displayAllListsArchived()}
                }
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

    displayList(id, modif){
        this.SelectedList_id = id
        this.SelectedModif = modif
        navigate('articles')
    }

    /*displayListPartage(id, modif){
        this.SelectedList_id = id
        navigate('articles')
    }*/

    async displayAllLists(){
        this.newlist.style.display = "block";
        this.historique.style.display = "block";
        this.ListEncour.style.display = "none";
        this.listPart.style.display = "block"

        //  this.listdeleted.style.display = "block";
        window.displayArchived = false
        let content = ''
        const listes = await this.model.getAllListes()
        try {
            for (let list of listes) {
                let check = ""
                if (list.archived) {
                    check = `<input type="checkbox" class="filled-in red" checked="checked"/> <span>Archivé</span>`
                } else {
                    check = `<input type="checkbox" class="filled-in red"/><span>Non Archivé</span>`
                }
                const date = list.date.toLocaleDateString()
                if (!list.archived && !list.deleted) {
                    content += `<tr><td onclick="indexController.displayList(${list.id}, true)">${list.namelistes}</td>
                    <td>${date}</td>
                    <td onclick="indexController.displaychangeCheck(${list.id})">${check}</td>
                      <td><a class="btn-floating btn-small waves-effect waves-light red " ><i class="material-icons center" onclick="indexController.displayConfirmDelete(${list.id})">delete_forever</i></a></td>
                      <td><a class="btn-floating btn-small waves-effect waves-light blue" ><i class="material-icons center" onclick="indexController.displayShare(${list.id})">share</i></a></td>
                      <td><a class="btn-floating btn-small waves-effect waves-light green" ><i class="material-icons center" onclick="indexController.displayEditList(${list.id})">edit</i></a></td>
                    </tr>`
                }
            }
            $("#ListTable").innerHTML = content
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async displayAllPartage(){
        this.newlist.style.display = "none";
        this.historique.style.display = "block";
        this.ListEncour.style.display = "block";
        this.listPart.style.display = "none"
        //  this.listdeleted.style.display = "block";
        window.displayArchived = false
        let content = ''
        const partages = await this.modelpartage.getAllPartage()
        const myName = await this.modeluseraccount.getByLogin(sessionStorage.getItem("displayname"))
        try {
                for (let partage of partages) {
                    if(partage.loguser === myName.displayname) {
                        const liste = await this.model.getListe(partage.liste_id)
                        const date = liste.date.toLocaleDateString()
                        if (!liste.deleted && partage.modifier === false) {
                            content += `<tr><td onclick="indexController.displayList(${liste.id}, ${partage.modifier})">${liste.namelistes}</td>
                         <td>${date}</td>
                         <td><a class="btn-floating btn-small waves-effect waves-light red " ><i class="material-icons center" onclick="modelpartage.delete(${partage.id})">delete_forever</i></a></td>
                         </tr>`
                        }
                        else if(!liste.deleted && partage.modifier === true) {
                            content += `<tr><td onclick="indexController.displayList(${liste.id})">${liste.namelistes}</td>
                         <td>${date}</td>
                         <td><a class="btn-floating btn-small waves-effect waves-light red " ><i class="material-icons center" onclick="modelpartage.delete(${partage.id})">delete_forever</i></a></td>
                         <td><a class="btn-floating btn-small waves-effect waves-light green" ><i class="material-icons center" onclick="indexController.displayEditList(${liste.id})">edit</i></a></td>
                         </tr>`
                        }
                        }
                    }

            $("#ListTable").innerHTML = content
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

    async displaychangeCheck(liste_id){
        const liste = await this.model.getListe(liste_id)
        if(liste.archived === true){
            liste.archived = false
            await this.model.update(liste)
            this.displayAllListsArchived()
        }
        else {
            liste.archived = true
            await this.model.update(liste)
            this.displayAllLists()
        }
    }

    async displaychangeCheckpartage(partage_id){
        const partage = await this.modelpartage.getPartage(partage_id)
        if(partage.modifier === true){
            partage.modifier = false
            await this.modelpartage.update(partage)
        }
        else {
            partage.modifier = true
            await this.modelpartage.update(partage)}
        }

    async displayShare(liste_id){
        let content = ''
        let content1 =''
        let content2 = ''
        const users = await this.modeluseraccount.getNotpartage(liste_id)
        const partages = await this.modelpartage.getBylistid(liste_id)
        try {
                content1 += `<button class="waves-effect waves-light purple btn" id="btnRechercheUser" onclick="indexController.getByDisplayUser(${liste_id})">Rechercher</button>`
            $("#rechercheUser").innerHTML = content1

        } catch(err) {
            console.log(err)
            this.displayServiceError()
        }
        try {
            for (let partage of partages){
                content2 += `<tr><td>${partage.loguser}</td>
                 <td><a class="btn-floating btn-small waves-effect waves-light red " ><i class="material-icons center" onclick="modelpartage.delete(${partage.id})">delete_forever</i></a></td>`
                $("#ListUserpartage").innerHTML = content2
            }
        } catch(err) {
            console.log(err)
            this.displayServiceError()
        }

        try {
            for (let user of users){
                content += `<tr><td>${user.displayname}</td>
                      <td><a class="btn-floating btn-small waves-effect waves-light green" ><i class="material-icons center" onclick="indexController.AddPartage(${liste_id}, '${user.displayname}')">add</i></a></td></tr>`
            }
            $("#ListUser").innerHTML = content

        } catch(err) {
            console.log(err)
            this.displayServiceError()
        }
        this.getModal('#modalShareList').open()
    }

    async getByDisplayUser(liste_id){
        let content = ''
        const displayUser = $('#nameUser').value
        const users = await this.modeluseraccount.getUser(displayUser)
        try {
                content += `<tr><td>${users.displayname}</td>
                      <td><a class="btn-floating btn-small waves-effect waves-light green" ><i class="material-icons center" onclick="indexController.AddPartage(${liste_id}, '${users.displayname}')">add</i></a></td></tr>`

            $("#ListUser").innerHTML = content

        } catch(err) {
            console.log(err)
            this.displayServiceError()
        }
       // this.getModal('#modalShareList').open()

    }


    async AddPartage(liste_id, loguser) {
        const partage = await this.modelpartage.getAllPartage()
        partage.modifier = $("#archimodifier").checked
        let partages = new Partage("", loguser, partage.modifier, liste_id)
        await this.modelpartage.insert(partages)
        this.toast("l'utilisateur a bien été ajouté")
        this.displayAllPartage()
    }

    async displayAllListsArchived(){
        this.ListEncour.style.display = "block";
        this.newlist.style.display = "none";
        this.historique.style.display = "none";
        this.listPart.style.display = "block"

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
                    content += `<tr><td onclick="indexController.displayList(${list.id}, true)">${list.namelistes}</td>
                    <td>${date}</td>
                    <td onclick="indexController.displaychangeCheck(${list.id})">${check}</td>

                      <td><a class="btn-floating btn-small waves-effect waves-light red " ><i class="material-icons center" onclick="indexController.displayConfirmDelete(${list.id})">delete_forever</i></a></td>
                     <!-- <td><a class="btn-floating btn-small waves-effect waves-light blue" ><i class="material-icons center" onclick="indexController.displayShare(${list.id})">share</i></a></td>-->
                      <!--<td><a class="btn-floating btn-small waves-effect waves-light green" ><i class="material-icons center" onclick="indexController.displayEditList(${list.id})">edit</i></a></td>-->

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
