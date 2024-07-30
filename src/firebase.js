// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADe7d3t12zZt5yTwoqLdlnfydR5XUsAds",
  authDomain: "personal-finance-tracker-192f1.firebaseapp.com",
  projectId: "personal-finance-tracker-192f1",
  storageBucket: "personal-finance-tracker-192f1.appspot.com",
  messagingSenderId: "227920088252",
  appId: "1:227920088252:web:e8997f937fff5e4d98d4b9",
  measurementId: "G-N1D6SJFH1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export {db, auth, provider, doc, setDoc}
