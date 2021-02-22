//Imports
import firebase from './firebase-app';

document.querySelectorAll("#app").forEach(page => {

  const aside = page.querySelector("aside")
  const buttonOpenAside = page.querySelector("aside header")
  const closeAside = page.querySelector("footer .close")

  if (buttonOpenAside) {
    buttonOpenAside.addEventListener("click", e => {
        aside.classList.add("open")
    })
  }

  if(closeAside) {
    closeAside.addEventListener("click", e => {
      aside.classList.remove("open")
    })
  }

})

//Pegar ingredientes do Firebase
