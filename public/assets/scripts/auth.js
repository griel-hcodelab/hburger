import firebase from './firebase-app'
import { getFormValues } from './utils'


const authPage = document.querySelector('body#auth')

if(authPage) {

    const auth = firebase.auth()
    const formAuthRegister = document.querySelector('#form-register')
    const formAuthLogin = document.querySelector('#form-login')
    const formForget = document.querySelector('#form-forget')

    if (formAuthRegister) {

        formAuthRegister.addEventListener('submit', e => {

            e.preventDefault()
    
            const values = getFormValues(formAuthRegister)
            const btnSubmit = formAuthRegister.querySelector("[type=submit]");

            btnSubmit.disabled = true
            btnSubmit.innerHTML = "Cadastrando..."
    
            auth
                .createUserWithEmailAndPassword(values.email, values.password)
                .then(response => {
    
                    const { user } = response
    
                    user.updateProfile({
                        displayName: values.name
                    })
    
                    window.location.href = 'index.html'
                })
                .catch(error => {
                    alert("Erro ao Cadastrar")
                }).finally(() => {
                    btnSubmit.disabled = false
                    btnSubmit.innerHTML = "Enviar"
                })
        })
    }
    

    if(formAuthLogin) {

        formAuthLogin.addEventListener('submit', e => {

            e.preventDefault()
    
            const values = getFormValues(formAuthLogin)
            const btnSubmit = formAuthLogin.querySelector("[type=submit]");

            btnSubmit.disabled = true
            btnSubmit.innerHTML = "Logando..."
    
            auth
                .signInWithEmailAndPassword(values.email, values.password)
                .then(response => {
                    window.location.href = 'index.html';
                })
                .catch(error => {
                    alert("Email ou senha não existem", error)
                }).finally(() => {
                    btnSubmit.disabled = false
                    btnSubmit.innerHTML = "Enviar"
                })
        })
    }

    if (formForget) {
        
        formForget.addEventListener('submit', e => {

            e.preventDefault()

            const btnSubmit = formForget.querySelector("[type=submit]");

            const values = getFormValues(formForget)

            btnSubmit.disabled = true
            btnSubmit.innerHTML = "Enviando E-mail..."

            auth.sendPasswordResetEmail(values.email)
                .then(() => {
                    window.location.href = 'login.html'
                })
                .catch((error) => {
                    alert('Ocorreu um erro', error)
                })
                .finally(() => {
                    btnSubmit.disabled = false
                    btnSubmit.innerHTML = "Enviar"
                })

        })
    }

}