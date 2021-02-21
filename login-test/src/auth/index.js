// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

export var account = {
    logged: false,
    name: "",
    email: "",
    photoURL: "",
    idToken: ""
}

export var getAccount = () => {
    let savedAccount = localStorage.getItem('accountInfo')
    if (account.logged == false && savedAccount != undefined) {
        try {
            account = JSON.parse(savedAccount)
        } catch (error) {
            console.log("NOT LOGGED IN")
        }
    }
    return account
}

export var logoutAccount = () => {
    account.logged = false
    localStorage.setItem('accountInfo', JSON.stringify(account))
}

export var setAccount = (acc) => {
    account.logged = true
    account.name = acc.name
    account.email = acc.email
    account.photoURL = acc.photoURL

    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        // Send token to your backend via HTTPS
        account.idToken = idToken
        localStorage.setItem('accountInfo', JSON.stringify(account))
    }).catch(function(error) {
        console.error(error)
    });
}