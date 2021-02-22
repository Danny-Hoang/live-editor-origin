import firebase from 'firebase/app'
import "firebase/database";
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCCNuEqQ8Q4RrQ5iJVaOenS26OatSujNz4",
    authDomain: "live-editor-cd3eb.firebaseapp.com",
    databaseURL: "https://live-editor-cd3eb.firebaseio.com",
    projectId: "live-editor-cd3eb",
    storageBucket: "live-editor-cd3eb.appspot.com",
    messagingSenderId: "316882965108",
    appId: "1:316882965108:web:4e3dfb83d37399ab6bb721"
  };

firebase.initializeApp(firebaseConfig);

export default firebase;