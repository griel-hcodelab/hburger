export function menuHandler(menu, action = null) {
<<<<<<< HEAD
    document.querySelector(menu).classList.toggle(action);
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
=======
    menu.classList.toggle(action);
}

//Adicionar conteúdo à página
export function appendTemplate(element, tagName, html){
    const wrapElement = document.createElement(tagName);
    wrapElement.innerHTML = html;
    element.append(wrapElement);
};

//Pegar dados dos formulários
export function getFormValues(form){
    const values = {};
    form.querySelectorAll("[name]").forEach(field=>{
        switch(field.type) {
            case "select":
                values[field.name] = field.querySelector("option:selected")?.value;
            break;
            case "radio":
                values[field.name] = form.querySelector(`[name=${field.name}]:checked`)?.value;
            break;
            case "checkbox":
                values[field.name] = [];
                form.querySelectorAll(`[name=${field.name}]:checked`).forEach(checkbox => {
                    values[field.name].push(checkbox.value);
                })
            break;
            default:
                values[field.name] = field.value
            break;
        };
    });
    return values;
>>>>>>> 46e275a4eaff39f3f7d48280ea5c6ceb100fd605
}