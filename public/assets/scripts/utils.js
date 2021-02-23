//Constantes Globais
import firebase from './firebase-app';
const auth = firebase.auth();

//Gerenciador de menus
export function menuHandler(menu, action = null) {
    document.querySelector(menu).classList.toggle(action);
}

//Verificador de inputs
export function checkInput(input) {
    if (!input.value) {
        return false;
    }
}

//Adicionar conteúdo à página
export function appendTemplate(element, tagName, html){
    const wrapElement = document.createElement(tagName);
    wrapElement.innerHTML = html;
    element.append(wrapElement);
};
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