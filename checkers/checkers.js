const localCheckZenko = require('./localCheckZenko');
const remoteCheckAWS = require('./remoteCheckAWS');
const remoteCheckAzure = require('./remoteCheckAzure');
const remoteCheckGCP = require('./remoteCheckGCP');

const checkers = {
    aws: remoteCheckAWS,
    azure: remoteCheckAzure,
    gcp: remoteCheckGCP,
    zenko: localCheckZenko
}

module.exports = checkers;