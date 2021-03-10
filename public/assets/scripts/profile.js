import axios from 'axios'
import IMask from 'imask'
import { setFormValues, showAlert, getFormValues } from './utils'
import firebase from './firebase-app';

document.querySelectorAll("#app").forEach(page => {


    const db = firebase.firestore();
    const formElement = page.querySelector('form')
    const zipcodeElement = page.querySelector("#zipcode")
    const phoneElement = page.querySelector("#phone")
    const numberElement = page.querySelector("#number")
    const documentElement = page.querySelector("#document")

    new IMask(zipcodeElement, {
        mask: '00000-000'
    })

    new IMask(phoneElement, {
        mask: '(00) 0000-0000[0]'
    })

    new IMask(documentElement, {
        mask: '000.000.000-00'
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
            showAlert("Desculpe algo de errado não está certo, verifique e tente novamente!", "error")
        }).finally(() => {
            showAlert("Cadastro efetuado com sucesso", "success")
        })
    }

    //if (formElement) {
    //    formElement.addEventListener('submit', e => {
    //        e.preventDefault() 
    //    })
    //} 

    zipcodeElement.addEventListener('keyup', e => {

        if (e.key === "Enter") {
            searchZipcode()
        } else if(e.target.value.length > 8) {
            searchZipcode()
        }

    })

})
