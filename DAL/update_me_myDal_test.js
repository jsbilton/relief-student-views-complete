const dal = require('./my-sql.js')

//TODO fet json ball of data
const data = {
     "_id": 11,
     "firstName": "Alexander Aaron",
     "lastName": "Hamilton",
     "phone": "(976) 423-9767",
     "email": "linmanuel@ispoppingoff.net",
     "active": true
}

function updateMe(err, result) {
  if (err) {
    console.log("YO", err)
  }
  if (result) {
    console.log("Good to Go", result)
  }
}
//then call createPerson
// dal.createPerson(data, checkMe)
// console.log(dal)

dal.updatePerson(data, updateMe)
