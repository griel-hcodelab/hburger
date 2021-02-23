//Gerenciador de menus
export function menuHandler(menu, action = null) {
    menu.classList.toggle(action);
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
}