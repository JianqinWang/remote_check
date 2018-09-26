const constants = {
    numObjs: 1,
    sourceBucket: {
        bucketName: 'testsourcebucket', // bucket name here
        credentials: 'zenko1', // name of credentials in credentials.js
        backend: 'zenko' // backend type
    },
    destinationBuckets: [{
        bucketName: 'testazure',
        credentials: 'azure1',
        backend: 'azure'
    }, {
        bucketName: 'testgcp',
        credentials: 'gcp1',
        backend: 'gcp'
    }, {
        bucketName: 'testaws',
        credentials: 'aws1',
        backend: 'aws'
    }]
}

module.exports = constants;
