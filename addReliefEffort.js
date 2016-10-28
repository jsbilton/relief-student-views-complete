/*jshint esversion: 6 */
////////////////////
//     NO SQL
////////////////////

// To run program.js from terminal, ensure you are in the correct directory
//  and run the following command:
// $ NODE_ENV=production node addReliefEffort.js

const dalNoSQL = require('./DAL/no-sql.js');

const reliefEffortData = [
    {
        "phase": "completed",
        "name": "Hurricane Hugo 1989",
        "organizationID": "Hurricane Helpers",
        "desc": "Purricane Hugo was a powerful Cape Verde-type hurricane that caused widespread damage and loss of life in the Leeward Islands, Puerto Rico, and the Southeast United States in 1989",
        "start": "1989-09-10",
        "end": "1989-09-25",
        "active": true
    }, {
        "type": "relief",
        "phase": "completed",
        "name": "Haiti 2015",
        "organizationID": "St. Phillips",
        "desc": "Build school desks and blackboards at the St. Esprit (Holy Spirit) church and school in the remote village of Gros Mangle in the island of La Gonave, Haiti. Home base is located in the main town of Anse - à - Galets at the St.François d’ Assise church and school.",
        "start": "2015-09-25",
        "end": "2015-10-01",
        "team": [
            {
                "name": "Steve Ananias",
                "role": "Team Leader",
                "personID": "person_stevean@duke.edu"
            }, {
                "name": "Libby Satterfield",
                "role": "Team member",
                "personID": "person_lsat1972@gmail.com"
            }, {
                "name": "Judy Jones",
                "role": "Team member",
                "personID": "person_judy5555@aol.com"
            }
        ]
    }, {
        "type": "relief",
        "phase": "planning",
        "name": "Haiti 2017",
        "organizationID": "St. Phillips",
        "desc": "Provide dental services, education, and supplies to the village of Gros Mangle on the island of La Gonave, Haiti.  Island of La Gonave, Haiti. Home base is located in the main town of Anse - à - Galets at the St.François d’ Assise church and school.The bulk of the mission work will take place at St.Esprit(Holy Spirit) church and school in the remote village of Gros Mangle, Haiti.The team will consist of team leaders, dentists, and dental hygienists.",
        "start": "2016-11-01",
        "end": "2016-11-08",
        "team": [
            {
                "name": "Steve Harvey",
                "role": "Team Leader",
                "personID": "person_steveharvey1111@gmail.com"
            }, {
                "name": "Libby Satterfield",
                "role": "Team member",
                "personID": "person_lsat1972@gmail.com"
            }, {
                "name": "Jimmy Martin",
                "role": "Team member",
                "personID": "person_JimmyMartinJr@gmail.com"
            }
        ]
    }, {
        "phase": "completed",
        "name": "Kenya 2015",
        "organizationID": "St. Phillips",
        "desc": "Build school in Kenya",
        "start": "2015-01-05",
        "end": "2015-02-15"
    }, {
        "type": "relief",
        "phase": "completed",
        "name": "Kenya 2016",
        "organizationID": "St. Phillips",
        "desc": "Build hospital in Kenya",
        "start": "2016-01-05",
        "end": "2016-02-15",
        "active": true
    }, {
        "name": "Hurricane Matthew 2016",
        "type": "relief",
        "phase": "completed",
        "organizationID": "St. Stephen",
        "desc": "Built homeless",
        "start": "2016-10-7",
        "end": "2016-11-8",
        "active": true
    }, {
        "name": "Hurricane Gracie 1959",
        "type": "relief",
        "phase": "completed",
        "organizationID": "St. Stephen",
        "desc": "Built for speed",
        "start": "1959-06-19",
        "end": "1966-08-12",
        "active": false
    }, {
        "name": "Hurricane Garcia 1942",
        "type": "relief",
        "phase": "completed",
        "organizationID": "St. Stephen",
        "desc": "Built to last",
        "start": "1942-08-01",
        "end": "1995-08-09",
        "active": false
    }, {
        "name": "Hurricane Weir 1948",
        "type": "relief",
        "phase": "completed",
        "organizationID": "St. Stephen",
        "desc": "Sugar Magnolia",
        "start": "1949-10-16",
        "end": "2018-09-17",
        "active": true
    }, {
        "name": "Hurricane Lesh 1940",
        "type": "relief",
        "phase": "completed",
        "organizationID": "St. Stephen",
        "desc": "Pride of Cucamonga",
        "start": "1940-03-24",
        "end": "2019-11-29",
        "active": true
    }, {
        "name": "Hurricane Kringle 1212",
        "type": "relief",
        "phase": "completed",
        "organizationID": "St. Nicholas",
        "desc": "Build giving for stuff",
        "start": "1212-12-24",
        "end": "2016-12-25",
        "active": true
    }, {
        "name": "Hurricane Newman 1967",
        "type": "relief",
        "phase": "completed",
        "organizationID": "St. Jerry",
        "desc": "Deliver mail even on rainy days",
        "start": "1967-10-04",
        "end": "2019-08-15",
        "active": true
    }, {
        "name": "Hurricane Kramer 1960",
        "type": "relief",
        "phase": "completed",
        "organizationID": "Kramerica",
        "desc": "Meeting the cosmos",
        "start": "1960-06-14",
        "end": "1983-06-13"
    }, {
        "name": "Hurricane Benes 1969",
        "type": "relief",
        "phase": "completed",
        "organizationID": "St. George",
        "desc": "Sugar tweed",
        "start": "1969-06-09",
        "end": "2014-09-31"
    }, {
        "name": "Hurricane Ramathorn 1964",
        "type": "relief",
        "phase": "completed",
        "organizationID": "St. Farva",
        "desc": "Littering and littering and",
        "start": "1964-03-12",
        "end": "2000-02-28"
    }
];

function callback(msgHeader) {
    return function(err, response) {
        if (err)
            return console.log('ERROR:\n', err.message)
        return console.log(msgHeader, response)
    }
}

reliefEffortData.forEach(function(reliefEffort, index) {
    dalNoSQL.createReliefEffort(reliefEffort, callback('RELIEF EFFORT CREATED:\n'))
})

//console.log(dalNoSQL.getDBInfo());
