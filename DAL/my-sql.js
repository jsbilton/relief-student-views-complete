const mysql = require('mysql')
const path = require('path')
const fetchConfig = require('zero-config')

//object keys that we will export; list of methods that are exposed; way through modules to have consistancy
var dal = {
    getPerson: getPerson,
    updatePerson: updatePerson,
    createPerson: createPerson,
    deletePerson: deletePerson,
    listPersons: listPersons
    //     createView: createView,
    //     listReliefEfforts: listReliefEfforts,
    //     getReliefEffort: getReliefEffort,
    //     updateReliefEffort: updateReliefEffort,
    //     createReliefEffort: createReliefEffort,
    //     deleteReliefEffort: deleteReliefEffort
}

//////////////////////////////////////////////////////////////////
////////////////////// HELPER FUNCTIONS /////////////////////////
//////////////////////////////////////////////////////////////////

function parseToJSON(data) {
    return JSON.parse(JSON.stringify(data))
}

// function compose() {
//   // check notes for this helper function
// }

// var convertEffortNoSQLFormat = function(relief) {
//     relief.active = (relief.active === 1 ? true : false)
//     relief.type = 'relief'
//     delete relief.ID
//     return relief
// }

var convertPersonNoSQLFormat = function(person) {
    //  couch data - target
    // {
    //    "_id": "person_alex@music.net",
    //    "_rev": "1-b9d33294cf2ec039a672374f2f1eacaa",
    //    "firstName": "Alex",
    //    "lastName": "Hamilton",
    //    "phone": "976 423-9767",
    //    "email": "alex@music.net",
    //    "type": "person",
    //    "active": true
    // }
    person.active = (person.active === 1
        ? true
        : false)
    person._id = person.ID
    person.type = 'person'
    delete person.ID
    return person
}

//////////////////////////////////////////////////////////////////
////////////////////// UTILITY FUNCTIONS /////////////////////////
//////////////////////////////////////////////////////////////////
                    // This works ///
// establishing a connection and if you establish a connection you need to terminate that connection like hanging up phone
function createConnection() {
    return mysql.createConnection({
      host: "0.0.0.0",
      user: "root",
      password: "mypassword",
      database: "ReliefEffort"
  })
}
function prepDataForDB(data) {
    if (data.hasOwnProperty('active') === true) {
        data.active = data.active === true
            ? 1
            : 0
    }
    if (data.hasOwnProperty('type') === true) {
        delete data.type
    }
    return data
}


//////////////////////////////////////////////////////////////////
////////////////////// DELETE PERSONS //////////////////////////////////
//////////////////////////////////////////////////////////////////
                    // This works ///
function deleteDocById(tablename, id, cb) {
    if (typeof id == "undefined" || id === null) {
        return cb(new Error('400Missing id parameter'))
    } else {

      // creating connection to mySQL
        var connection = createConnection()
        connection.query('DELETE FROM ' + connection.escapeId(tablename) + ' WHERE id = ?', [id], function(err, result) {
            if (err)
                return cb(err)
            if (result && result.affectedRows === 0) {
                return cb({
                  error: 'not found',
                  reason: 'missing',
                  name: 'not_found',
                  status: 404,
                  message: 'missing'
              })
            } else if (result && result.affectedRows === 1) {
                return cb(null, {
                    ok: true,
                    id: id
                })
            }
        })
        // end the connection
        connection.end(function(err) {
            if (err)
                return err
        })
    }
}

//////////////////////////////////////////////////////////////////
////////////////////// GET PERSONS ///////////////////////////////
//////////////////////////////////////////////////////////////////
                      // This works ///
function getDocById(tablename, id, formatter, cb) {
    if (typeof id == "undefined" || id === null) {
        return cb(new Error('400Missing id parameter'))
    } else {

        var connection = createConnection()
        connection.query('SELECT * FROM ' + connection.escapeId(tablename) + ' WHERE id = ?', [id],
        function(err, data) {
            if (err) return err
            if (data.length === 0) {
                return cb({
                  error: 'not_found',
                  reason: 'missing',
                  name: 'not_found',
                  status: 404,
                  message: 'missing'
              })
            }
            if (data) {
                  return cb(null, JSON.stringify(formatter(data[0], null, 2)))
            }
        })
        // end the connection
        connection.end(function(err) {
            if (err)
                return err
        })
    }
}

//////////////////////////////////////////////////////////////////
////////////////////// CREATE PERSONS ////////////////////////////
//////////////////////////////////////////////////////////////////
                    // This works ///
function createPerson(data, cb) {
    if (typeof data == 'undefined' || data === null) {
        return cb(new Error('400Misssing data for create'))
    } else if (data.hasOwnProperty('_id') === true) {
        return cb(new Error('400Unnecessary id property within data ' +
            'createPerson() will generate a unique id'))
    } else if (data.hasOwnProperty('firstName') !== true) {
        return cb(new Error('400Misssing firstName property for create'))
    } else if (data.hasOwnProperty('lastName') !== true) {
        return cb(new Error('400Misssing lastName property for create'))
    } else if (data.hasOwnProperty('email') !== true) {
        return cb(new Error('400Misssing email property for create'))
    } else if (data.hasOwnProperty('phone') !== true) {
        return cb(new Error('400Misssing phone property for create'))
    } else {

        // TODO: Exercise. map function to format phone number
        var connection = createConnection()

        connection.query('INSERT INTO person SET ?', prepDataForDB(data), function(err, result) {
            if (err)
                return cb(err)
            if ((typeof result !== 'undefined' && result.insertId !== 'undefined')) {
                return cb(null, {
                    ok: true,
                    id: result.insertId
                })
            }
        })
        // end the connection
        connection.end(function(err) {
            if (err)
                return err
        })
    }
}

//////////////////////////////////////////////////////////////////
////////////////////// UPDATE PERSONS ////////////////////////////
//////////////////////////////////////////////////////////////////


// update must pass in the entire document including the id
function updatePerson(data, cb) {
  // console.log("data stuff", data)
    if (typeof data == 'undefined' || data === null) {
        return cb(new Error('400Missing data for update'))
    } else if (data.hasOwnProperty('_id') !== true) {
        return cb(new Error('400Missing id property for update'))
    } else {

        var connection = createConnection()

        var ID = data._id
        delete data._id

        connection.query('UPDATE person SET ? WHERE id = ?', + prepDataForDB(data),
        function(err, res) {
            if (err)
                return err
            if ((typeof res !== 'undefined' && res.affectedRows !== 'undefined')) {
                console.log('changed ' + res.affectedRows + ' rows')
                return cb({
                  error: 'not found',
                  reason: 'missing',
                  name: 'not_found',
                  status: 404,
                  message: 'missing'
                })
            }
            if ((typeof res !== 'undefined' && res.insertId !== 'undefined')) {
                // console.log('changed ' + res.insertId + ' rows')
                return cb(null, {
                    ok: true,
                    id: res.insertId
                })
            }
        })
        // end the connection
        connection.end(function(err) {
            if (err)
                return err
        })
    }
}

//////////////////////////////////////////////////////////////////
////////////////    LIST for PERSON FUNCTION    //////////////////
//////////////////////////////////////////////////////////////////
                    // This works ///
function queryDB(tablename, sortToken, limit, cb) {
  // function queryDB(tablename, sortBy, searchCriteria, sortToken, limit, cb) {
  if (typeof sortToken == 'undefined' || sortToken === null) {
      return cb(new Error('400Missing  sortToken parameter'))
  } else if (typeof limit == 'undefined' || limit === null || limit === 0) {
      return cb(new Error('400Missing limit parameter'))
  } else {

    // console.log('whereclause'+ whereclause)
      var connection = createConnection()
      var whereclause = sortToken === '' ? '': 'WHERE sortToken > ?'


      connection.query('SELECT * FROM ' + connection.escapeId(tablename) +
      whereclause +
      // 'WHERE ' + connection.escapeId(sortBy) + ' > ? '
      ' ORDER BY sortToken ' +
      ' LIMIT ' + limit,// [whats in here gets passed to ? above]
        function (err, data) {
          if (err) return cb(err)
          if (data.length === 0)   {
            return cb({
              error: 'not found',
              reason: 'missing',
              name: 'not_found',
              status: 404,
              message: 'missing'
            })
        }
        if (data)
          return cb(null, data)
        })
      // end the connection
      connection.end(function(err) {
          if (err) return err
      })
    }
}

//////////////////////////////////////////////////////////////////
////////////////    LIST for RELIEF FUNCTION    //////////////////
//////////////////////////////////////////////////////////////////


// function queryDB(tablename, sortToken, limit, cb) {
//   if (typeof sortToken == 'undefined' || sortToken === null) {
//       return cb(new Error('400Missing  sortToken parameter'))
//   } else if (typeof limit == 'undefined' || limit === null || limit === 3) {
//       return cb(new Error('400Missing limit parameter'))
//   } else {
//
//             var connection = createConnection()
//
//
//             connection.query('SELECT * FROM ' + connection.escapeId(tablename) +
//             ' ORBER BY sortToken' +
//             ' LIMIT ' + limit, function (err, data) {
//                 if (err) return cb(err)
//                 if (data.length === 0)   {
//                   return cb({
//                     error: 'not found',
//                     reason: 'missing',
//                     name: 'not_found',
//                     status: 404,
//                     message: 'missing'
//                   })
//               }
//             })
//
//             // end the connection
//             connection.end(function(err) {
//                 if (err) return err
//             })
//     }
// }


// function queryDB(vPerson, sortToken, limit, cb) {
//   if (typeof sortToken == 'undefined' || sortToken === null) {
//       return cb(new Error('400Missing  searchCriteria parameter'))
//   } else if (typeof limit == 'undefined' || limit === null || limit === 3) {
//       return cb(new Error('400Missing limit parameter'))
//   } else {
//
//           var connection = createConnection()
//           var whereclause = searchCriteria === '' ? '': 'WHERE sortToken > ?'
//           console.log(whereclause)
//
//           /* The second page of the paginated results*/
//           // SELECT * FROM vPerson
//           // WHERE sortToken > 'Harvey18'
//           // ORDER BY sortToken
//           // LIMIT 3;
//
//           connection.query('SELECT * FROM ' + connection.escapeId(vPerson) +
//           whereclause +
//           ' ORDER BY sortToken' +
//           ' LIMIT ' + limit, [sortToken], function (err, data) {
//             if (err) return cb(err)
//             if (data.length === 0)   {
//               return cb({
//                 error: 'not found',
//                 reason: 'missing',
//                 name: 'not_found',
//                 status: 404,
//                 message: 'missing'
//               })
//             }
//           })
//
//           // end the connection
//           connection.end(function(err) {
//               if (err) return err
//           })
//     }
// }


//////////////////////////////////////////////////////////////////
////////////    PERSONS PUBLIC FUNCTIONS for EXPORT    ///////////
//////////////////////////////////////////////////////////////////

function deletePerson(data, cb) {
    // console.log("some data ", data)
    deleteDocById('person', JSON.parse(data)._id, cb)
}

function getPerson(id, cb) {
    getDocById('person', id, convertPersonNoSQLFormat, cb)
}

function listPersons(sortBy, sortToken, limit, cb) {
    queryDB(sortBy, sortToken, limit, cb)
}

//////////////////////////////////////////////////////////////////
////////////////////// CREATE RELIEF /////////////////////////////
//////////////////////////////////////////////////////////////////

// started 11.14.16
// not sure how to address "phase" enums

function createReliefEffort(data, cb) {
    if (typeof data == 'undefined' || data === null) {
        return cb(new Error('400Misssing data for create'))
    } else if (data.hasOwnProperty('ID') === true) {
        return cb(new Error('400Unnecessary ID property within data ' +
            'createPerson() will generate a unique id'))
    } else if (data.hasOwnProperty('name') !== true) {
        return cb(new Error('400Misssing name property for create'))
    } else if (data.hasOwnProperty('organizationID') !== true) {
        return cb(new Error('400Misssing organizationID property for create'))
    } else if (data.hasOwnProperty('desc') !== true) {
        return cb(new Error('400Misssing desc property for create'))
    } else if (data.hasOwnProperty('start') !== true) {
        return cb(new Error('400Misssing start date property for create'))
    } else if (data.hasOwnProperty('end') !== true) {
        return cb(new Error('400Misssing end date property for create'))
    }


    else {

    // var enumState = {
    //   planning
    //   active
    //   completed
    // }



        var connection = createConnection()

        connection.query('INSERT INTO relief SET ?', prepDataForDB(data), function(err, result) {
            if (err)
                return cb(err)
            if ((typeof result !== 'undefined' && result.insertId !== 'undefined')) {
                return cb(null, {
                    ok: true,
                    id: result.insertId
                })
            }
        })
        // end the connection
        connection.end(function(err) {
            if (err)
                return err
        })
    }
}
//////////////////////////////////////////////////////////////////
////////////////////// RELIEF //////////////////////////////////
//////////////////////////////////////////////////////////////////

function deleteReliefEffort(data, callback) {
    deleteDocById('relief', data._id, callback)
}


function getReliefEffort(id, cb) {
    getDocById('relief', id, convertEffortNoSQLFormat, cb)
}

function listReliefEfforts() {
    listDocs(sortBy, sortToken, limit, cb)
}

// function updateReliefEffort(data, cb) {
//
// }

// how can test function with a test script

// todo: Data Validation --check the incoming data and ensure nothing is MIA or Unnecessary
// todo: change the data before the query to the db is run -- remove the "type" key in the JSON
// todo: create a connection to mySQL
// todo: query the database by performing a sql INSERT
// todo: change the JSON from mySQL to the spec for our app
// todo: call the callback, tell the API that we are done; GOOD/BAD...(err, result)
// todo: terminate the connection on mySQL
// todo: this pattern will repeat itself for each function

// know what the data looks like
// data = {
//    "_id": "person_alex@music.net",
//    "_rev": "1-b9d33294cf2ec039a672374f2f1eacaa",
//    "firstName": "Alex",
//    "lastName": "Hamilton",
//    "phone": "976 423-9767",
//    "email": "alex@music.net",
//    "type": "person",
//    "active": true
// }

module.exports = dal

//  Resource documentation
// https://www.npmjs.com/package/mysql#performing-queries
//sortToken means baseically skip all of these until you get here
