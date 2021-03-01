import IMask from 'imask';
import { checkInput, hideAlert, showAlert, verifyLogin } from './utils';
import firebase from './firebase-app';

const auth = firebase.auth();
const db = firebase.firestore();

document.querySelectorAll("#app").forEach((page)=>{
    auth.onAuthStateChanged(user => {
        if (user) {
            const creditCardNumber = page.querySelector("[name=number]");
            const creditCardValidate = page.querySelector("[name=validate]");
            const creditCardCVV = page.querySelector("[name=code]");

            const inputs = page.querySelectorAll("input");
            const installments = page.querySelector("[name=installments]")
            const saveOrderBtn = page.querySelector("#paymentBtn");

            let quantity = 2;
            let value = parseFloat(129.90);

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

            if (installments) {
                installments.innerHTML = '';
                for (let i = 1; i <= 12; i++) {
                    const option = document.createElement("option");
                    let result = eval(value / i);
                    option.innerHTML = `${i}x sem juros de ${result.toLocaleString('pt-br',{
                        style: 'currency',
                        currency: 'BRL'
                    })}`
                    installments.append(option);
                }
            }

            if (saveOrderBtn) {
                saveOrderBtn.addEventListener("click", (e)=>{
                    e.preventDefault();
                    let status;
                    inputs.forEach((input)=>{
                        if (checkInput(input) === false) {
                            showAlert("Verifique se todos os campos estão preenchidos.", "error")
                            status = false;
                        } else {
                            hideAlert("error");
                            status = true;
                        }
                    });
                    if (status) {
                        saveOrderBtn.disabled = true;
                        saveOrderBtn.innerHTML = "Aguarde..."
                        saveOrder(quantity, value);
                    }
                });
            }
        } else {
            window.location.href = "login.html";
        }
    })

    
});

    
const saveOrder = (q, v)=>{

    auth.onAuthStateChanged(user => {
        if (user) {

            
            const data = new Date();
            const year = data.getFullYear().toString();
            const month = data.getMonth().toString();
            const day = data.getDate().toString();
            const hour = data.getHours().toString();
            const minute = data.getMinutes().toString();
            const second = data.getSeconds().toString();
            let orderID = year + month + day + hour + minute + second;
            
            const pedidos = db.collection("pedidos").doc(orderID);
        
            pedidos.set({
                cliente_id: user.uid,
                data: `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`,
                id: parseInt(orderID),
                itens: q,//uantity
                valor: v//alue
        
            })
            .then(() => {
                showAlert("Sucesso: Seu hambúrger foi registrado! Você será direcionado aos seus pedidos.", "success");
                setTimeout(()=>{
                    window.location.href = "orders.html";
                }, 2000)
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });

            
        } else {
            window.location.href = "login.html";
        }
    });

    
}