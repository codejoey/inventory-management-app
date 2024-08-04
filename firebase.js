// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore   } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpmpMWWKzgaxyKDshRXeYBH0dTlBfonq8",
  authDomain: "inventory-management-pro-6116c.firebaseapp.com",
  projectId: "inventory-management-pro-6116c",
  storageBucket: "inventory-management-pro-6116c.appspot.com",
  messagingSenderId: "158727482593",
  appId: "1:158727482593:web:ea94ddd144cd289271dba0",
  measurementId: "G-T9RDKLVRBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore}