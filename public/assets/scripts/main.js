//Imports
import firebase from './firebase-app';
import { menuHandlerAdd, menuHandlerRemove } from './utils';

document.querySelectorAll("#app").forEach(page => {

  const asideHeader = page.querySelector("aside header");
  if (asideHeader) {
    asideHeader.addEventListener("click", (e)=>{
      menuHandlerAdd("aside", "open");
    })
  }

  const buttonClose = page.querySelector('#app > aside > footer > div.close')
  if (buttonClose) {
    buttonClose.addEventListener("click", (e)=>{
      menuHandlerRemove("aside", "open");
    })
  }

})

//Pegar ingredientes do Firebase
