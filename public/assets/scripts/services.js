import firebase from './firebase-app'
import { appendTemplate, formatPrice, onSnapshotError } from './utils'
const db = firebase.firestore()

let breadSelected = [] // Dentro desse array serão adicionados objetos que contém informações dos pãe selecionados: id, preço.
let ingredientsSelected = [] // Dentro desse array serão adicionados objetos que contém informações dos ingredientes selecionados: id, preço.
let burguersTray = [] // Aqui ficam as todas as informações dos hamburguers que estão na bandeja
let trayNumber = 0 // Número de lanches na bandeja
let totalPriceAllBurguers = 0 // Preço total dos hamburguers
let removeButton;

function addPrice(firstArray, secondArray) {

  let price = 0

  if (labelsElBread) {
    labelsElBread.innerHTML = '';
  for (let i=0; i < firstArray.length; i++) {
    price += firstArray[i].price
  }

  for (let i=0; i < secondArray.length; i++) {
    price += secondArray[i].price
  }

  return price

}

function saveSubtotalPrice(price) {
  document.querySelector('#app > aside > footer > div.price').innerHTML = `
    <small>Subtotal</small>
    ${formatPrice(price)}
  `
}

function renderBurguerTray(array) {
  const hamburgerElDad = document.querySelector('#app > aside > section > ul')

  hamburgerElDad.innerHTML = '';

  array.forEach(item => {

    let burguerEl = appendTemplate(hamburgerElDad, 'li', `
      <div>Hamburguer ${item.number}</div>
      <div>${formatPrice(item.totalPrice)}</div>
      <button type="button" aria-label="Remover Hamburguer ${item.number}" id="${item.number}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="black"/>
          </svg>
      </button>
    `);

    
  })

  let buttonRemoveSelector = renderButtonRemove()

  return buttonRemoveSelector
}

function renderButtonRemove() {
  return document.querySelector('li > button')
}

function saveBurguer() {

  trayNumber = trayNumber + 1

  let totalPrice = addPrice(breadSelected, ingredientsSelected)

  burguersTray.push({number: trayNumber, bread: breadSelected, ingredients: ingredientsSelected, totalPrice: totalPrice})

  const trayEl = document.querySelector('#app > aside > header > strong > small')

  if (trayNumber > 1) {
    trayEl.innerHTML = `${trayNumber} Hambúrguers`
  } else {
    trayEl.innerHTML = `${trayNumber} Hambúrguer`
  }

  totalPriceAllBurguers = totalPriceAllBurguers + totalPrice

  renderBurguerTray(burguersTray)

  saveSubtotalPrice(totalPriceAllBurguers)

}

const buttonSave = document.querySelector('#app > section > footer > button')

if (buttonSave) {
  buttonSave.addEventListener('click', () => {
    saveBurguer()
    removeButton = document.querySelectorAll('li > button')
  })
}

if (removeButton) {
  console.log("aaa")
  removeButton.forEach(button => {
    button.addEventListener('click', (element) => {
      burguersTray.forEach(burguer => {
        if (element.toElement.id == burguer.number) {
          removeBurguer()
        }
      })
    })
  })
}




/* setInterval(() => {
  
}, 1000) */


/* if (removeButton) {
  removeButton.forEach(button => {
    console.log(button)
    button.addEventListener('click', (element) => {
      burguersTray.forEach(burguer => {
        if (element.id === burguer.number) {
          console.log("aaaaaaaaaa")
        }
      })
    })
  })
} */


console.log(burguersTray)

function removeBurguer() {

  trayNumber = trayNumber - 1

  let totalPrice = addPrice(breadSelected, ingredientsSelected)

  burguersTray.slice(burguersTray.indexOf({number: trayNumber, bread: breadSelected, ingredients: ingredientsSelected, totalPrice: totalPrice}), 1)

  console.log(burguersTray)

  const trayEl = document.querySelector('#app > aside > header > strong > small')

  if (trayNumber > 1) {
    trayEl.innerHTML = `${trayNumber} Hambúrguers`
  } else {
    trayEl.innerHTML = `${trayNumber} Hambúrguer`
  }

  totalPriceAllBurguers = totalPriceAllBurguers - totalPrice

  const hamburgerElDad = document.querySelector('#app > aside > section > ul')

  hamburgerElDad.innerHTML = '';

  saveSubtotalPrice(totalPriceAllBurguers)

  /* trayNumber = trayNumber - 1

  let totalPrice = addPrice(breadSelected, ingredientsSelected)

  burguersTray.slice(burguersTray.indexOf({number: trayNumber, bread: breadSelected, ingredients: ingredientsSelected, totalPrice: totalPrice}), 1)

  const trayEl = document.querySelector('#app > aside > header > strong > small')

  if (trayNumber > 1) {
    trayEl.innerHTML = `${trayNumber} Hambúrguers`
  } else {
    trayEl.innerHTML = `${trayNumber} Hambúrguer`
  }

  totalPriceAllBurguers = totalPriceAllBurguers - totalPrice

  const hamburgerElDad = document.querySelector('#app > aside > section > ul')

  hamburgerElDad.innerHTML = '';

  saveSubtotalPrice(totalPriceAllBurguers) */
}

/* if (renderButtonRemove()) {
  renderButtonRemove().addEventListener('click', () => {
    console.log("aaaaa")
  })
}

 */