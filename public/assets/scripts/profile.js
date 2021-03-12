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
            const stateElement = page.querySelector("#state")

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

                    let logradouro = '';
                    let bairro = '';
                    let cidade = '';
                    let estado = '';

                    if (data.logradouro) {
                        logradouro = data.logradouro;
                        numberElement.focus();
                    } else {
                        addressElement.focus();
                    }
                    if (data.bairro) {
                        bairro = data.bairro;
                    }
                    if (data.localidade) {
                        cidade = data.localidade;
                    }
                    
                    switch (data.uf) {
                        case "AC":
                            estado = "Acre";
                            break;
                        case "AL":
                            estado = "Alagoas";
                            break;
                        case "AP":
                            estado = "Amapá";
                            break;
                        case "AM":
                            estado = "Amazonas";
                            break;
                        case "BA":
                            estado = "Bahia";
                            break;
                        case "CE":
                            estado = "Ceará";
                            break;
                        case "DF":
                            estado = "Distrito Federal";
                            break;
                        case "ES":
                            estado = "Espírito Santo";
                            break;
                        case "GO":
                            estado = "Goiás";
                            break;
                        case "MA":
                            estado = "Maranhão";
                            break;
                        case "MT":
                            estado = "Mato Grosso";
                            break;
                        case "MS":
                            estado = "Mato Grosso do Sul";
                            break;
                        case "MG":
                            estado = "Minas Gerais";
                            break;
                        case "PA":
                            estado = "Pará";
                            break;
                        case "PB":
                            estado = "Paraíba";
                            break;
                        case "PR":
                            estado = "Paraná";
                            break;
                        case "PE":
                            estado = "Pernambuco";
                            break;
                        case "PI":
                            estado = "Piauí";
                            break;
                        case "RJ":
                            estado = "Rio de Janeiro";
                            break;
                        case "RN":
                            estado = "Rio Grande do Norte";
                            break;
                        case "RS":
                            estado = "Rio Grande do Sul";
                            break;
                        case "RO":
                            estado = "Rondônia";
                            break;
                        case "RR":
                            estado = "Roraima";
                            break;
                        case "SC":
                            estado = "Santa Catarina";
                            break;
                        case "SP":
                            estado = "São Paulo";
                            break;
                        case "SE":
                            estado = "Sergipe";
                            break;
                        case "TO":
                            estado = "Tocantins";
                            break;
                    }

                    console.log(estado)

                    setFormValues(formElement, {
                        address: logradouro,
                        district: bairro,
                        city: cidade,
                        state: estado,
                    })


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
                        showAlert("Sucesso: Seus dados foram salvos com sucesso", "success");
                        setTimeout(()=>{
                            window.location.href = 'index.html';
                        }, 5000)
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
