import firebase from './firebase-app'
import { appendTemplate, formatPrice, onSnapshotError } from './utils'
const db = firebase.firestore();

const footerElement = document.querySelector('#app > section > footer')

let breadSelected = []
let ingredientsSelected = []
let hamburguersTray = []
let trayNumber = 0

const renderLabelsBread = (context, labels) => {
  
  const labelsElBread = context.querySelector('#bread ul')

  labelsElBread.innerHTML = '';

  labels.forEach(item => {

    const label = appendTemplate(labelsElBread, 'li', `
      <label>
        <input type="radio" name="item" value="${item.id}" />
        <span></span>
        <h3>${item.tipo}</h3>
        <div>${formatPrice(item.valor)}</div>
      </label>
    `);

    label.querySelector('[type=radio]').addEventListener('change', e => {

      footerElement.classList.add('show')

      const { checked, value } = e.target;

      if (checked) {

        const service = labels.filter((option) => {
          return (Number(option.id) === Number(value));    
        })[0];

        breadSelected = []
        breadSelected.push({
          id: service.id,
          price: service.valor
        });

      } else {

        breadSelected = breadSelected.filter(id => {
          return Number(id) !== Number(value);
        })

      }

      const result = breadSelected.map(id => labels.filter(item => (+item.id === +id))[0])

      result.sort((a, b) => {

        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        } else {
          return 0;
        }

      });

    })

  })

}

const renderLabelsIngredients = (context, labels) => {
  
  const labelsELIngredients = context.querySelector('#ingredients ul')

  labelsELIngredients.innerHTML = '';

  labels.forEach(item => {

    const label = appendTemplate(labelsELIngredients, 'li', `
      <label>
        <input type="checkbox" name="item" value="${item.id}" />
        <span></span>
        <h3>${item.tipo}</h3>
        <div>${formatPrice(item.valor)}</div>
      </label>
    `);

    label.querySelector('[type=checkbox]').addEventListener('change', e => {

      footerElement.classList.add('show')

      const { checked, value } = e.target;

      if (checked) {

        const service = labels.filter((option) => {
          return (Number(option.id) === Number(value));    
        })[0];

        ingredientsSelected.push({
          id: service.id,
          price: service.valor
        });

      } else {

        ingredientsSelected = ingredientsSelected.filter(id => {
          return Number(id) !== Number(value);
        })

      }

      const result = ingredientsSelected.map(id => labels.filter(item => (+item.id === +id))[0])

      result.sort((a, b) => {

        if (a.name > b.name) {
          return 1;
        } else if (a.name < b.name) {
          return -1;
        } else {
          return 0;
        }

      });

    })

  })

}

document.querySelectorAll("#app").forEach(page => {

  db.collection("pao").onSnapshot(snapshot => {

    const pao = [];

    snapshot.forEach(item => {

      pao.push(item.data());

    })

    renderLabelsBread(page, pao);

  }, onSnapshotError);

  db.collection("ingredientes").onSnapshot(snapshot => {

    const ingredients = [];

    snapshot.forEach(item => {

      ingredients.push(item.data());

    })

    renderLabelsIngredients(page, ingredients);

  }, onSnapshotError);

})

const buttonSave = document.querySelector('#app > section > footer > button')

buttonSave.addEventListener('click', (e) => {

  
  let totalPrice = 0
  
  footerElement.classList.remove('show')
  
  const trayEl = document.querySelector('#app > aside > header > strong > small')

  trayNumber = trayNumber + 1
  
  for (let i=0; i < breadSelected.length; i++) {
    totalPrice += breadSelected[i].price
  }

  for (let i=0; i < ingredientsSelected.length; i++) {
    totalPrice += ingredientsSelected[i].price
  }

  hamburguersTray.push({number: trayNumber, bread: breadSelected, ingredients: ingredientsSelected, totalPrice: totalPrice})
  
  if (trayNumber > 1) {
    trayEl.innerHTML = `${trayNumber} Hambúrguers`
  } else {
    trayEl.innerHTML = `${trayNumber} Hambúrguer`
  }

  const hamburgerElDad = document.querySelector('#app > aside > section > ul')

  hamburgerElDad.innerHTML = '';

  hamburguersTray.forEach(item => {

    console.log(item.number)

    const li = appendTemplate(hamburgerElDad, 'li', `
      <div>Hamburguer ${item.number}</div>
      <div>${formatPrice(item.totalPrice)}</div>
      <button type="button" aria-label="Remover Hamburguer 1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="black"/>
          </svg>
      </button>
    `);

  })

})



