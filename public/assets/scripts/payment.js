import IMask from 'imask';
import { checkInput } from './utils';
//import { firebase } from './firebase-app';

document.querySelectorAll("#app").forEach((page)=>{
    //Definindo as constantes
    const creditCardNumber = page.querySelector("[name=number]");
    const creditCardValidate = page.querySelector("[name=validate]");
    const creditCardCVV = page.querySelector("[name=code]");

    const inputs = page.querySelectorAll("input");
    const saveOrderBtn = page.querySelector("footer button");

    if (inputs) {
        inputs.forEach((input)=>{ 
            switch (input.name) {
                case "number":
                    new IMask(creditCardNumber, {
                        mask: "0000-0000-0000-0000"
                    });
                break;
                case "validate":
                    new IMask(creditCardValidate, {
                        mask: "00/00"
                    });
                break;
                case "code":
                    new IMask(creditCardCVV, {
                        mask: "000[0]"
                    });
                break;
    
            }
        });
    }

    if (saveOrderBtn) {
        saveOrderBtn.addEventListener("click", (e)=>{
            e.preventDefault();
            inputs.forEach((input)=>{
                if (checkInput(input) === false) {
                    document.querySelector("#errorField").style.display = "flex";
                    document.querySelector("#errorField").innerHTML = "Verifique se todos os campos estão preenchidos."
                } else {
                    document.querySelector("#errorField").style.display = "none";
                }
            });
        });
    }
});

/*function saveOrder(){
    const db = firebase.firestore();
    const auth = firebase.auth();


}*/