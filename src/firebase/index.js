// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjhPxlYG-WoiBHP3G47zXnJtQYPEmJPtw",
  authDomain: "forum-app-c5953.firebaseapp.com",
  projectId: "forum-app-c5953",
  storageBucket: "forum-app-c5953.appspot.com",
  messagingSenderId: "971749678935",
  appId: "1:971749678935:web:d560e65998f3e8360c2812",
  measurementId: "G-VVGTHWXP7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)