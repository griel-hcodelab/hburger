import firebase from './firebase-app'
import { appendTemplate, formatPrice } from './utils';
const db = firebase.firestore();
const auth = firebase.auth();

let labels = [];
let userID;

const index = document.querySelectorAll(".carte")
if (index) {
    index.forEach((page)=>{

        //Pegando o ID do usuário logado
        auth.onAuthStateChanged(user => {
            if (user) {
                userID = user.uid;
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

        const saveTray = ()=>{
            db.collection(`pedidos/${userID}/bandeja`).onSnapshot(snapshot => {
                const burger = [];

                let burgerItem = [];
                
                snapshot.forEach(item => {
                  burger.push(item.data());
                })
                
                burger.forEach((item)=>{

                    let subPrices = [];
                    Object.values(item.prices).forEach((value)=>{
                        
                        subPrices.push(value.itemPrice);
                        
                    })

                    let burgerPrice = subPrices.reduce((totalResult, item)=>{
                        return eval(Number(totalResult) + Number(item))
                    },0)
                    /*subPrices = value["prices"].reduce((totalResult, item)=>{
                        return eval(Number(totalResult) + Number(item))
                    }, 0);*/


                    const ul = page.querySelector("aside > section > ul");
                    ul.innerHTML = '';
                    burger.forEach((item)=>{
                        appendTemplate(ul, "li", `
                        <div>${item.burgerName}</div>
                        <div>${formatPrice(burgerPrice)}</div>
                        <button type="button" aria-label="Remover Hamburguer 1">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="black"/>
                            </svg>
                        </button>
                        `);
                    });
                    
                    
                })

            
            });
        }
        saveTray();




        //Salvando Hamburger
        saveBurger.addEventListener("click", (e)=>{
            e.preventDefault();
            saveBurgerFn();
        })

        const saveBurgerFn = ()=>{
            const selected = page.querySelectorAll("input:checked");

            let burger = [];

            let itemsName = [];
            let itemsPrice = [];

            let burgerName = page.querySelector("ul.burger").querySelector("input:checked").closest("label").dataset.burgername;

            selected.forEach((item)=>{
                let price = parseFloat(item.closest("label").dataset.price);
                itemsPrice.push({"itemPrice":price});
            });

            burger.push({itemsName,itemsPrice});
            
            let trayNumber = Math.floor(Math.random() * 50000) + 1000;
            const tray = db.collection(`pedidos/${userID}/bandeja`).doc(trayNumber.toString());

            tray.set({
                "burgerName":burgerName,
                "prices":itemsPrice
            })
            .then(() => {
                console.log("Deu erto")
                saveTray();
                //window.location.reload();
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
            

            //console.log(selected.closest("label").dataset.name)


        }




        const activateClicks = ()=>{
   
            labels[0].forEach((item)=>{
                item.addEventListener("click", (e)=>{
                    document.querySelector("footer").classList.add("show")
                });
            });
           
        }
    });



    

}


