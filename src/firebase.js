import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase
  .initializeApp({
    apiKey: "AIzaSyAFxL6sF4vmZ0foDoKVGQ6vh8UkiwsEhkU",
    authDomain: "react-chat-7240d.firebaseapp.com",
    projectId: "react-chat-7240d",
    storageBucket: "react-chat-7240d.appspot.com",
    messagingSenderId: "890897578745",
    appId: "1:890897578745:web:87b76a63eef8d14c340028",
  })
  .auth();
