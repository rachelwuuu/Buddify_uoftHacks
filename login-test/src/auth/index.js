export var account = {
    logged: false,
    name: "",
    email: "",
    uid: "",
    photoURL: "",
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
    account.uid = acc.uid
    account.photoURL = acc.photoURL
    localStorage.setItem('accountInfo', JSON.stringify(account))
}