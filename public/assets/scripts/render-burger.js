import firebase from './firebase-app'
import { appendTemplate, formatPrice, hideAlert, showAlert } from './utils';
const db = firebase.firestore();
const auth = firebase.auth();

let labels;
let removeBtns = [];
var userID;

const index = document.querySelectorAll(".carte")
if (index) {
    index.forEach((page)=>{

        //Variáveis da página
        const footer = page.querySelector("footer");
        const saveBurger = page.querySelector("#saveBurger");
        const subTotalArea = footer.querySelector("h2");


        //Pegando o ID do usuário logado
        auth.onAuthStateChanged(user => {
            if (user) {
                userID = user.uid;
                db.collection(`pedidos/${userID}/bandeja`).onSnapshot(snapshot => {
                    const tray = [];
                    snapshot.forEach(item => {
                      tray.push(item.data());
                    })
                    renderTray(tray)
                });


            }
        })



        window.addEventListener("load", ()=>{
            updateHash();
        });
        window.addEventListener("hashchange", ()=>{
            updateHash();
        });

        const updateHash = ()=>{

            const steps = page.querySelectorAll(".category");
            steps.forEach((item)=>{
                item.classList.add("hide");
            })
            switch(window.location.hash) {
                case '#bread':
                    page.querySelector("#bread").classList.remove("hide");
                    saveBurger.innerHTML = 'Turbinar o seu Lanche ►';
                break
                case '#aditionals':
                    page.querySelector("#aditionals").classList.remove("hide")
                    saveBurger.innerHTML = 'Colocar na Bandeja √';
                break
                default:
                    page.querySelector("#burger").classList.remove("hide");
                    if (document.querySelectorAll("#burger input:checked").length === 0) {
                        saveBurger.innerHTML = 'Esperando você marcar o lanche';
                    } else {
                        saveBurger.innerHTML = 'Escolher o Pão ►';
                    }
                break;
            }
        }
        

        //Renderizando Lanches
        const renderBurger = (burger)=>{
            const ul = page.querySelector("ul.burger");
            ul.innerHTML = '';
            burger.forEach((item)=>{
                appendTemplate(ul, "li", `
                    <label data-id="${item.id}" data-burgername="${item.name}" data-name="${item.name}" data-price="${item.price}">
                        <input type="radio" name="burger" id="burger-${item.id}" />
                        <span></span>
                        <h3>${item.name} <span>(${item.detail})</span></h3>
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
                        <input type="radio" name="bread" ${item.checked} id="bread-${item.id}" />
                        <span></span>
                        <h3>${item.name} <span>(${item.detail})</span></h3>
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
            updateChecks();
            
        }

        //Renderizando Bandeja
        const renderTray = (tray)=>{
            const ul = page.querySelector("aside section ul");
            ul.innerHTML = '';

            tray.forEach((item)=>{
                appendTemplate(ul, "li", `
                <div>${item.burgerName}</div>
                <div>${formatPrice(parseFloat(item.prices))}</div>
                <button type="button" id="${item.trayID}" aria-label="Remover Hamburguer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="black"/>
                    </svg>
                </button>
                `);
            })

            let items = page.querySelectorAll("aside section ul li").length;
            if (items === 1) {
                page.querySelector("#app > aside > header > strong > small").innerHTML = `${items} H-Burger`
            } else {
                page.querySelector("#app > aside > header > strong > small").innerHTML = `${items} H-Burgers`
            }

            let values = [];
            let totalValue;

            let valuesHtml = page.querySelectorAll("aside > section > ul > li > div:nth-child(2)");
            valuesHtml.forEach((item)=>{
                values.push(parseFloat(item.innerHTML.replace("R$&nbsp;","").replace(",",".")));
            });

            if (values.length === 0) {
                totalValue = 0;
            } else {
                totalValue = values.reduce((total, item)=>{
                    return eval(total+item)
                })
            }
            
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

        //Salvando Hamburger
        saveBurger.addEventListener("click", (e)=>{
            e.preventDefault();
            
            switch(window.location.hash) {
                default:
                    window.location.hash = '#bread'
                break;
                case '#bread':
                    window.location.hash = '#aditionals'
                break;
                case '#aditionals':
                    saveBurgerFn();
                    page.querySelectorAll("input[type=checkbox]:checked").forEach((input)=>{
                        input.checked = false;
                    })
                    page.querySelectorAll("input[type=radio]:checked").forEach((input)=>{
                        input.checked = false;
                    })
                    page.querySelector("#bread input").checked = true;
                    saveBurger.disabled = true;
                    footer.classList.remove("show");
                    window.location.hash = '';
                    hideAlert('error');
                break;
            }
            
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
                subTotalArea.innerHTML = "R$ 0,00";
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }

        //Apagando bandeja
        const deleteTray = (trayID)=>{
            db.collection(`pedidos/${userID}/bandeja`).doc(trayID).delete()
            .then(() => {

            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }

        //Salvando a bandeja e levando pro pagamento
        const payBtn = page.querySelector("[aria-label='Pagar']");
        payBtn.addEventListener("click", (e)=>{


            let items = parseInt(page.querySelector("aside > header > strong > small").innerHTML)
            if (items === 0) {
                showAlert("Você não pode ir para o pagament se não tiver comprado nada!","error");
            } else {
                hideAlert('error');
                sessionStorage.setItem("items", parseInt(page.querySelector("aside > header > strong > small").innerHTML));
                sessionStorage.setItem("price", document.querySelector("aside > footer > div.price > span").innerHTML.replace("R$&nbsp;","").replace(",","."))
                goToPay();
            }

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

        //Atualizando os campos para ouvir o clique
        const updateChecks = ()=>{
            labels = page.querySelectorAll(".category ul li label input");

            for (let i = 0; i < labels.length; i++) {
                const element = labels[i];
                element.addEventListener("click", ()=>{
                    if (document.querySelector("#burger input:checked") && (!window.location.hash)) {
                        footer.classList.add("show");
                        saveBurger.disabled = false;
                        saveBurger.innerHTML = 'Escolher o Pão ►';
                    } 
                    
                    let inputCheckeds = page.querySelectorAll(".category input:checked");
                    updateSubTotal(inputCheckeds);
                })
                
            }
            
        }
        
        //Atualizando o subtotal
        const updateSubTotal = (input)=>{
            let subtotalValue = [];
            input.forEach((price)=>{
                subtotalValue.push(
                    parseFloat(
                        price.parentElement.querySelector("div")
                        .innerText.replace("R$","").replace(",",".")
                        )
                    );
            })
            subTotalArea.innerHTML = formatPrice(subtotalValue.reduce((item, total)=>{
                return eval(item+total)
            }))
            
        }
    });
}