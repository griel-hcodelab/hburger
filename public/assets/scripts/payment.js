import IMask from 'imask';
import { checkInput, hideAlert, showAlert, verifyLogin } from './utils';
import firebase from './firebase-app';

const db = firebase.firestore();
const auth = firebase.auth();

document.querySelectorAll("#app").forEach((page)=>{
    auth.onAuthStateChanged(user => {
        if (user) {
            const creditCardNumber = page.querySelector("[name=number]");
            const creditCardValidate = page.querySelector("[name=validate]");
            const creditCardCVV = page.querySelector("[name=code]");
            const creditCardName = page.querySelector("[name=name]");

            const inputs = page.querySelectorAll("input");
            const installments = page.querySelector("[name=installments]")
            const saveOrderBtn = page.querySelector("#paymentBtn");

            let quantity = sessionStorage.getItem('items');
            let value = parseFloat(sessionStorage.getItem('price'));

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
                for (let i = 1; i <= 6; i++) {
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

                    if (creditCardNumber.value.length < 19) {
                        showAlert("O número do cartão de crédito está incorreto.", "error");
                        creditCardNumber.focus();
                        status = false;
                    } else if (creditCardValidate.value.length < 5) {
                        showAlert("A validade do cartão de crédito está incorreta.", "error");
                        creditCardValidate.focus();
                        status = false;
                    } else if (creditCardCVV.value.length < 3) {
                        showAlert("O código de segurança do cartão está incorreto.", "error");
                        creditCardCVV.focus();
                        status = false;
                    } else if (creditCardName.value == '') {
                        showAlert("Você precisa digitar seu nome.", "error");
                        creditCardName.focus();
                        status = false;
                    } else {
                        status = true;
                        hideAlert("error");
                    }

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
                        paymentProcess('Por favor, aguarde...');
                        saveOrder(quantity, value);
                    }
                });
            }
        } else {
            window.location.href = "login.html";
        }
    })

    
});

const paymentProcess = (message)=>{
    document.querySelector("main section").innerHTML = `
    <div class="paymentProcess">
    <img src='../assets/images/loading.svg' />
    <p>${message}</p>
    </div>
    `;
}

    
const saveOrder = (q, v)=>{

    auth.onAuthStateChanged(user => {
        if (user) {

            paymentProcess("Processando seu pagamento...");

            const data = new Date();
            const year = data.getFullYear().toString();
            const month = data.getMonth().toString();
            const day = data.getDate().toString();
            const hour = data.getHours().toString();
            const minute = data.getMinutes().toString();
            const second = data.getSeconds().toString();
            let orderID = year + month + day + hour + minute + second;
            
            const pedidos = db.collection(`pedidos/${user.uid}/orders`).doc(orderID);
        
            pedidos.set({
                cliente_id: user.uid,
                data: `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`,
                id: parseInt(orderID),
                itens: q,//uantity
                valor: v//alue
        
            })
            .then(() => {
                paymentProcess("Pagamento aprovado! Você será direcionado ao seus pedidos.");
                setTimeout(()=>{
                    window.location.href = "orders.html";
                }, 2000)
            })
            .catch((error) => {

            });

            
        } else {
            window.location.href = "login.html";
        }
    });

    
}