const AWS = require('aws-sdk');
const async = require('async');

function remoteCheckAWS(destBucket, credentials, objNames, done) {
    const s3 = new AWS.S3(credentials);
    return async.eachLimit(objNames, 10, (objName, next) => {
        return s3.headObject({ Bucket: destBucket, Key: objName }, (err, data) => {
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

module.exports = remoteCheckAWS;
