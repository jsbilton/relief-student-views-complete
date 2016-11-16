const dal = require('./my-sql.js')

//  TODO get json ball of data
const data = {
  "_id": 27,
  "firstName": "James",
  "lastName": "Sinclair",
  "phone": "(970) 420-9767",
  "email": "mim@music.net"
}


function deleteMe(err, result) {
  if (err) {
    console.log("YO", err)
  }
  if (result) {
    console.log("Good to Go", result)
  }
}
//then call deletePerson
dal.deletePerson(data, deleteMe)
