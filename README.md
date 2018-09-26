# remote_check

This is a quick program where users can thoroughly check that objects have been
replicated to destination backends (as expected).

Considering that the program is querying each backend x number of times (where 
x is the number of objects on the source), this can become a relatively
expensive test.

With that in mind, if you have trust issues (like me), this will be a good way
to check that 1. the replication status on the source object is correct and 2.
users can retrieve the replicated object directly from the destination sources.

## Quickstart Guide

At this time, the setup process is slightly convoluted.
The 2 main files I will cover below are `example.credentials.js` and
`constants.js`

1. Change the name (or make a copy) of `example.credentials.js` to
`credentials.js`
2. In `credentials.js`, update your cloud backend credentials to use your
access values.
    a. Name each profile accordingly, as you will need to reference them later
    in `constants.js`.
    b. For Azure type backends, you can use an access string as the value for
    `storageAccount`, and leave `storageAccessKey` and `host` blank.
    c. For GCP type backends, the `projectId` can be found in your gcp browser
    settings. The `keyFilename` should be the path to your private key file. An
    example `example.gcp_key1.json` file has been given as an example. 
3. In `constants.js`, update the values accordingly.
    a. The `destinationBuckets` value should be an array of objects. The
    `credentials` value for each object should correspond to a valid profile in
    `credentials.js`.
    b. For `backend`, the supported values are currently `zenko`, `gcp`, `aws`,
    and `azure`.
    c. The `bucketName` should be the destination bucket or container name.
    d. `numObjs` is the number of objects you put, and `objnamePrefix` is the
    object name prefix that you choose to use. This program is assuming that the
    objects you are looking for were uploaded cosbench style, with all objects
    uploaded in the same test named in ascending numerical order. i.e. cosbench
    objects are named [myobjects1, myobjects2, myobjects3 ...] and so on.
4. Run `npm start`. It will stop all tests and log the error.
    Note: errors due to timeouts (most commonly seen with Azure) are not retried

## To-do list
Since there is a draft, there are many other things that are lined up to improve.
The below list is not inclusive of all issues.
1. Retries for objects that failed for reasons other than 404 (example: very
    common to see `ECONNRESET` from Azure)
2. More thorough testing for each object (compare object hashes, metadata, etc)

