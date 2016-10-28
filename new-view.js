// Create a new view that sorts relief efforts by "phase" and "name".
//   key (with an array)
// Return a json object containing
//   relief effort name
//   phase
//   start date
//   end date
//     value object
// Save your work in a file named new-view.js
// Use the addViews.js as an example.


const dalNoSQL = require('./DAL/no-sql.js')

var designDoc4 = {
    _id: '_design/reliefEffortsPhaseName',
    views: {
        'reliefEffortsPhaseName': {
            map: function(doc) {
              if (doc.type === 'relief') {
                  emit([doc.phase, doc.name], {
                    "reliefName": doc.name,
                    "phase": doc.phase,
                    "startDate": doc.start,
                    "endDate": doc.end
                  })
              }
            }.toString()
        }
    }
}

dalNoSQL.createView(designDoc4, function cb(err, data) {
  if (err) console.log(err)
  if (data) console.log(data)
})
