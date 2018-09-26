const async = require('async');
const AWS = require('aws-sdk');


function localCheckZenko(bucketName, credentials, objNames, done) {
    const s3 = new AWS.S3(credentials);
    return async.eachLimit(objNames, 1, (objName, next) => {
        return s3.headObject({ Bucket: bucketName, Key: objName }, (err, data) => {
            if (err) {
                console.log(`err for headObject ${objName}`, err);
                return next(err);
            } else if (data.ReplicationStatus !== 'COMPLETED') {
                console.log(`replication not complete for ${objName}`, data);
            } else {
                console.log(`replication complete for ${objName}`);
            }
            return next();
        });
    }, done);
};

module.exports = localCheckZenko;
