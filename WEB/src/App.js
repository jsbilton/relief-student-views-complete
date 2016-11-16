const React = require('react')
const ResourceForm = require('./pages/resources/person-form')


const App = React.createClass({
  render() {
    return (
      <div>
        Hello World of Relief Efforts
        <ResourceForm />
      </div>
    )
  }
})

module.exports = App
