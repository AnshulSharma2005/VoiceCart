import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCzpEoxdAeL0QNESds_ZUrM2SUkDdSnMA",
  authDomain: "vocalcart-aabf6.firebaseapp.com",
  projectId: "vocalcart-aabf6",
  storageBucket: "vocalcart-aabf6.appspot.com",
  messagingSenderId: "746312617572",
  appId: "1:746312617572:web:7636385e67bd794c925971",
  measurementId: "G-ZTZC9HLJRJ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

//export const db = getFirestore(app);
export const auth = getAuth(app);
//xport const storage = getStorage(app);

export default app;
