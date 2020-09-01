const firebase = require('firebase');
const app = firebase.initializeApp(require('./index.js').config.data.firebase);
const database = app.database().ref();

module.exports = {
    database,
    app,
    createAnswer(question = 'test', answer = 'test') {
        database.child('questions').child(question).set(answer);
    },
};
