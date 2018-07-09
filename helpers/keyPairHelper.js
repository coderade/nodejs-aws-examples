const fs = require('fs');
const path = require('path');
const os = require('os');


/**
 * Persist the KeyPair file on the system
 * @param {String} keyData - the buffer data of the key
 * @return Promise - The promise to be handled with the fs.writeFile method
 */
const persistKeyPair = (keyData) => {
    return new Promise((resolve, reject) => {
        const keyPath = path.join(os.homedir(), '.ssh', keyData.KeyName);
        const options = {
            encoding: 'utf8',
            mode: 0o600
        };

        fs.writeFile(keyPath, keyData.KeyMaterial, options, (err) => {
            if (err) reject(err);
            else {
                console.log('Key written to', keyPath);
                resolve(keyData.KeyName)
            }
        })
    })
};

module.exports = {
    persistKeyPair: persistKeyPair
};
