const firebase = require('firebase');
const env = process.env;

let firebaseConfig;

try {
    firebaseConfig = {
        apiKey: env.firebase.apiKey,
        appId: env.firebase.appId,
        projectId: env.firebase.projectId,
        authDomain: env.firebase.authDomain,
        databaseURL: env.firebase.databaseURl,
        storageBucket: env.firebase.storageBucket,
        messagingSenderId: env.firebase.messagingSenderId,
    }
} catch(e) {
    firebaseConfig = require('./credentials.json').firebase;
}

const app = firebase.initializeApp(firebaseConfig);
const database = app.database().ref();

module.exports = {
    database,
    app,
    createAnswer(question = 'test', answer = 'test') {
        database
            .child('questions')
            .child(question)
            .set(answer);
    },
};
