const async = require('async');
const { Storage } = require('@google-cloud/storage');


function remoteCheckGCP(destBucket, credentials, objNames, done) {
    const gcp = new Storage(credentials);
    const myBucket = gcp.bucket(destBucket);
    return async.eachLimit(objNames, 10, (objName, next) => {
        const file = myBucket.file(objName);
        return file.exists((err, data) => {
            if (err) {
                console.log(`err for headObject ${objName}`, err);
                return next(err);
            } else {
                console.log(`${objName} exists!`);
            }
            return next();
        });
    }, done);    
};

module.exports = remoteCheckGCP;