export function menuHandler(menu, action = null) {
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
}

export function appendTemplate(element, tagName, html) {
    const wrapElement = document.createElement(tagName)
  
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