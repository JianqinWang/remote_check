const azure = require('azure-storage');
const async = require('async');

function remoteCheckAzure(destContainer, credentials, objNames, done) {
    const { storageAccount, storageAccessKey, host } = credentials;
    const blobService = azure.createBlobService(storageAccount, storageAccessKey, host);
    return async.eachLimit(objNames, 10, (objName, next) => {
        return blobService.getBlobProperties(destContainer, objName, (err, data) => {
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

module.exports = remoteCheckAzure;
