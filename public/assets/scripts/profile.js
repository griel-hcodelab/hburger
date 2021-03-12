import axios from 'axios'
import IMask from 'imask'
import { setFormValues, showAlert, getFormValues } from './utils'
import firebase from './firebase-app';

document.querySelectorAll("#app").forEach(page => {

    const auth = firebase.auth();
    let userID; 

    auth.onAuthStateChanged(user => {
        if (user) {
            userID = user.uid;

            const db = firebase.firestore();
            const formElement = page.querySelector('form')
            const zipcodeElement = page.querySelector("#zipcode")
            const phoneElement = page.querySelector("#phone")
            const numberElement = page.querySelector("#number")
            const documentElement = page.querySelector("#document")
            const dateElement = page.querySelector("#birth_at")

            new IMask(zipcodeElement, {
                mask: '00000-000'
            })

            new IMask(phoneElement, {
                mask: '(00) 0000-0000[0]'
            })

            new IMask(documentElement, {
                mask: '000.000.000-00'
            })

            new IMask(dateElement, {
                mask: '00/00/0000'
            })

            const searchZipcode = () => {

                const {value} = zipcodeElement;
                
                axios({
                    url: `https://viacep.com.br/ws/${value.replace("-", "")}/json/`
                }).then(({data}) => {

                    setFormValues(formElement, {
                        address: data.logradouro,
                        district: data.bairro,
                        city: data.localidade,
                        state: data.uf,
                    })

                    numberElement = focus()

                }).catch(error => {
                    
                })
            }

            const perfil = db.collection(`perfil`).doc(userID);

            if (formElement) {
                formElement.addEventListener('submit', e => {
                    
                    perfil.set({
                        "name": document.querySelector("[name='name']").value,
                        "birth_at": document.querySelector("[name='birth_at']").value,
                        "document": document.querySelector("[name='document']").value,
                        "zipcode": document.querySelector("[name='zipcode']").value,
                        "address": document.querySelector("[name='address']").value,
                        "number": document.querySelector("[name='number']").value,
                        "phone": document.querySelector("[name='phone']").value,
                        "district": document.querySelector("[name='district']").value,
                        "city": document.querySelector("[name='city']").value,
                        "state": document.querySelector("[name='state']").value
                    })
                    .then(() => {
                        showAlert("Sucesso: Cadastro Efetuado com sucesso", "success");
                    })
                    .catch((error) => {
                        showAlert("Desculpe algo de errado não está certo, verifique e tente novamente!", "error")
                    });
                })
            } 



            zipcodeElement.addEventListener('keyup', e => {

                if (e.key === "Enter") {
                    searchZipcode()
                } else if(e.target.value.length > 8) {
                    searchZipcode()
                }

            })


            db.collection(`perfil`).doc(userID).get(

            ).then((doc) => {
                if(doc) {
                    document.querySelector("[name='name']").value = doc.data().name
                    document.querySelector("[name='birth_at']").value = doc.data().birth_at
                    document.querySelector("[name='document']").value = doc.data().document
                    document.querySelector("[name='zipcode']").value = doc.data().zipcode
                    document.querySelector("[name='address']").value = doc.data().address
                    document.querySelector("[name='district']").value = doc.data().district
                    document.querySelector("[name='city']").value = doc.data().city
                    document.querySelector("[name='state']").value = doc.data().state
                    document.querySelector("[name='number']").value = doc.data().number 
                    document.querySelector("[name='phone']").value = doc.data().phone 
                }  
            })

        } else {
            window.location.href = 'login.html'
        }
    })

})
