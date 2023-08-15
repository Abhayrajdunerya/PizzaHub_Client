import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// import { getAnalytics } from "firebase/analytics";
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCbPS_ytz6hSvR-KHQCHKkie-DZBhHZEmk",
  authDomain: "pizza-delivery-app-4c8bb.firebaseapp.com",
  projectId: "pizza-delivery-app-4c8bb",
  storageBucket: "pizza-delivery-app-4c8bb.appspot.com",
  messagingSenderId: "757920524355",
  appId: "1:757920524355:web:7ae6656d58040cc2fd0cf6",
  measurementId: "G-3FW6Y7VV55"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export { auth, googleAuthProvider };