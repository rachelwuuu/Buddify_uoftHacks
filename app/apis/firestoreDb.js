const admin = require('firebase-admin')
const serviceAccount = require('../secrets/Buddies-d64f7ad8be53.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports.db = db;
module.exports.admin = admin;