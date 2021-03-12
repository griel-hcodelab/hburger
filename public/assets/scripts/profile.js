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

            const nameElement = page.querySelector("#name")
            const birthElement = page.querySelector("#birth_at")
            const addressElement = page.querySelector("#address")
            const districtElement = page.querySelector("#district")
            const cityElement = page.querySelector("#city")
            const stateElement = page.querySelector("#city")

            const zipcodeElement = page.querySelector("#zipcode")
            const phoneElement = page.querySelector("#phone")
            const numberElement = page.querySelector("#number")
            const documentElement = page.querySelector("#document")
            const dateElement = page.querySelector("#birth_at")

            if (zipcodeElement) {
                new IMask(zipcodeElement, {
                    mask: '00000-000'
                })
            }
            
            if (phoneElement) {
                new IMask(phoneElement, {
                    mask: '(00) 0000-0000[0]'
                })
            }

            if (documentElement) {
                new IMask(documentElement, {
                    mask: '000.000.000-00'
                })
            }

            if (dateElement) {
                new IMask(dateElement, {
                    mask: '00/00/0000'
                })
            }
            

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


            

            if (formElement) {
                formElement.addEventListener('submit', e => {
                    e.preventDefault();
                    const perfil = db.collection(`perfil`).doc(userID);
                    perfil.set({
                        "name": nameElement.value,
                        "birth_at": birthElement.value,
                        "document": documentElement.value,
                        "zipcode": zipcodeElement.value,
                        "address": addressElement.value,
                        "number": numberElement.value,
                        "phone": phoneElement.value,
                        "district": districtElement.value,
                        "city": cityElement.value,
                        "state": stateElement.value
                    })
                    .then(() => {
                        showAlert("Sucesso: Cadastro Efetuado com sucesso", "success");
                    })
                    .catch((error) => {
                        showAlert("Desculpe algo de errado não está certo, verifique e tente novamente!", "error")
                    });
                })
            } 


            if (zipcodeElement) {
                zipcodeElement.addEventListener('keyup', e => {

                    if (e.key === "Enter") {
                        searchZipcode()
                    } else if(e.target.value.length > 8) {
                        searchZipcode()
                    }
    
                })
            }
            


            db.collection(`perfil`).doc(userID).get(

            ).then((doc) => {
                if(doc.data()) {
                    if (nameElement) {
                        nameElement.value = doc.data().name
                    }
                    
                    if (birthElement) {
                        birthElement.value = doc.data().birth_at
                    }
                    
                    if (documentElement) {
                        documentElement.value = doc.data().document
                    }
                    
                    if (zipcodeElement) {
                        zipcodeElement.value = doc.data().zipcode
                    }
                    
                    if (addressElement) {
                        addressElement.value = doc.data().address
                    }
                    
                    if (districtElement) {
                        districtElement.value = doc.data().district
                    }
                    
                    if (cityElement) {
                        cityElement.value = doc.data().city
                    }
                    
                    if (stateElement) {
                        stateElement.value = doc.data().state
                    }
                    
                    if (numberElement) {
                        numberElement.value = doc.data().number
                    }
                    
                    if (phoneElement)  {
                        phoneElement.value = doc.data().phone 
                    }
                    
                }  
            })

        } else {
            window.location.href = 'login.html'
        }
    })

})
