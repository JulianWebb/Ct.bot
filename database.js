const firebase = require('firebase');
const app = firebase.initializeApp(require('./config.json').firebase);
const database = app.database().ref();

module.exports = {
    database,
    app,
    createAnswer(question = 'test', answer = 'test') {
        database.child(question).set(answer);
    },
};
