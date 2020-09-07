let messages = require('./messages.json');

function getMessage(key, vars) {
    if (typeof key == "string") {
        key = key.split('.');
    }

    let message = key.reduce((acc, value) => {
        if (typeof acc[value] == "undefined") {
            return {};
        }
        acc = acc[value];
        return acc;
    }, messages)

    if (typeof message == "object") {
        message = key.reduce((acc, value) => `${acc}.${value}`);
    }

    if (typeof vars != "undefined") {
        Object.keys(vars).forEach((key) => {
            let keyRegex = new RegExp(`{${key}}`, "g")
            message = message.replace(keyRegex, vars[key]);
        })
    }
    
    return message;
}

function logMessage(id, message) {
    return getMessage('log', { id: id, msg: message})
}

module.exports = {
    get: getMessage,
    getMessage,
    log: logMessage,
    logMessage
}