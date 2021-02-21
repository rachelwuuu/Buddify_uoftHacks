// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import { firebaseConfig } from "./secret";
import { setAccount } from ".";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export let accountInfo = {
  name: "",
  email: "",
  uid: "",
  photoURL: "",
  signed: false,
};

export const signinWithGoogle = (callback) => {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      console.log(`sign in successfully as ${user.displayName} ${user.email}`);
      firebase
        .firestore()
        .collection("users")
        .doc(user.email)
        .set(
          {
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
            uid: user.uid,
          },
          { merge: true }
        );
      accountInfo.email = user.email;
      accountInfo.name = user.displayName;
      accountInfo.uid = user.uid;
      accountInfo.signed = true;
      accountInfo.photoURL = user.photoURL;
      console.log(user);

      setAccount(accountInfo);

      if (callback) {
        console.log("Executing callback from signinWithGoogle");
        callback(true, accountInfo);
      }
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log({ errorCode, errorMessage, email, credential });
      callback(false, errorMessage);
    });
};
