class LoginController extends BaseFormController {
    connex = document.getElementById("connex");
    register = document.getElementById("register");

    constructor() {
        super(false)
        this.svc = new UserAccountAPI()
    }
    async authenticate() {
        this.register.style.display = "none";

        let login = this.validateRequiredField('#fieldLogin', 'Adresse e-mail')
        let password = this.validateRequiredField('#fieldPassword', 'Mot de passe')
        if ((login != null) && (password != null)) {
            this.svc.authenticate(login, password)
                .then(res => {
                    sessionStorage.setItem("token", res.token)
                    sessionStorage.setItem("displayname", login)
                    window.location.replace("index.html")
                })
                .catch(err => {
                    console.log(err)
                    if (err === 401) {
                        this.toast("Adresse e-mail ou mot de passe incorrect")
                    } else {
                        this.displayServiceError()
                    }
                })
        }
    }
    async displayRegister(){
        this.connex.style.display = "none";
        this.register.style.display = "block";

        try{
            let content = ''
            content += `<button class="waves-effect waves-light purple btn" id="btnregister" onclick="loginController.register2()">S'enregistrer</button>`
            $("#btnregister1").innerHTML = content
        }catch{
            console.log(err)
            this.displayServiceError()
        }
    }
    async register2(){
        let pseudo = $("#pseudo").value
        let login = $("#email").value
        let challenge = $("#challenge").value
        let newuser = new UserAccount(pseudo, login, challenge)
        if (await this.modeluseraccount.insert(newuser) === 200){
            this.connex.style.display = "block";
            this.register.style.display = "none";
            this.toast("L'utilisateur a bien été ajouté")
        }else {
            this.toast("Le pseudo ou l'email existe déjà")
        }
    }
}

window.loginController = new LoginController()
