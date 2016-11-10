const firebase = require('firebase');
var config = {
  apiKey: "AIzaSyDCm-lcw-_zyN_L2Wgqr2NgqPylLaAfxiU",
  authDomain: "noths-football.firebaseapp.com",
  databaseURL: "https://noths-football.firebaseio.com",
  storageBucket: "noths-football.appspot.com",
  messagingSenderId: "1083134840181"
};
export const firebase_init = firebase.initializeApp(config);
export const rootRef = firebase.database().ref();
export const storage = firebase.storage();
