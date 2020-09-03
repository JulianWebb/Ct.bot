let firebaseConfig;

try {
    firebaseConfig = {
        apiKey: process.env['firebase.apiKey'],
        appId: process.env['firebase.appId'],
        projectId: process.env['firebase.projectId'],
        authDomain: process.env['firebase.authDomain'],
        databaseURL: process.env['firebase.databaseURL'],
        storageBucket: process.env['firebase.storageBucket'],
        messagingSenderId: process.env['firebase.messagingSenderId'],
    };
    if (firebaseConfig.databaseURL === undefined || firebaseConfig.databaseURL === null) firebaseConfig = require('./credentials.json').firebase;
} catch (e) {
    firebaseConfig = require('./credentials.json').firebase;
}

const firebase = require('firebase');
const app = firebase.initializeApp(firebaseConfig);
const database = app.database().ref();

module.exports = {
    database,
    app,
    createAnswer(question, answer) {
        database.child('questions').child(question).set(answer);
    },
};
