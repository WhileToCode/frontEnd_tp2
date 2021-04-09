class IndexController extends BaseController {
    constructor() {
        super()
        this.displayAllLists()
    }

    displayAddList(){
        this.getModal('#modalAddList').open()
    }

    async displayEditList(list_id){
        const list = await this.model.getListe(list_id)
        $("#listeEdit").value = list.namelistes
        $("#dateEdit").value = list.date.toISOString().substr(0, 10)
        let content = `<a href="#" class="modal-close waves-effect waves-light purple btn" id="btnConfirmEditList" onclick="indexController.EditList(${list.id})" >Modifier</a>`
        $('#editfonc').innerHTML = content
        this.getModal('#modalEditList').open()

    }

    async EditList(list_id){
        try {

            const list = await this.model.getListe(list_id)
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

    async displayConfirmDelete(list_id){
        const list = await this.model.getListe(list_id)

        if (list === undefined) {
            this.displayServiceError()
            return
        }
        if (list === null) {
            this.displayNotFoundError()
            return
        }
        $('#spanDeleteObject').innerText = list.namelistes.toString()
        let content =`<a href="#" class="modal-close waves-effect waves-green btn-flat" id="btnDelete" onclick="indexController.DeleteList(${list.id})">Oui</a>`
        $('#suppfonc').innerHTML = content
        this.getModal('#modalConfirmDelete').open()
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
        }}

    async DeleteList(list_id){
        try{

            const list = await this.model.getListe(list_id)
            switch(await this.model.delete(list_id)) {
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

    displayList(list_id){
        this.SelectedList_id = list_id
        navigate('Item')


    }

    async displayAllLists(){
        let content = ''
        const listes = await this.model.getAllListes()
        try {
            for (let list of listes) {
                let check = ""
                if (list.archived){
                    check = `<input type="checkbox" class="filled-in purple" checked="checked"/> <span>Archivé</span>`
                }
                else {
                    check = `<input type="checkbox" class="filled-in purple"/><span>Non Archivé</span>`
                }
                const date = list.date.toLocaleDateString()
                content += `<tr><td onclick="indexController.displayList(${list.id})">${list.namelistes}</td>
                    <td>${date}</td>
                    <td>${list.archived}</td>
                    <td>${check}</td>

                      <td><a class="btn-floating btn-small waves-effect waves-light red " ><i class="material-icons center" onclick="indexController.displayConfirmDelete(${list.id})">delete_forever</i></a></td>
                    <td><a class="btn-floating btn-small waves-effect waves-light red" ><i class="material-icons center" onclick="indexController.displayEditList(${list.id})">edit</i></a></td>

                    </tr>`
            }
            $("#ListTable").innerHTML = content
        } catch (err) {
            console.log(err)
            this.displayServiceError()
        }
    }

}

window.indexController = new IndexController()
