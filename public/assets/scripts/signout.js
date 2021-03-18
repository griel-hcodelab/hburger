import firebase from './firebase-app';

const db = firebase.firestore();
const auth = firebase.auth();

document.querySelectorAll("#app.signout").forEach((page)=>{
    auth.signOut()
    .then(() => {
        page.querySelector('h1').innerHTML = 'Você saiu do sistema. Você será direcionado ao login em alguns segundos.';
        setTimeout(()=>{
            window.location.href = '/login.html';
        }, 3000)
      }).catch((error) => {
        page.querySelector('h1').innerHTML = 'Algum problema ocorreu. Por segurança você foi desconectado de sua conta e retornará ao login.';
        setTimeout(()=>{
            window.location.href = '/login.html';
        }, 3000)
      });
});