// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE2_API_KEY,
  authDomain: "trendingjobs4all-resumetemp.firebaseapp.com",
  projectId: "trendingjobs4all-resumetemp",
  storageBucket: "trendingjobs4all-resumetemp.appspot.com",
  messagingSenderId: "71154360465",
  appId: "1:71154360465:web:abb27b7da0b8b74f431f30"
};

// Initialize Firebase
export const app2 = initializeApp(firebaseConfig);