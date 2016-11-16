/*jshint esversion: 6 */
const path = require('path')
const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const fetchConfig = require('zero-config')

var config = fetchConfig(path.join(__dirname, '..'), {dcValue: 'test'})
const urlFormat = require('url').format
const db = new PouchDB(urlFormat(config.get("couch")))

//these properties rep functions except for helper functions
//object keys that we will export
var dal = {
    getPerson: getPerson,
    updatePerson: updatePerson,
    createPerson: createPerson,
    deletePerson: deletePerson,
    listPersons: listPersons,
    createView: createView,
    listReliefEfforts: listReliefEfforts,
    getReliefEffort: getReliefEffort,
    updateReliefEffort: updateReliefEffort,
    createReliefEffort: createReliefEffort,
    deleteReliefEffort: deleteReliefEffort
}

/////////////////////////
//  UTILITY FUNCTIONS
/////////////////////////
var convertPersons = function(queryRow) {
    queryRow.doc.sortToken = queryRow.key;
    return queryRow.doc;
}

function listDocs(sortBy, startkey, limit, callback) {
    if (typeof sortBy == "undefined" || sortBy === null) {
        return callback(new Error("Missing search parameter"), null)
    }
    limit = startkey !== ''
        ? limit += 1
        : limit

    console.log('sortBy:', sortBy)
    console.log('startkey:', startkey)
    console.log('limit:', limit)

    db.query(sortBy, {
        startkey: startkey,
        limit: limit,
        include_docs: true
    }, function(err, data) {
        if (err)
            return callback(err)
        if (startkey !== '') {
            data.rows.shift()
        }
        if (data)
            return callback(null, data)
    })
}

// function queryDB(sortBy, startkey, limit, callback) {
//     if (typeof startkey == "undefined" || startkey === null) {
//         return callback(new Error('Missing search parameter'));
//     } else if (typeof limit == "undefined" || limit === null || limit === 0) {
//         return callback(new Error('Missing limit parameter'));
//
//     } else {
//         limit = startkey === '' ? Number(limit) : Number(limit) + 1;
//
//         console.log("sortBy:", sortBy, " startkey: ", startkey, " limit: ", limit)
//
//         //////     PROMISES
//         db.query(sortBy, {
//             startkey: startkey,
//             limit: limit,
//             include_docs: true
//         }).then(function(result) {
//             // Do we need to skip (remove/shift) the first item
//             //  out of the array
//             if (startkey !== '' && result.rows.length > 0) {
//                 // remove first item
//                 result.rows.shift();
//             }
//             return callback(null, result.rows.map(convertPersons));
//         }).catch(function(err) {
//             return callback(err);
//         });
//
//         //////     CALLBACKS
//         // db.query(sortBy, {
//         //     startkey: startkey,
//         //     limit: limit,
//         //     include_docs: true
//         // }, function(err, result) {
//         //     if (err) return callback(err);
//         //     if (result) {
//         //         // Do we need to skip (remove/shift) the first item
//         //         //  out of the array
//         //         if (startkey !== '' && result.rows.length > 0) {
//         //             // remove first item
//         //             result.rows.shift();
//         //         }
//         //         return callback(null, result.rows.map(convertPersons));
//         //     }
//         // });
//     }
// }

function getDocByID(id, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof id == "undefined" || id === null) {
        return callback(new Error('400Missing id parameter'));
    } else {

        //////     PROMISES
        // db.get(id).then(function(response) {
        //     return callback(null, response);
        // }).catch(function(err) {
        //     return callback(err);
        // });

        //////     CALLBACKS
        db.get(id, function(err, data) {
            if (err)
                return callback(err);
            if (data)
                return callback(null, data);
            }
        );
    }
}

function createView(designDoc, callback) {
    if (typeof designDoc == "undefined" || designDoc === null) {
        return callback(new Error('400Missing design document.'));
    } else {

        //////     PROMISES
        db.put(designDoc).then(function(response) {
            return callback(null, response);
        }).catch(function(err) {
            return callback(err);
        });

        //////     CALLBACKS
        // db.put(designDoc, function(err, response) {
        //     if (err) return callback(err);
        //     if (response) return callback(null, response);
        // });
    }
}

function updateDoc(data, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for update'));
    } else if (data.hasOwnProperty('_id') !== true) {
        return callback(new Error('400Missing id property from data'));
    } else if (data.hasOwnProperty('_rev') !== true) {
        return callback(new Error('400Missing rev property from data'));
    } else {

        //////     PROMISES
        // attempt to db.get() doc out of db,
        // if it's not there, it can't be updated.
        //    db.get(data._id).then(function(doc) {
        //      return db.put(data);
        //    }).then(function(response) {
        //        return callback(null, response)
        //    }).catch(function(err) {
        //        return callback(err)
        //    });

        // db.put(data).then(function(response) {
        //     return callback(null, response);
        // }).catch(function(err) {
        //     return callback(err);
        // });

        //////     CALLBACKS
        db.put(data, function(err, response) {
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
    }
}

function deleteDoc(data, callback) {
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for delete'));
    } else if (data.hasOwnProperty('_id') !== true) {
        return callback(new Error('400Missing _id property from delete'));
    } else if (data.hasOwnProperty('_rev') !== true) {
        return callback(new Error('400Missing _rev property from delete'));
    } else {
        //////     PROMISES
        // db.remove(data).then(function(response) {
        //     return callback(null, response);
        // }).catch(function(err) {
        //     return callback(err);
        // });

        //////     CALLBACKS
        db.remove(data, function(err, response) {
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
    }

}

///////////////////////////////////////////////////////////////////////////
//                              PERSONS
///////////////////////////////////////////////////////////////////////////
function getPerson(id, callback) {
    getDocByID(id, callback);
}

// function listPersons(sortBy, startkey, limit, callback) {
//     queryDB(sortBy, startkey, limit, callback);
// }

function updatePerson(data, callback) {
    updateDoc(data, callback);
}

function deletePerson(data, callback) {
    deleteDoc(data, callback);
}

function createPerson(data, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for create'));
    } else if (data.hasOwnProperty('_id') === true) {
        return callback(new Error('400Unnecessary id property within data.'));
    } else if (data.hasOwnProperty('_rev') === true) {
        return callback(new Error('400Unnecessary rev property within data'));
    } else if (data.hasOwnProperty('lastName') !== true) {
        return callback(new Error('400Missing lastName property within data'));
    } else if (data.hasOwnProperty('firstName') !== true) {
        return callback(new Error('400Missing firstName property within data'));
    } else if (data.hasOwnProperty('email') !== true) {
        return callback(new Error('400Missing email property within data'));
    } else {

        /// sets properties if nothing wrong
        data.active = true
        data.type = 'person'
        data._id = 'person_' + data.email

        //////     PROMISES
        // db.put(data).then(function(response) {
        //     return callback(null, response);
        // }).catch(function(err) {
        //     return callback(err);
        // });

        //////     CALLBACKS
        db.put(data, function(err, response) {
            if (err)
                return callback(err)
            if (response)
                return callback(null, response)
            }
        )
    }
}

// function listReliefEfforts(sortBy, startkey, limit, callback) {
//   if (typeof sortBy == "undefined" || sortBy === null) {
//     return callback(new Error("Missing search parameter"), null)
//   }
//   limit = startkey !== '' ? limit += 1 : limit
//
//   console.log('sortBy:', sortBy)
//   console.log('startkey:', startkey)
//   console.log('limit:', limit)
//
//   db.query('lastNameView', {
//       startkey: startkey,
//       limit: limit,
//       include_docs: true
//   }, function(err, data) {
//     if (err) return callback(err)
//     if (startkey !== '') {
//       data.rows.shift()
//     }
//     if (data) return callback(null, data)
//   })
// }

function listPersons(sortBy, startkey, limit, callback) {
    listDocs(sortBy, startkey, limit, callback)
}

function listReliefEfforts(sortBy, startkey, limit, callback) {
    listDocs(sortBy, startkey, limit, callback)
}

// function listPersons(sortBy, startkey, limit, callback) {
//     ///////// validate our params
//     if (typeof sortBy == "undefined" || sortBy === null) {
//       return callback(new Error("Missing search parameter"), null)
//     }
//     limit = startkey !== '' ? limit += 1 : limit
//
//     console.log('sortBy:', sortBy)
//     console.log('startkey:', startkey)
//     console.log('limit:', limit)
//
//     db.query('lastNameView', {
//         startkey: startkey,
//         limit: limit,
//         include_docs: true
//     }, function(err, data) {
//       if (err) return callback(err)
//       if (startkey !== '') {
//         data.rows.shift()
//       }
//       if (data) return callback(null, data)
//     })
// }

//////////////////////////////////////////////////////////////////////
//                       RELIEF EFFORTS
//////////////////////////////////////////////////////////////////////
function getReliefEffort(id, callback) {
    getDocByID(id, callback)
}

function updateReliefEffort(data, callback) {
    updateDoc(data, callback)
}

function deleteReliefEffort(data, callback) {
    deleteDoc(data, callback)
}

function createReliefEffort(data, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for create'))
    } else if (data.hasOwnProperty('_id') === true) {
        return callback(new Error('400Unnecessary _d property within data. ' +
            'createPerson() will generate a unique _id'))
    } else if (data.hasOwnProperty('_rev') === true) {
        return callback(new Error('400Unnecessary rev property within data'))
    } else if (data.hasOwnProperty('phase') !== true) {
        return callback(new Error('400Missing phase property within data'))
    } else if (data.hasOwnProperty('name') !== true) {
        return callback(new Error('400Missing name property within data'))
    } else if (data.hasOwnProperty('organizationID') !== true) {
        return callback(new Error('400Missing organizationID property within data'))
    } else {
        data.active = true
        data.type = 'relief'
        data._id = 'relief_' + data.organizationID.replace(/ /g, "_").replace(/\./g, "") + '_' + data.name.replace(/ /g, "_")

        //////     PROMISES
        db.put(data).then(function(response) {
            return callback(null, response)
        }).catch(function(err) {
            return callback(err)
        });

        //////     CALLBACKS
        // db.put(data, function(err, response) {
        //     if (err) return callback(err);
        //     if (response) return callback(null, response);
        // });
    }
}

module.exports = dal
