// import { initializeApp, getApps } from 'firebase/app';

// const firebaseConfig = {
//   apiKey: "AIzaSyCsH8eqA5Lrvec44ed2hzd9_eJH5GLdAAM",
//   authDomain: "todoapp-71646.firebaseapp.com",
//   projectId: "todoapp-71646",
//   storageBucket: "todoapp-71646.appspot.com",
//   messagingSenderId: "67239753139",
//   appId: "1:67239753139:web:6e3415df16ceabd323c7c6",
//   measurementId: "G-TQDRVC2JD3"
// };

// // Проверяем, не инициализирован ли уже Firebase
// export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]; 


// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsH8eqA5Lrvec44ed2hzd9_eJH5GLdAAM",
  authDomain: "todoapp-71646.firebaseapp.com",
  projectId: "todoapp-71646",
  storageBucket: "todoapp-71646.appspot.com",
  messagingSenderId: "67239753139",
  appId: "1:67239753139:web:6e3415df16ceabd323c7c6",
  measurementId: "G-TQDRVC2JD3"
};

// Проверяем, не инициализирован ли уже Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Инициализируем сервисы
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };