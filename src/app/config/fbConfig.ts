import { initializeApp } from "firebase/app";
import { getFirestore }  from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCsH8eqA5Lrvec44ed2hzd9_eJH5GLdAAM",
  authDomain: "todoapp-71646.firebaseapp.com",
  projectId: "todoapp-71646",
  storageBucket: "todoapp-71646.appspot.com",
  messagingSenderId: "67239753139",
  appId: "1:67239753139:web:6e3415df16ceabd323c7c6",
  measurementId: "G-TQDRVC2JD3"
};
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export default db;