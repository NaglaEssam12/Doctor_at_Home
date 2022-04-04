const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://doctor-at-home-v1.firebaseio.com"
  });

  module.exports = admin;
  
