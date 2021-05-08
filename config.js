import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCjEQGXzeGOmnn99q-XKzrAIkigfI8FtVQ",
  authDomain: "c90-covid-saver.firebaseapp.com",
  projectId: "c90-covid-saver",
  storageBucket: "c90-covid-saver.appspot.com",
  messagingSenderId: "391321576997",
  appId: "1:391321576997:web:269416478f6b0066d341cc",
};

firebase.initializeApp(firebaseConfig);
export default firebase.firestore();
