const dalNoSQL = require('./DAL/no-sql.js')

var theListCallback = function (err, resultFromQuery) {
    if (err) console.log(err.message)
    console.log(JSON.stringify(resultFromQuery, null, 4))
  }

// const sortBy = 'lastNameView'
// const startkey = ''
// const limit = 5

///  you can start pagination in the '< here >' from the point where you left off to start
// const sortBy = 'lastNameView'
// const startkey = "Jonesperson_lar@dukrye.edu"
// const limit = 5

const sortBy = 'reliefEfforts'
const startkey = ''
const limit = 3

// const sortBy = 'emailView'
// const startkey = "Jeffersonperson_TJ@dentalone.com"
// const limit = 5


dalNoSQL.listReliefEfforts(sortBy, startkey, limit, theListCallback)
// dalNoSQL.listPersons(sortBy, startkey, limit, theListCallback)
