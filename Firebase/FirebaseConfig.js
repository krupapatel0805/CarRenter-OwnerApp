
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDV_QAs6HvdHnkflIL_YDqXbojIPvk1c08",
  authDomain: "ownerrenter-g10.firebaseapp.com",
  projectId: "ownerrenter-g10",
  storageBucket: "ownerrenter-g10.appspot.com",
  messagingSenderId: "199253858637",
  appId: "1:199253858637:web:73931ead5c6806d69cbf04"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)

export {db, auth}