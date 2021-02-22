import { format, parse } from "date-fns"
import { ptBR } from 'date-fns/locale'
import { onSnapshotError } from "../public/assets/scripts/utils"
import firebase from './firebase-app'
import { appendTemplate, getQueryString, setFormValues } from "./utils"


/**
 * Construindo dados fakes para enviar estaticamente para o front-end
 const data = [{
     id:1,
     value: '9:00'
    }, {
        id:2,
        value:'10:00'
    }, {
        id:3,
        value:'11:00'
    }, {
        id:4,
        value:'12:00'
    }, {
        id:5,
        value:'13:00'
    }, {
        id:6,
        value:'14:00'
    }, {
        id:7,
        value:'15:00'
    }, {
        id:8,
        value:'16:00'
    }]
*/
    
/** Para deixar esse código mais inteligente e podermos usar em qualquer lugar sem precisar escrever tanto
 * ou criar de forma mais profissional criamos uma função para executar esse código
* Se notarmos sempre vamos fazer 3 passos para criar um elemento html e renderizar na tela
* 1º criamos o elemento usando o createElement
* 2º jogamos esse elemto dentro do innerHtml com as tags e classes que quermos criar
* 3º Criamos o append para jogar ele dentro de uma classe ou id já existente na página
const appendTemplate = (element, tagName, html) => {

    wrapElement conterá o nome da tag a ser criada
        const wrapElement = document.createElement(tagName)

    depois criamos o innerHTML que será responsavel pela criação do html a ser criado
        wrapElement.innerHTML = html

    por fim penduramos o wrapElemento que criou a tag html no elemento que contém a classe 
    onde será jogado dentro o html gerado
        element.append(wrapElement)
}
*/


/**
 * Função que cria tags para renderizar no html
 */
const renderTimeOptions = (context, timeOptions) => {

    //variavel que armazena a seleção da classe options
    const targetElement = context.querySelector(".options")

    //limpando o html que existe dentro da classe options
    targetElement.innerHTML = ""

    //percorrendo os itens da classe options e criando tag html e renderizando na tela
    
    timeOptions.forEach(item => {
        /**
        * usando a função @appendTemplate criada
        * @targetElement é o alvo onde irá adicionar os htmls que está criando no foreach
        * próximo é uma string com o nome da classe que vai ser o wrap que vai envolver o que será adicionado ou tag pai
        * próximo é o template que será adicionado dentro da classe pai, poderia criar uma variavel com esse template para poder ficar 
        *       menor a função que faria a mesma coisa.
        */
        appendTemplate(
            targetElement, 
            "label", 
            `
                <input type="radio" name="option" value="${item.value}" />
                <span>${item.value}</span>
            `
        )
    })

}

/**
 * Função para criar uma validação no formulario e verificar se existem valores checados
 * caso não existir o botão vem desabilitado e caso existir o botão fica habilitado 
 */
const validateSubmitForm = context => {

    //variavel que pega o botão pela sua propriedade no caso type
    const button = context.querySelector("[type=submit]")
    
    //função para checar se tem valor ou não
    const checkValue = () => {
        if (context.querySelector("[name=option]:checked")) {
            button.disabled = false
        } else {
            button.disabled = true
        }
    }

    //Mesmo que retornando para a página anterior se exitir ou não valor ele vai manter ou desabilitar o botão
    window.addEventListener("load", (e) => checkValue())

    //selecionando todas as propriedades que contém name=option
    //pegando o input e verificando se existe mudança de estado no caso o evento change
    //verificando se existem valores checados se existir habilita o botão e se não existir desabilita
    context.querySelectorAll("[name=option]").forEach((input) => {
        input.addEventListener("change", (e) => {
            //button.disabled = !context.querySelector("[name=option]:checked")
            checkValue()
        })
    })

    //pegando o formulario e verificando se existe o evento submit que é o envio quando clicar no botão
    //se não existir nada checado ele mantém o botão desabilitado e previne o envio padrão do formulário
    context.querySelector("form").addEventListener("submit", (e) => {
        if (!context.querySelector("[name=option]:checked")) {
            button.disabled = true
            e.preventDefault()
        }
    })
}

//função para receber e rederizar a função renderTimeOptions através do id
//pegando apenas as páginas que contém o id("#time-options"), que não afetará nenhuma página que não existir esse id
document.querySelectorAll("#time-options").forEach(page => {

    //inicializando a autenticação do firebade
    const auth = firebase.auth()

    //inicializando o banco de dados do firebase e armazana na variavel db
    const db = firebase.firestore()

    /**
     * depois que mudar o estado do usuario para logado
     * 
     * 
     *  para buscar as informações dentro do banco  informar o nome da coleção
     * depois usar o onsnapshot para trazer informações dinamicamente ou estaticamente
     * guardar os itens dentrp de um array
     * e fazer um forEach percorrendo todos os dados dentro da coleção e armazena na variavel item
     * depois coloca dentro do array criado com push(item.data)
     * depois usa a função de renderização passado a página e o array com os valores
     */ 
    auth.onAuthStateChanged(user => {

        db.collection('time-options').onSnapshot(snapshot => {

            const timeOptions = []
    
            snapshot.forEach(item => {
    
                timeOptions.push(item.data())
    
            })
    
            //função para renderizar o html na pagina toda vez que existir valores
            renderTimeOptions(page, timeOptions)
    
            //exibindo a função para mostrar ou não o botão de continuar
            validateSubmitForm(page)
    
            //pegando a função para evitar erro caso não estiver autenticado
        }, onSnapshotError)
    

    }) 
    


    //função que cria os arrays e pega os valores e faz o split armazenado em uma variavel para usar mais de uma vez aqui dentro
    const params = getQueryString()
    //pegando a tag h3 que contém a data para mostrar de forma dinamica
    const title = page.querySelector("h3")
    //pegando o formulario
    const form = page.querySelector("form")
    //mudando o valor obtido que é uma string para uma data que pode ser lida
    //através do parse do date-fns que espera 3 parametros, a string, o formato que quer e a data nova
    //params está armazenando o svalores que está vindo do search do window.location que é a barra de url
    //schedule_at contém essa informação que é a data
    const scheduleAt = parse(params.schedule_at, "yyyy-MM-dd", new Date())

    //para não perder o valor quando for para a página seguinte, criar uma tag input tipo hidden
    //e adiciona um name, procura essa propriedade e coloca o valor
    //page.querySelector("[name=schedule_at]").value = params.schedule_at

    //usando a função para substituir o código acima
    setFormValues(form, params)

    //pegando o h3 e formatando a data para jogar no navegador
    //valor 1, a data que quer mostrar, 2 o formato que deseja, 3 a linguagem que deseja, por padrão é inglês
    title.innerHTML = format(scheduleAt, "EEEE, d 'de' MMMM 'de' yyyy", {
        locale: ptBR
    })


})