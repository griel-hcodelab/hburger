/**
 * usando o firebase na pagina do firebase que criamos firebase-app
 */
import firebase from './firebase-app'
import { getFormValues, hideAlertError, showAlertError } from './utils'
/**
 * Para fazer uma função com varias chamadas iremos usar o exemplo de um sitema de login que tem varios formularios na mesma pagina
 * e utilizaremos a classe hide para esconder os que não serão mostrados.
 * 
 */

const authPage = document.querySelector('main#auth')

if (authPage) {

    //variavel que está o firebase.auth que é o serviço de autenticação do firebase
    const auth = firebase.auth() 

    //funcão para pegar todos os formularios que estão dentro da tag que contém o id="auth"
    //e adiciona a classe hide ou seja class="hide"
    const hideAuthForms = () => {
        document.querySelectorAll('#auth form')
        .forEach(el => el.classList.add('hide'))
    }

    //função que pega um elemento pelo seu id e remove a classe hide caso houver
    const showAuthForm = id => {
        document.getElementById(id).classList.remove('hide')
    }

    const authHash = () => {
        hideAuthForms()

        if (sessionStorage.getItem('email')) {
            document.querySelectorAll('[name=email]')
            .forEach(el => {
                el.value = sessionStorage.getItem('email')
            })
        }

        //analizando o hash na url da window
        switch (window.location.hash) {
            case '#register' :
                showAuthForm('register')
                break
            case '#login' :
                showAuthForm('login')
                break
            case '#forget' :
                showAuthForm('forget') 
                break
            case '#reset' :
                showAuthForm('reset')
                break       
            default :
                //showAuthForm('auth-email')
                showAuthForm('login')   
        }
    }

    window.addEventListener('load', e => {
        authHash()
    })

    window.addEventListener('hashchange', e => {
        authHash()
    })

    const formAuthEmail = document.querySelector('#auth-email')

    formAuthEmail.addEventListener('submit', e => {
        e.preventDefault()

        const btnSubmit = e.target.querySelector('[type=submit]')
        btnSubmit.disabled = true

        sessionStorage.setItem('email', formAuthEmail.email.value)
        location.hash = '#login'
        btnSubmit.disabled = false
    })

    
    //criando variaveis para armazenar a tag que contem o id register
    const formAuthRegister = document.querySelector("#register")
    //criando variavel para armazenar a tag que contem a classe alert e danger 
    //dentro do formAuthRegister ou seja dentro do #register
    const alertDangerRegister = formAuthRegister.querySelector(".alert.danger")

    //atribuindo ao evento submit do botão dentro do formulario #register
    formAuthRegister.addEventListener('submit', e => {
        //previnindo o envio padrão
        e.preventDefault()
        //quando entrar dentro do formulario não aparece nenhuma mensagem
        hideAlertError(formAuthRegister)
        //variavel que contem os valores do formulario #register
        const values = getFormValues(formAuthRegister)

        //varavel de firebase.auth() que contem um metodo para criar um usauario a partir de email e senha
        auth
            //pegando os valores de email e senha que vem do formulario
            .createUserWithEmailAndPassword(values.email, values.password)
            //promesse que contem a resposta vinda do formulario
            .then(response => {
                //varavel que tem os dados do usuario
                const { user } = response

                //atualizando valores do usuario para usar na aplicação
                user.updateProfile({
                    displayName: values.name
                })

                //redirecionando para a página index após logar com sucesso
                window.location.href = "/"

            })
            .catch(err => {

                //função do utils.js
                showAlertError(formAuthRegister, err)

                //jeito sem função no utils,js
                //pegando a mensagem de erro e jogando na tag
                //alertDangerRegister.innerHTML = err.message
                //mostrando a mensagem de erro novamente
                //alertDangerRegister.style.display = "flex"

            })
    })

    //criando variaveis para armazenar a tag que contem o id login
    const formAuthLogin = document.querySelector("#login")

    formAuthLogin.addEventListener("submit", e => {

        e.preventDefault()

        hideAuthForms(formAuthLogin)

        const values = getFormValues(formAuthLogin)

        auth
            .signInWithEmailAndPassword(values.email, values.password)
            .then(response => {
                
                //redirecionando para a página index após logar com sucesso
                window.location.href = "/"
            })
            .catch(err => {
                showAlertError(formAuthLogin, err)
            })
    })

    /**
     * Configurando o envio de esqueceu a senha
     * pegando o wrap que tem o id forget
     */
    const formForget = document.querySelector("#forget");

    //pegando a seleção acima e escutando o evento submit do botão
    formForget.addEventListener("submit", (e) => {
        //evitando o envio padrão do botão
        e.preventDefault();

        //pegando da seleção #forget as classes e atributos abaixo que contém dentro dela
        const btnSubmit = formForget.querySelector("[type=submit]");
        const message = formForget.querySelector(".message");
        const field = formForget.querySelector(".field");
        const actions = formForget.querySelector(".actions");

        //escondendo as tags de erro dentro do formulario
        hideAlertError(formForget);

        //pegando os valores de dentro do formulario
        const values = getFormValues(formForget);

        //pegando a div com a classe message e ocultando
        message.style.display = "none";

        //desabilitando o btão de envio e escrevendo enviando nele
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = "Enviando...";
        
        //função do firebase para envio de auterar senha
        //pegando os valores que está vindo do campo email
        auth.sendPasswordResetEmail(values.email)
            //usando promesse then caso de sucesso
            //esconde o action e o campo field
            //mostra a mensagem que foi enviado
            .then(() => {
                field.style.display = "none";
                actions.style.display = "none";
                message.style.display = "flex";
            })
            //usando cath caso der erro
            //mostra o campo onde está o email
            //mostra o campop actions
            //mostra o erro no formulario
            .catch((error) => {
                field.style.display = "flex";
                actions.style.display = "flex";

                //usa duas pois a função já espera um erro como aqui estou usando uma mais chama esse erro
                showAlertError(formForget)(error);
            })
            //usando o finally quando termina
            //habilita o botão
            //e mostra enviar dentro dele
            .finally(() => {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = "Enviar";
            });
    });

    const formReset = document.querySelector("#reset");

    formReset.addEventListener("submit", (e) => {
        e.preventDefault();

        const btnSubmit = formReset.querySelector("[type=submit]");

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = "Redefinindo...";

        //pegando os valores que vem do formulario
        const { oobCode } = getQueryString();
        const { password } = getFormValues(formReset);

        hideAlertError(formReset);

        //validando o código que esta em oobcode do firebase
        auth.verifyPasswordResetCode(oobCode)
            //se der certo ele confirma 
            //quando fizer estiver mais de uma promisse pode encadear varias promisses
            .then(() => auth.confirmPasswordReset(oobCode, password))
            .then(() => {
                hideAuthForms();
                showAuthForm("login");
            })
            .catch(showAlertError(formReset))
            .finally(() => {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = "Redefinir";
            });
    });

}