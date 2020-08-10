const admin = require('firebase-admin');
const fb = require('firebase');

const serviceAccount = require('./cookerinoo-bc38a-firebase-adminsdk-dwa1b-56bc574f0d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = fb.auth()
const db = admin.firestore();
const firestore = admin.firestore;

module.exports = { admin, auth, db, firestore };
