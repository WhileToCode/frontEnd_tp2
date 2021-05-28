class BaseController {
    constructor() {
        M.AutoInit();
        this.setBackButtonView('index')

        this.modelarticle = new ModelArticle()
      //  this.articles = new Articles()
        this.liste = new Liste()
        this.model = new Model()
    }
    checkAuthentication() {
        if (sessionStorage.getArticle("token") === null) {
            window.location.replace("login.html")
        }
    }
    toast(msg) {
        M.toast({html: msg, classes: 'rounded'})
    }
    displayNotFoundError() {
        this.toast('Entité inexistante')
    }
    displayServiceError() {
        this.toast('Service injoignable ou problème réseau')
    }
    getModal(selector) {
        return M.Modal.getInstance($(selector))
    }
    displayUndoDone() {
        this.toast('Opération annulée')
    }
    displayDeletedMessage(onUndo) {
        this.toast( `<span>Supression effectuée</span> <button class="btn-flat toast-action" onclick="${onUndo}">Annuler</button>`)
    }
    setBackButtonView(view) {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }
    validateRequiredField(selector, name) {
        const value =  $(selector).value
        if ((value == null) || (value === "")) {
            this.toast(`Le champs '${name}' est obligatoire`)
            $(selector).style.backgroundColor = 'antiquewhite'
            return null
        }
        return value
    }
}