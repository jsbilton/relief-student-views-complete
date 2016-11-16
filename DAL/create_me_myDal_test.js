const dal = require('./my-sql.js')

//TODO fet json ball of data
const data = {
  "firstName": "Jethro",
  "lastName": "Snodgrass",
  "phone": "(740) 421-1767",
  "email": "snodgrasss@music.net"
}

function createMe(err, result) {
  if (err) {
    console.log("YO", err)
  }
  if (result) {
    console.log("Good to Go", result)
  }
}
//then call createPerson
dal.createPerson(data, createMe)
