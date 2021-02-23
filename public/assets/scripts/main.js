//Imports
import firebase from './firebase-app';
import { menuHandler } from './utils';

document.querySelectorAll("#app").forEach(page => {

  const aside = page.querySelector("aside");
  aside.addEventListener("click", (e)=>{
    menuHandler(aside, "open");
  })

})

//Pegar ingredientes do Firebase
