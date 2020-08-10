// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRGCORpahuef0FZPwEgtWXppm6ELcy8LQ",
  authDomain: "cookerinoo-bc38a.firebaseapp.com",
  databaseURL: "https://cookerinoo-bc38a.firebaseio.com",
  projectId: "cookerinoo-bc38a",
  storageBucket: "cookerinoo-bc38a.appspot.com",
  messagingSenderId: "159810480842",
  appId: "1:159810480842:web:69cdd2843c033688f66233",
  measurementId: "G-S0FHHHMJC8"
};
// initialize Firebase
firebase.initializeApp(firebaseConfig);

var auth = firebase.auth()
var db = firebase.firestore();
var recipeRef = db.collection("recipes");

//var recipeRef = db.ref("/recipes");

//recipeRef.on("value", snap => console.log(snap.val())); (to show data that goes to db)


