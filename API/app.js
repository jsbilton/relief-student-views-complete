////////////////////// ////////////////////// //////////////////////
//////////////////////     REQUIREMENTS   //////////////////////
////////////////////// ////////////////////// //////////////////////
const express = require('express')
const HTTP = require('http')
const port = process.env.PORT || 3000 //injecting the env var
var app = express()
const HTTPError = require('node-http-error')
// const dal = require('../DAL/no-sql.js')
const dal = require('../DAL/my-sql.js')
const bodyParser = require('body-parser')
var cors = require('express-cors')

/////////////////     EXPRESS CORS    //////////////////////
// app.use(cors({
//     allowedOrigins: [
//         'http://localhost:8080/persons'
//     ]
// }))

/////////////       BODY PARSER     ////////////////////////////
app.use(bodyParser.json())

/////////////         TESTER        //////////////////////////////
app.get('/', function(req, res) {
    res.send('HELLO WORLD!!!')
})

////////////////////// ////////////////////// //////////////////////
//////////////////////    Get Bad request   //////////////////////
////////////////////// ////////////////////// /////////////////////

app.get('/bad', function(req, res, next) {
    var badError = new HTTPError(400, "message: Error", {
        "developerMessage": "Verbose, plain language description of the problem for the app developer with hints about how to fix it.",
        "userMessage": "Pass this message on to the app user if needed."
    })
    next(badError)
})

////////////////////// ////////////////////// //////////////////////
//////////////////   retrieve a relief effort  //////////////////////
////////////////////// ////////////////////// //////////////////////

app.get('/reliefefforts/:id/', function(req, res, next) {
    var reliefEffortId = req.params.id

    dal.getReliefEffort(reliefEffortId, function(err, data) {
        if (err) {
            var responseError = BuildResponseError(err);
            return next(new HTTPError(responseError.status, responseError.message, responseError));
        }
        if (data) {
            console.log("GET" + req.path, data)
            res.append("Content-type", "application/json")
            res.status(200).send(data)
        }
    })
})

////////////////////// ////////////////////// //////////////////////
///////////    helper res error builder function  //////////////////
////////////////////// ////////////////////// //////////////////////
function BuildResponseError(err) {

    // no sql error message example
    //     { id: 'person_jackiekennedyo1922@gmail.org',
    // error: 'conflict',
    // reason: 'Document update conflict.',
    // name: 'conflict',
    // status: 409,
    // message: 'Document update conflict.',
    // ok: true }
    //
    // // custom DAL validation message example
    //
    // {
    // error: 'Bad Request',
    // reason: 'Unnecessary _id property within data.'
    // name: 'Bad Request',
    // status: 400,
    // message: 'Unnecessary _id property within data.',
    // ok: true }

    // if the first three characters are a number then return the error code otherwise
    //  default to 400 (bad request)
    const statuscheck = isNaN(err.message.substring(0, 3)) === true
        ? "400"
        : err.message.substring(0, 3)
    const status = err.status
        ? Number(err.status)
        : Number(statuscheck)
    const message = err.status
        ? err.message
        : err.message.substring(3)
    const reason = message
    const error = status === 400
        ? "Bad Request"
        : err.name
    const name = error

    var errormsg = {}
    errormsg.error = error
    errormsg.reason = reason
    errormsg.name = name
    errormsg.status = status
    errormsg.message = message

    //   { error: 'Bad Request',
    // reason: 'Missing email property within data',
    // name: 'Bad Request',
    // status: 400,
    // message: 'Missing email property within data' }
    console.log("BuildResponseError-->", errormsg)
    return errormsg
}

////////////////////// ////////////////////// //////////////////////
//////////////////////     retrieve a person //////////////////////
////////////////////// ////////////////////// //////////////////////

app.get('/persons/:id', function(req, res, next) {
    var personId = req.params.id

    dal.getPerson(personId, function(err, data) {
        if (err) {
            var responseError = BuildResponseError(err);
            return next(new HTTPError(responseError.status, responseError.message, responseError));
        }

        if (data) {
            console.log("GET", req.path, data)
            res.append("Content-type", "application/json")
            res.status(200).send(data)
        }
    })
})

////////////////////// ////////////////////// //////////////////////
//////////////////////     create a person    //////////////////////
////////////////////// ////////////////////// //////////////////////

app.post('/persons', function(req, res, next) {
    console.log(req.body)

    dal.createPerson(req.body, function(err, createdPerson) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError))
        }
        if (createdPerson) {
            console.log("POST", req.path, createdPerson)
            res.append("Content-type", "application/json")
            res.status(201).send(createdPerson)
        }
    })
})

////////////////////// ////////////////////// //////////////////////
//////////////////////  create a relief effort  ////////////////////
////////////////////// ////////////////////// //////////////////////

app.post('/reliefefforts', function(req, res, next) {
    console.log(req.body);

    dal.createReliefEffort(req.body, function(err, createdRelief) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError))
        }
        if (createdRelief) {
            console.log("POST", req.path, createdRelief)
            res.append('Content-type', 'application/json')
            res.status(201).send(createdRelief)
        }
    })
})

////////////////////// ////////////////////// //////////////////////
//////////////////////     delete a person    //////////////////////
////////////////////// ////////////////////// //////////////////////

app.delete('/persons/:id', function(req, res, next) {
    const personId = req.params.id
    dal.getPerson(personId, function callback(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError))
        }
        if (data) {
            dal.deletePerson(data, function callback(deletedErr, deletedPerson) {
                if (deletedErr) {
                    var responseError = BuildResponseError(deletedErr)
                    return next(new HTTPError(responseError.status, responseError.message, responseError))
                }
                if (deletedPerson) {
                    console.log("DELETE", deletedPerson)
                    res.append('Content-type', 'application/json')
                    res.status(200).send(deletedPerson)
                }
            })
        }
    })
})

////////////////////// ////////////////////// //////////////////////
///////////////////    delete a relief effort   ////////////////////
////////////////////// ////////////////////// //////////////////////

app.delete('/reliefefforts/:id', function(req, res, next) {
    const reliefEffortId = req.params.id
    dal.getReliefEffort(reliefEffortId, function callback(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError))
        }
        if (data) {
            dal.deleteReliefEffort(data, function callback(deletedEffortErr, deletedEffort) {
                if (deletedEffortErr) {
                    var responseError = BuildResponseError(deletedEffortErr)
                    return next(new HTTPError(responseError.status, responseError.message, responseError))
                }
                if (deletedEffort) {
                    console.log("DELETE", deletedEffort)
                    res.append('Content-type', 'application/json')
                    res.status(200).send(deletedEffort)
                }
            })
        }
    })
})

////////////////////// ////////////////////// //////////////////////
///////////////////    update a person          ////////////////////
////////////////////// ////////////////////// //////////////////////

app.put('/persons/:id', function(req, res, next) {
    const personId = req.params.id

    // console.log("personID: ", personId)
    // console.log("req.body_id", req.body._id)
    // console.log("these two are: ", parseInt(personId) !== parseInt(req.body._id))


    if (parseInt(personId) !== parseInt(req.body._id)) {
      console.log("YOU ARE INSIDE")
      var myErrMsg = new HTTPError(404, 'callback error', {
              message: "ROUTE ID DOES NOT MATCH BODY ID",
              method: req.method,
              path: req.path
          })
      return next(myErrMsg)
    }
    dal.getPerson(personId, function callback(err, data) {
      console.log("back from dal getPerson", personId)
        if (err) {
          console.log("err stuff", err);
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError))
        }
        if (data) {
              console.log("data stuff", data)
            var reqBody = req.body
              console.log("req body stuff", reqBody)
            reqBody._rev = data._rev // get most recent rev for this person doc
              console.log("reqBody data rev", reqBody._rev)
            dal.updatePerson(reqBody, function callback(updatedErr, updatedPerson) {
                if (updatedErr) {
                    var responseError = BuildResponseError(updatedErr)
                    return next(new HTTPError(responseError.status, responseError.message, responseError))
                }
                if (updatedPerson) {
                    console.log("UPDATE", updatedPerson)
                    res.append('Content-type', 'application/json')
                    res.status(200)
                    res.write(updatedPerson)
                    res.end()
                }
            })
        }
    })
})

////////////////////// ////////////////////// //////////////////////
///////////////////    update a relief effort   ////////////////////
////////////////////// ////////////////////// //////////////////////

app.put('/reliefefforts/:id', function(req, res, next) {
    const reliefId = req.params.id
    if(reliefId === req.body._id) {
    return new HTTPError(404, 'callback error', {
            message: "ROUTE ID DOES NOT MATCH BODY ID",
            method: req.method,
            path: req.path
        })}

    dal.getReliefEffort(reliefId, function callback(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError))
        }
        if (data) {
          var reqBody = req.body
          reqBody._rev = data._rev
            dal.updateReliefEffort(reqBody, function callback(updatedEffortErr, updatedEffort) {
                if (updatedEffortErr) {
                    var responseError = BuildResponseError(updatedEffortErr)
                    return next(new HTTPError(responseError.status, responseError.message, responseError))
                }
                if (updatedEffort) {
                    console.log("UPDATE", updatedEffort)
                    res.append('Content-type', 'application/json')
                    res.status(200).send(updatedEffort)
                }
            })
        }
    })
})


////////////////////// ////////////////////// //////////////////////
///////////////////    List Persons      ////// ////////////////////
////////////////////// ////////////////////// //////////////////////

app.get('/persons', function(req, res, next) {
    const sortByParam = req.query.sortby || 'vPerson'   //  for no-sql ...'lastNameView' for my-sql ... 'vPerson'
    const sortBy = sortByParam
    const sortToken = req.query.sorttoken || ''
    const limit = req.query.limit || 5

// added sortByParam as a parameter then i removed it
    dal.listPersons(sortBy, sortToken, limit, function callback(err, data) {
        if (err) {
            var responseError= BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError))
        }
        if (data) {
            res.send(data)
        }
    })
})

////////////////////// ////////////////////// //////////////////////
///////////////////    List Relief Efforts   // ////////////////////
////////////////////// ////////////////////// //////////////////////

app.get('/reliefEfforts', function(req, res) {
    const sortByParam = req.query.sortby || 'reliefEfforts'
    const sortBy = sortByParam
    const sortToken = req.query.sorttoken || ''
    const limit = req.query.limit || 5

    dal.listReliefEfforts(sortBy, sortToken, limit, function callback(err, data) {
        if (err) {
            var responseError = BuildResponseError(err)
            return next(new HTTPError(responseError.status, responseError.message, responseError))
        }
        if (data) {
            res.send(data)
        }
    })
})



////////////////////// ////////////////////// //////////////////////
///////////     error handler, load middleware     /////////////////
////////////////////// ////////////////////// //////////////////////
app.use(function(err, req, res, next) {
    console.log(req.method, '', req.path, ' err:', err)
    res.status(err.status || 500)
    res.send(err)
})

// app.use(function (err, req, res, next) {
//   console.log(err)
//   res.status(err.status || 500).send(err)
// })

////////////////////// ////////////////////// //////////////////////
//////////////////////   Start Server       //////////////////////
////////////////////// ////////////////////// //////////////////////
app.listen(port, function() {
    console.log('opened server on', "port: ", port)
})

// var server = http.createServer(app)
// server.listen(port, function () {
//   console.log('Server listening on: ', server.address())
// })
