const glob = require('glob');
const fs = require('fs');

const getPublicFiles = () => {
    return new Promise((resolve, reject) => {
        glob('../assets/*.*', (err, files) => {
            if (err) reject(err);
            else {
                const filePromises = files.map((file) => {
                    return new Promise((resolve, reject) => {
                        fs.readFile(file, (err, data) => {
                            if (err)
                                reject(err);
                            else
                                resolve(data)
                        })
                    })
                });

                Promise.all(filePromises)
                    .then((fileContents) => {
                        return fileContents.map((contents, i) => {
                            return {
                                contents,
                                name: files[i].replace('../assets/', '')
                            }
                        })
                    })
                    .then(resolve)
                    .catch(reject)
            }
        })
    })
};

const getContentType = (filename) => {
    if (filename.match(/\.html/)) {
        return 'text/html'
    }
    if (filename.match(/\.png/)) {
        return 'image/png'
    }
    if (filename.match(/\.jpg/)) {
        return 'image/jpeg'
    }
    if (filename.match(/\.js/)) {
        return 'text/javascript'
    }
    if (filename.match(/\.css/)) {
        return 'text/css'
    }
};

module.exports = {
    getPublicFiles: getPublicFiles,
    getContentType: getContentType
};