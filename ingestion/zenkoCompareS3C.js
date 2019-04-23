const assert = require('assert');
const async = require('async');
const AWS = require('aws-sdk');
const fs = require('fs');
const LineByLine = require('line-by-line');

function generateObjlist(s3cCred, s3cBucket, objListFileName) {
    const s3c = new AWS.S3(s3cCred);
    let s3cToken = 'init';
    const s3cParams = {
        Bucket: s3cBucket,
    };
    async.whilst(
        function() { return !!s3cToken },
        function(next) {
            if (s3cToken != 'init') {
                s3cParams.ContinuationToken = s3cToken;
            }            
            return s3c.listObjectsV2(s3cParams, (err, data) => {
                console.log(data.NextContinuationToken);
                data.Contents.forEach(data => {
                    fs.appendFileSync(objListFileName, `${data.Key}\n`);
                });
                s3cToken = data.NextContinuationToken;
                next(err);
            });
        },
        function(err) {
            console.log('done!', err);
        }
    );
}

function zenkoCompareS3C(zenkoBucket, s3cBucket, zenkoCred, s3cCred, objList) {
    const s3c = new AWS.S3(s3cCred);
    const zenko = new AWS.S3(zenkoCred);

    const lineReader = new LineByLine(objList);
    lineReader.on('line', objName => {
        lineReader.pause();
        return async.series([
            next => s3c.listObjectVersions({
                Bucket: s3cBucket,
                Prefix: objName,
                MaxKeys: 1,
            }, next),
            next => zenko.listObjectVersions({
                Bucket: zenkoBucket,
                Prefix: objName,
                MaxKeys: 1,
            }, next),
        ], (err, data) => {
            if (err) {
                console.log('eRROR', err);
            }
            const keyVerDictS3C = {};
            data[0].Versions.forEach(ver => {
                if (!keyVerDictS3C[ver.Key]) {
                    keyVerDictS3C[ver.Key] = [ver.VersionId];
                } else {
                    if (keyVerDictS3C[ver.Key].indexOf(ver.VersionId) === -1) {
                        keyVerDictS3C[ver.Key].push(ver.VersionId);
                    }
                }
            });
            const keyVerDictZenko = {};
            data[1].Versions.forEach(ver => {
                if (!keyVerDictZenko[ver.Key]) {
                    keyVerDictZenko[ver.Key] = [ver.VersionId];
                } else {
                    if (keyVerDictZenko[ver.Key].indexOf(ver.VersionId) === -1) {
                        keyVerDictZenko[ver.Key].push(ver.VersionId);
                    }
                }
            });
            Object.keys(keyVerDictS3C).forEach(key => {
                try {
                    assert.deepEqual(keyVerDictS3C[key].sort, keyVerDictZenko[key].sort);
                    keyVerDictS3C[key].forEach(versionedkey => {
                        fs.appendFileSync(`${objList}-ingested`, `${key}-${versionedkey}\n`);
                    });
                }
                catch (e) {
                    console.log('error!');
                    fs.appendFileSync(`${objList}-errors`, `${key}\n${keyVerDictS3C[key]}\n${keyVerDictZenko[key]}\n\n`);
                }
            });
            lineReader.resume();
        });
    });
}

const s3cCredentials = {
    accessKeyId: 'ALBTWCS74W925CHTJBFB',
    secretAccessKey: 'GHsIfcXZgqox=NTOgKwTqqTT44OXajgIk2C8XInL',
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    endpoint: '10.10.20.1'
}
const zenkoCredentials = {
    accessKeyId: 'XKB5SMT3BXLDN9BWI5I2',
    secretAccessKey: '8JztpCWCy2I5o4ixryDoJw4otOHu3SuC6YjHHPyq',
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    endpoint: 'zenko.local'
}
//generateObjlist(s3cCredentials, 'monday-oob-1', 'monday-oob-1.txt');
//generateObjlist(s3cCredentials, 'monday-oob-2', 'monday-oob-2.txt');
zenkoCompareS3C('monday-oob-1', 'monday-oob-1', zenkoCredentials, s3cCredentials, 'monday-oob-1.txt');
