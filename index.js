const async = require('async');
const credentials = require('./credentials');
const constants = require('./constants');
const checkers = require('./checkers/checkers');

const { sourceBucket, numObjs, destinationBuckets } = constants;

const localObjNames = [];
for (i = 1; i <= numObjs; i++) {
    localObjNames.push(`myobjects${i}`);
}
const remoteObjNames = localObjNames.map(name =>
    `${sourceBucket.bucketName}/${name}`);

async.parallel([
    next => checkers[sourceBucket.backend](sourceBucket.bucketName,
        credentials[sourceBucket.credentials], localObjNames, next),
    next => async.eachLimit(destinationBuckets, 1, (destBucket, next) => {
        return checkers[destBucket.backend](destBucket.bucketName,
                                            credentials[destBucket.credentials],
                                            remoteObjNames, next);
    }),
]);
