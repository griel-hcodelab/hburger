import firebase from './firebase-app'
import { appendTemplate, formatPrice } from './utils';
const db = firebase.firestore();
const auth = firebase.auth();

let labels = [];
let removeBtns = [];
let userID;

const index = document.querySelectorAll(".carte")
if (index) {
    index.forEach((page)=>{

        //Pegando o ID do usuário logado
        auth.onAuthStateChanged(user => {
            if (user) {
                userID = user.uid;
                renderTray()
            }
        })

        //Variáveis da página
        const footer = page.querySelector("footer");
        const saveBurger = page.querySelector("#saveBurger");
        

        //Renderizando Lanches
        const renderBurger = (burger)=>{
            const ul = page.querySelector("ul.burger");
            ul.innerHTML = '';
            burger.forEach((item)=>{
                appendTemplate(ul, "li", `
                    <label data-id="${item.id}" data-burgername="${item.name}" data-name="${item.name}" data-price="${item.price}">
                        <input type="radio" name="burger" id="burger-${item.id}" />
                        <span></span>
                        <h3>${item.name}</h3>
                        <div>${formatPrice(item.price)}</div>
                    </label>
                `);
            });
        }

        //Renderizando Pães
        const renderBread = (bread)=>{
            const ul = page.querySelector("ul.bread");
            ul.innerHTML = '';
            bread.forEach((item)=>{
                appendTemplate(ul, "li", `
                    <label data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                        <input type="radio" name="bread" id="bread-${item.id}" />
                        <span></span>
                        <h3>${item.name}</h3>
                        <div>${formatPrice(item.price)}</div>
                    </label>
                `);
            });
        }

        //Renderizando Adicionais
        const renderAditionals = (aditionals)=>{
            const ul = page.querySelector("ul.aditionals");
            ul.innerHTML = '';
            aditionals.forEach((item)=>{
                appendTemplate(ul, "li", `
                    <label data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                        <input type="checkbox" name="item" id="aditional-${item.id}" />
                        <span></span>
                        <h3>${item.name}</h3>
                        <div>${formatPrice(item.price)}</div>
                    </label>
                `);
            });
            updateFields();
        }

        //Renderizando Bandeja
        const renderTray = (items = null)=>{
            const ul = page.querySelector("aside section ul");
            ul.innerHTML = '';
            db.collection(`pedidos/${userID}/bandeja`).onSnapshot(snapshot => {
                snapshot.forEach((item)=>{
                    appendTemplate(ul, "li", `
                    <div>${item.data().burgerName}</div>
                    <div>${formatPrice(parseFloat(item.data().prices))}</div>
                    <button type="button" id="${item.data().trayID}" aria-label="Remover Hamburguer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="black"/>
                        </svg>
                    </button>
                    `);
                    renderTrayValues();
                })
             });
             updateFields();
        }

        //Renderizando valores da bandeja
        const renderTrayValues = ()=>{
            let items = page.querySelectorAll("aside section ul li").length;
            if (items === 1) {
                page.querySelector("#app > aside > header > strong > small").innerHTML = `${items} H-Burger`
            } else {
                page.querySelector("#app > aside > header > strong > small").innerHTML = `${items} H-Burgers`
            }

            let values = [];
            let valuesHtml = page.querySelectorAll("aside > section > ul > li > div:nth-child(2)");
            valuesHtml.forEach((item)=>{
                values.push(parseFloat(item.innerHTML.replace("R$&nbsp;","").replace(",",".")));
            });
            let totalValue = values.reduce((total, item)=>{
                return eval(total+item)
            })

            page.querySelector("aside > footer > div.price").innerHTML = `
                <small>Subtotal </small> <span>${formatPrice(totalValue)}</span>
            `;
            removeBtns = page.querySelectorAll("[aria-label='Remover Hamburguer']");
            removeBtns.forEach((item)=>{
                item.addEventListener("click", (e)=>{
                    deleteTray(item.id);
                });
            });
        }
   
        //Buscando do Banco de Dados
        db.collection("burgers").onSnapshot(snapshot => {
            const burger = [];
            snapshot.forEach(item => {
              burger.push(item.data());
            })
            renderBurger(burger);
        });
        db.collection("breads").onSnapshot(snapshot => {
            const bread = [];
            snapshot.forEach(item => {
              bread.push(item.data());
            })
            renderBread(bread);
        });
        db.collection("aditionals").onSnapshot(snapshot => {
            const aditionals = [];
            snapshot.forEach(item => {
              aditionals.push(item.data());
            })
            renderAditionals(aditionals);
        });
        
        //Atualizando Campos
        const updateFields = ()=>{
            labels.push(page.querySelectorAll(".category li"));
            activateClicks();
        }

        //Salvando Hamburger
        saveBurger.addEventListener("click", (e)=>{
            e.preventDefault();
            saveBurgerFn();
        })
        const saveBurgerFn = ()=>{
            const selected = page.querySelectorAll("input:checked");

            let burger = [];

            let itemsPrice = [];

            let burgerName = page.querySelector("ul.burger").querySelector("input:checked").closest("label").dataset.burgername;

            selected.forEach((item)=>{
                let price = parseFloat(item.closest("label").dataset.price);
                itemsPrice.push(price);
            });

          
            let trayNumber = Math.floor(Math.random() * 50000) + 1000;
            const tray = db.collection(`pedidos/${userID}/bandeja`).doc(trayNumber.toString());

            let subTotal = itemsPrice.reduce((total, item)=>{
                return eval(total+item)
            });

            tray.set({
                "burgerName":burgerName,
                "prices":subTotal,
                "trayID":trayNumber
            })
            .then(() => {
                renderTray()
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }

        //Apagando bandeja
        const deleteTray = (trayID)=>{


            db.collection(`pedidos/${userID}/bandeja`).doc(trayID).delete()
            .then(() => {
                document.querySelector("aside section ul").innerHTML = "Apagando seu HBurger..."
                window.location.reload();
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }

        //Atualizando os campos para ouvir o clique
        const activateClicks = ()=>{
            if (labels[1]) {
                labels[1].forEach((item)=>{
                    item.addEventListener("click", (e)=>{
                        document.querySelector("footer").classList.add("show")
                        if (page.querySelectorAll("input:checked").length >= 2) {
                            saveBurger.disabled = false;
                        }
                    });
                });
            }
           
        }


        //Salvando a bandeja e levando pro pagamento
        const payBtn = page.querySelector("[aria-label='Pagar']");
        payBtn.addEventListener("click", (e)=>{
            sessionStorage.setItem("items", parseInt(page.querySelector("aside > header > strong > small").innerHTML));
            sessionStorage.setItem("price", document.querySelector("aside > footer > div.price > span").innerHTML.replace("R$&nbsp;","").replace(",","."))
            goToPay();
        });
        const goToPay = ()=>{

            db.collection(`pedidos/${userID}/bandeja`).onSnapshot(snapshot => {

                snapshot.forEach((item)=>{
                    let deleteTrayId = item.data().trayID;

                    db.collection(`pedidos/${userID}/bandeja`).doc(deleteTrayId.toString()).delete()
                    .then(() => {
                        page.querySelector("aside > section > ul").innerHTML = "<img src='../assets/images/loading.svg' /><br/><p>Recebemos o seu pedido! Agora, você será direcionado ao pagamento.</p>";
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    });
                })
            })
            setTimeout(()=>{
                window.location.href = "pay.html"
            },2000);

        }
    });



    

}


