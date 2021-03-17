//Constantes Globais
import firebase from './firebase-app';
const auth = firebase.auth();

console.log("%cSeja bem vindo ao Console do H-Burger Red Team.", "color: #FFF; text-align: center; font-family: sans-serif; font-size: 20px; font-weight: bolder; text-shadow: #000 1px 1px;");
console.log("%cAo menos que você saiba o que tem aqui, não digite nenhum comando ou faça nenhuma ação nessa área.", "color: red; font-family: sans-serif; font-size: 20px; font-weight: bolder; text-shadow: #000 1px 1px;");

//Gerenciador de menus
export function menuHandlerAdd(menu, action = null) {
    document.querySelector(menu).classList.add(action);
}

export function menuHandlerRemove(menu, action = null) {
    document.querySelector(menu).classList.remove(action);
}


//Gerenciamento de alertas, onde type é: 'success' para sucesso e 'error' para erro
export function showAlert(message, type) {
    document.querySelector("#alert").style.display = "flex";
    document.querySelector("#alert").classList.add(type);
    document.querySelector("#alert").innerHTML = message;
}
export function hideAlert(type) {
    document.querySelector("#alert").style.display = "none";
    document.querySelector("#alert").classList.remove(type);
}


//Verificador de inputs
export function checkInput(input) {
    if (!input.value) {
        return false;
    }
}

//Pegando valor de um formulario e transformando em objetos
export function getFormValues(form) {

    const values = {}

    /**
     * Pegando a propriedade em comum para todas as tags que é o name
     * para cada tag que encontrar verifica qual é o tipo
     */
    form.querySelectorAll("[name]").forEach(field => {

        switch (field.type) {
            //caso for select pega o valor do campo option que foi selecionado e joga no nome
            case "select":
                //operador de coalescência nula (?) irá retornar apenas valores não nulos
                values[field.name] = field.querySelector("option:selected")?.value
                break
            //caso for radio button pega o valor selecionado e joga no nome
            case "radio":
                values[field.name] = form.querySelector(`[name=${field.name}]:checked`)?.value
                break
            //caso for um checkbox que pode ser marcado mais que uma opção, cria um array
            //pega todos os campos selecionados e inclui o nome     
            case "checkbox":
                values[field.name] = []
                form.querySelectorAll(`[name=${field.name}]:checked`).forEach(checkbox => {
                    values[field.name].push(checkbox.value)
                })    
                break
            default:
                //por padrão ele pega o campo selecionado e joga o valor no name
                values[field.name] = field.value
                break
        }
    })

    return values
}

//Verificador de Login
const menu = document.querySelector("#avatar");

if (menu) {
    const auth = firebase.auth();
    auth.onAuthStateChanged(user => {
        if (user) {
            if (user.photoURL) {
                document.querySelector("header > img#avatar").src = user.photoURL;
            }
            menu.addEventListener("click", (e)=>{
                //auth.signOut();
                //window.location.href = "index.html";
                document.querySelector(".profile-menu").classList.toggle("show");
            })
        } else {
            menu.addEventListener("click", (e)=>{
                window.location.href = "login.html";
            })
        }
    });
}
//Signout
const signout = document.querySelector(".signout");
if (signout) {
    const auth = firebase.auth();
    auth.signOut();
    //window.location.href = "index.html";
}//


export function appendTemplate(element, tagName, html, attr = null) {
    const wrapElement = document.createElement(tagName)

    if (attr) {
        for(let item in attr) {
            wrapElement.setAttribute(item, attr[item])
        }
    }
  
    wrapElement.innerHTML = html
  
    element.append(wrapElement)
  
    return wrapElement
}
  
export function formatPrice(value) {
  
    return parseFloat(value).toLocaleString('pt-br', {
        style: 'currency',
        currency: 'BRL'
    })
  
}

export function onSnapshotError(err) {

    const pathname = encodeURIComponent(window.location.pathname);
    const search = encodeURIComponent(window.location.search);

    window.location.href = `/auth.html?url=${pathname}${search}`;

}

export function setFormValues(form, values) {
    Object.keys(values).forEach((key) => {
        const field = form.querySelector(`[name=${key}]`);

        switch (field.type) {
            case "select":
                field.querySelector(
                    `option[value=${values[key]}]`
                ).selected = true;
                break;
            case "checkbox":
            case "radio":
                form.querySelector(
                    `[name=${key}][value=${values[key]}]`
                ).checked = true;
                break;
            default:
                field.value = values[key];
        }
    });
}
