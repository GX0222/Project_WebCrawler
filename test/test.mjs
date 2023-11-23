// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBde1lNoRrkUGSC1KANs-WS8_hrk4w3q4",
  authDomain: "test02-b2b2e.firebaseapp.com",
  databaseURL: "https://test02-b2b2e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test02-b2b2e",
  storageBucket: "test02-b2b2e.appspot.com",
  messagingSenderId: "309759691475",
  appId: "1:309759691475:web:6049ce55191996b8eb6226"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const testDataRef = ref(database, 'testData');
set(testDataRef, {
  message: 'Hello, Firebase!'
});






