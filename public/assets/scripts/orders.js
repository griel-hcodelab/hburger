import firebase from './firebase-app'
import { appendTemplate, formatPrice, hideAlert, showAlert } from './utils';
const db = firebase.firestore();
const auth = firebase.auth();

const order = document.querySelectorAll(".orders");

let userLogged;

if (order) {
    order.forEach((page)=>{
        let btnDelete;
        let btnDeleteConfirm;
        let btnDeleteRevert;

        auth.onAuthStateChanged(user => {
            if (user) {

                userLogged = user.uid;

                db.collection(`pedidos/${userLogged}/orders`).onSnapshot(snapshot => {
    
                    const orders = [];
                
                    snapshot.forEach(item => {
                
                      orders.push(item.data());
                
                    })
                
                    renderOrder(orders);
                
                });
            } else {
                window.location.href = "login.html";
            }
        });
        
        const renderOrder = (orders = [])=>{


            const ul = page.querySelector("#list-orders");
    
            ul.innerHTML = '';

            orders.forEach((item)=>{
                appendTemplate(ul, "li", `
                <div class="confirm item${item.id}" data-time=${item.timestamp}>

                    <p>Você quer mesmo apagar este pedido?</p>
                    <div class="wrap">
                        <button type="button" class="confirmYes ${item.id}">Sim, eu quero apagar</button>
                        
                        <button type="button" class="confirmNo ${item.id}">Pensando bem, deixe ele aí...</button>
                        
                    </div>

                </div>
                <div class="id">${item.id}</div>
                <div class="content">
                    <div class="title">Detalhes do Pedido</div>
                    <ul>
                         <li>
                             <span>Data:</span>
                             <span>${item.data}</span>
                         </li>
                         <li>
                             <span>Valor:</span>
                             <span>${formatPrice(item.valor)}</span>
                         </li>
                         <li>
                             <span>Itens:</span>
                             <span>${item.itens}</span>
                         </li>
                         <li>
                             <span>N°:</span>
                             <span>${item.id}</span>
                         </li>
                    </ul>
                </div>
                <div class="actions" id="act${item.id}">
                    <!--<button type="button" aria-label="Compartilhar">
                         <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M15 14.08C14.24 14.08 13.56 14.38 13.04 14.85L5.91 10.7C5.96 10.47 6 10.24 6 10C6 9.76 5.96 9.53 5.91 9.3L12.96 5.19C13.5 5.69 14.21 6 15 6C16.66 6 18 4.66 18 3C18 1.34 16.66 0 15 0C13.34 0 12 1.34 12 3C12 3.24 12.04 3.47 12.09 3.7L5.04 7.81C4.5 7.31 3.79 7 3 7C1.34 7 0 8.34 0 10C0 11.66 1.34 13 3 13C3.79 13 4.5 12.69 5.04 12.19L12.16 16.35C12.11 16.56 12.08 16.78 12.08 17C12.08 18.61 13.39 19.92 15 19.92C16.61 19.92 17.92 18.61 17.92 17C17.92 15.39 16.61 14.08 15 14.08Z" fill="#070D0D"/>
                         </svg>                            
                    </button>
                    <button type="button" aria-label="Detalhes">
                         <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M16 2V16H2V2H16ZM17.1 0H0.9C0.4 0 0 0.4 0 0.9V17.1C0 17.5 0.4 18 0.9 18H17.1C17.5 18 18 17.5 18 17.1V0.9C18 0.4 17.5 0 17.1 0ZM8 4H14V6H8V4ZM8 8H14V10H8V8ZM8 12H14V14H8V12ZM4 4H6V6H4V4ZM4 8H6V10H4V8ZM4 12H6V14H4V12Z" fill="#070D0D"/>
                         </svg>                            
                    </button>-->
                    <button type="button" id="delete${item.id}" aria-label="Excluir">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#070D0D"/>
                         </svg>                            
                    </button>
                </div>
                `);
            });



            const btnDelete = page.querySelectorAll("[aria-label='Excluir']");

            if (btnDelete) {
                btnDelete.forEach(btn=>{
                    btn.addEventListener("click", ()=>{
                        const box = page.querySelector(`.confirm.item${btn.id.split("delete")[1]}`);
       
                        if (parseInt(box.dataset.time) <= Date.now() / 1000 | 0) {
                            showAlert("Você não pode mais apagar este pedido", "error");
                            //btn.disabled = true;
                            setTimeout(() => {
                                hideAlert('error')
                            }, 2000);
                        } else {
                            
                            page.querySelector(`#act${btn.id.split('delete')[1]}`).style.display = "none"
                            box.style.width = "50%";
                            box.style.left = "-1px";
                        }

                    })
                })
            }

            btnDeleteConfirm = page.querySelectorAll(".confirmYes");

            if (btnDeleteConfirm) {
                btnDeleteConfirm.forEach((btn)=>{
                    btn.addEventListener("click", (e)=>{
                        deleteOrder(btn.classList[1]);
                    });
                })
            }

            btnDeleteRevert = page.querySelectorAll(".confirmNo");

            if (btnDeleteRevert) {
                btnDeleteRevert.forEach((btn)=>{
                    btn.addEventListener("click", (e)=>{
                        const box = document.querySelector(`.confirm.item${btn.classList[1]}`);
                        document.querySelector(`#act${btn.classList[1]}`).style.display = "flex"
                        box.style.width = "0px";
                        box.style.left = "-280px";
                    });


                })
            }
        }

        const deleteOrder = (orderID)=>{
            db.collection(`pedidos/${userLogged}/orders`).doc(orderID).delete().then(() => {
                //window.location.reload();
                showAlert("O pedido foi apagado com sucesso!","success");
                setTimeout(()=>{
                    hideAlert('success');
                }, 2000);
            }).catch((error) => {
                showAlert(`Não foi possível apagar este pedido. Esta mensagem de erro pode ajudar: ${error}`,"error");
            });
        }


        
    });

}