import firebaseConfig from "./../../../firebase.json";
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

if (!firebase.apps.lenght) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

export default firebase;