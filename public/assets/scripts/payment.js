import IMask from 'imask';
import { appendTemplate, checkInput, hideAlert, showAlert, verifyLogin } from './utils';
import firebase from './firebase-app';

const db = firebase.firestore();
const auth = firebase.auth();

document.querySelectorAll("#app.payment").forEach((page)=>{
    auth.onAuthStateChanged(user => {
        if (user) {
            const creditCardNumber = page.querySelector("[name=number]");
            const creditCardValidate = page.querySelector("[name=validate]");

            const validate_month = page.querySelector("#validate_month");
            const validate_year = page.querySelector("#validate_year");


            const creditCardCVV = page.querySelector("[name=code]");
            const creditCardName = page.querySelector("[name=name]");

            const inputs = page.querySelectorAll("input");
            const installments = page.querySelector("[name=installments]")
            const saveOrderBtn = page.querySelector("#paymentBtn");

            const quantity = sessionStorage.getItem('items');
            const value = parseFloat(sessionStorage.getItem('price'));
            const itemsName = sessionStorage.getItem('itemsName')
            const itemsPrice = sessionStorage.getItem('itemsPrice')

            if (!quantity || !value ) {
                showAlert("Alguma coisa deu errada com seu pedido. Você será direcionado à página inicial", 'error');
                setTimeout(()=>{
                    window.location.href = '/';
                }, 2000);
            }

            if (validate_month) {
                for (let i = 1; i <= 12; i++) {

                    appendTemplate(validate_month, "option", `${i}`, {
                        'value':`${i}`
                    });
                    
                }
            }

            if (validate_year) {
                const year = new Date().getFullYear();
                for (let i = year; i <= year + 10; i++) {

                    appendTemplate(validate_year, "option", `${i}`, {
                        'value':`${i}`
                    });
                    
                }
            }

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
                    } else if (validate_month.selectedIndex === 0) {
                        showAlert("O mês de validade do cartão de crédito está incorreta.", "error");
                        validate_month.focus();
                        status = false;
                    } else if (validate_year.selectedIndex === 0) {
                        showAlert("O ano de validade do cartão de crédito está incorreta.", "error");
                        validate_year.focus();
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

                   
                    if (status) {
                        saveOrderBtn.disabled = true;
                        saveOrderBtn.innerHTML = "Aguarde..."
                        paymentProcess('Por favor, aguarde...');
                        saveOrder(quantity, value, itemsName, itemsPrice);
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

    
const saveOrder = (quantity, value, itemName, itemPrice)=>{

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
                timestamp: Date.now() / 1000 | 0 + 100,
                id: parseInt(orderID),
                itens: quantity,
                valor: value,
                itensDetalhe: itemName,
                itensValor: itemPrice
        
            })
            .then(() => {
                paymentProcess("Seu pagamento está sendo processado. Você será direcionado ao seus pedidos.");
                sessionStorage.clear('items');
                sessionStorage.clear('price');
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