// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "careerconnect-85965.firebaseapp.com",
  projectId: "careerconnect-85965",
  storageBucket: "careerconnect-85965.appspot.com",
  messagingSenderId: "865595243103",
  appId: "1:865595243103:web:cca6330c437416304679ea"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);