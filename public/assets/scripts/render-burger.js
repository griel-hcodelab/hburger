import firebase from './firebase-app'
import { appendTemplate, formatPrice } from './utils';
const db = firebase.firestore();

let labels = [];
let savedBurgers = [];

const index = document.querySelectorAll(".carte")
if (index) {
    index.forEach((page)=>{

        //Variáveis da página
        const footer = page.querySelector("footer");
        const saveBurger = page.querySelector("#saveBurger");
        

        //Renderizando Lanches
        const renderBurger = (burger)=>{
            const ul = page.querySelector("ul.burger");
            ul.innerHTML = '';
            burger.forEach((item)=>{
                appendTemplate(ul, "li", `
                    <label data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
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
                    <label>
                        <input type="radio" name="bread" id="bread-${item.id}" />
                        <span></span>
                        <h3>${item.name}</h3>
                        <div>${formatPrice(item.price)}</div>
                    </label>
                `);
            });
        }

        //Renderizando Pães
        const renderAditionals = (aditionals)=>{
            const ul = page.querySelector("ul.aditionals");
            ul.innerHTML = '';
            aditionals.forEach((item)=>{
                appendTemplate(ul, "li", `
                    <label>
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
    });



    //Salvando Hamburger
    saveBurger.addEventListener("click", (e)=>{
        e.preventDefault();
        saveBurgerFn();
    })

    const saveBurgerFn = ()=>{
        const selected = document.querySelectorAll("input:checked");

        let subTotalValue = [];

        selected.forEach((item)=>{
            subTotalValue.push(parseFloat(item.closest("label").dataset.price));
            
        });

        console.log(subTotalValue)

        //console.log(selected.closest("label").dataset.name)


    }

}


const activateClicks = ()=>{
   
    labels[0].forEach((item)=>{
        console.log(item);
        item.addEventListener("click", (e)=>{
            console.log(e);
        });
    });
   
}