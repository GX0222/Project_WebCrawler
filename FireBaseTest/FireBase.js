// Import the functions you need from the SDKs you need
const firebase = require('firebase/app');
require('firebase/database');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA2k5bPF45PJO2bdjKarSlowCJtSIWSLS4",
    authDomain: "test01-b4d8d.firebaseapp.com",
    databaseURL: "https://test01-b4d8d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "test01-b4d8d",
    storageBucket: "test01-b4d8d.appspot.com",
    messagingSenderId: "828844779791",
    appId: "1:828844779791:web:262343ee07fe4210c6f67a"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
//====================================================================

database.ref('testData').set({
    message: 'Hello, Firebase!'
  });