import firebase from './firebase-app'
import { appendTemplate, formatPrice, onSnapshotError } from './utils'
const db = firebase.firestore()

const footerElement = document.querySelector('#app > section > footer')

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

        breadSelected.push({
          id: service.id,
          price: service.valor
        });

      } else {

        breadSelected = breadSelected.filter(option => {
          return Number(option.id) !== Number(value);
        })

      }

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

        ingredientsSelected = ingredientsSelected.filter(option => {
          return Number(option.id) !== Number(value);
        })

      }

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