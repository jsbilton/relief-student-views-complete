/*jshint esversion: 6 */
////////////////////
//     NO SQL
////////////////////

// To run program.js from terminal, ensure you are in the correct directory
//  and run the following command:
// $ NODE_ENV=production node addPerson.js

const dalNoSQL = require('./DAL/no-sql.js');

// person data. Use to test the createPerson() function within your DAL,
// Make INDIVIDUAL calls to the createPerson() function within your DAL
// with each person within the array.
const personData = [{
    firstName: "Jimmy",
    lastName: "Martin",
    phone: "404 394-2479",
    email: "JimmyMartinJr@gmail.com",
    type: "person",
    active: true
},{
    firstName: "Tom",
    lastName: "Jefferson",
    phone: "843 444-4444",
    email: "TJ@dentalone.com",
    type: "person",
    active: true
},{
    firstName: "Wyatt",
    lastName: "Johnston",
    phone: "843 222-1212",
    email: "WyattJ1111@gmail.com",
    type: "person",
    active: true
},{
    firstName: "Gary",
    lastName: "Johnson",
    phone: "843 555-9876",
    email: "gary.johnson1971@gmail.com",
    type: "person",
    active: true
},{
    firstName: "Judy",
    lastName: "Jones",
    phone: "843 555-5555",
    email: "judy5555@aol.com",
    type: "person",
    active: true
},{
    firstName: "Libby",
    lastName: "Satterfield",
    phone: "843 888-8438",
    email: "lsat1972@gmail.com",
    type: "person",
    active: true
},{
    firstName: "Steve",
    lastName: "Ananias",
    phone: "843 555-1515",
    email: "stevean@duke.edu",
    type: "person",
    active: true
},{
  firstName: "Chipper",
  lastName: "Jones",
  phone: "864 563-1015",
  email: "chip@duke.edu",
  type: "person",
  active: false
},{
  firstName: "Larry",
  lastName: "Jones",
  phone: "864 560-1815",
  email: "lar@dukrye.edu",
  type: "person",
  active: true
},{
  firstName: "Jared",
  lastName: "Blones",
  phone: "864 569-1015",
  email: "jaredn@duke.edu",
  type: "person",
  active: true
},{
  firstName: "Tom",
  lastName: "Jones",
  phone: "823 453-3017",
  email: "youdetd@duke.edu",
  type: "person",
  active: true
},{
  firstName: "Larry",
  lastName: "Walker",
  phone: "864 354-1995",
  email: "lw@octech.edu",
  type: "person",
  active: true
},{
  firstName: "Hipper",
  lastName: "Gnomes",
  phone: "684 553-0310",
  email: "stevean@duke.edu",
  type: "person",
  active: true
},{
  firstName: "Chris",
  lastName: "Stapleton",
  phone: "679 123-6738",
  email: "chris@music.com",
  type: "person",
  active: true
},{
  firstName: "Nathan",
  lastName: "Lane",
  phone: "239 143-9730",
  email: "lane@music.com",
  type: "person",
  active: true
},{
  firstName: "Alex",
  lastName: "Hamilton",
  phone: "976 423-9767",
  email: "alex@music.net",
  type: "person",
  active: true
},{
  firstName: "John",
  lastName: "Hamm",
  phone: "914 418-7463",
  email: "hamm@bone.net",
  type: "person",
  active: true
}]

function callback (msgHeader) {
  return function (err, response) {
    if (err) return console.log('ERROR:\n', err.message)
    return console.log(msgHeader, response)
  }
}

personData.forEach(function(person) {
  dalNoSQL.createPerson(person, callback('PERSON CREATED:\n'))
})
