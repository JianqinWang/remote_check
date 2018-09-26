const credentials = {
    zenko1: {
        accessKeyId: '',
        secretAccessKey: '',
        sslEnabled: false,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        endpoint: "http://zenko.local"
    },
    aws1: {
        accessKeyId: '',
        secretAccessKey: '',
        sslEnabled: false,
        s3ForcePathStyle: true,
        signatureVersion: 'v4'
    },
    azure1: {
        storageAccount: '',
        storageAccessKey: '',
        host: ''
    },
    gcp1: {
        projectId: '',
        keyFilename: './gcp_key1.json'
    }
}

module.exports = credentials;
