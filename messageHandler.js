const messages = require('./messages.json');

/**
 * @param {(string|string[])} key - The location of the string in messages.json.
 * @param {object} [vars] - Strings to replace the {variables} in the messages.json string.
 * @returns {string} - The combined message
 * Used to create messages from pre-defined strings in messages.json and variables passed in.
 */
function getMessage(key, vars) {
    if (typeof key == 'string') {
        key = key.split('.');
    }

    let message = key.reduce((acc, value) => {
        if (typeof acc[value] == 'undefined') {
            return {};
        }
        acc = acc[value];
        return acc;
    }, messages);

    if (typeof message == 'object') {
        message = key.reduce((acc, value) => `${acc}.${value}`);
    }

    if (typeof vars != 'undefined') {
        Object.keys(vars).forEach((key) => {
            const keyRegex = new RegExp(`{${key}}`, 'g');
            message = message.replace(keyRegex, vars[key]);
        });
    }

    return message;
}

/**
 *
 * @param {string} id - The log identifier, generally the name of the module or command.
 * @param {string} message - The message to be added.
 * @returns {string} - The resulting combined string
 * Just a helper function to keep things a bit DRYer.
 */
function logMessage(id, message) {
    return getMessage('log', { id, msg: message });
}

module.exports = {
    get: getMessage,
    getMessage,
    log: logMessage,
    logMessage,
};
