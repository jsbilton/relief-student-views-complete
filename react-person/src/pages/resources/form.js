const React = require('react')
const dbUrl = process.env.REACT_APP_DB
const PouchDB = require('pouchdb-http')
const db = PouchDB(dbUrl)

const ResourceForm = React.createClass({
  getInitialState () {
    return {
      resources: {
        lastName: '',
        firstName: '',
        email: '',
        phone: ''
      }
    }
  },
  handleChange(field) {
    return e => {
      let resource = this.state.resources
      resource[field] = e.target.value
      this.setState({ resource })
    }
  },
  handleSubmit(e) {
    e.preventDefault()



  },
  render () {
    return (
      <div>
        <h1>Hello Girls</h1>
        <form
          onSubmit={this.handleSubmit}>
          <div>
            <label>Last Name</label>
              <input
                onChange={this.handleChange('lastName')}
                values={this.state.resources.lastName}/>
          </div>
          <div>
            <label>First Name</label>
              <input
                onChange={this.handleChange('firstName')}
                values={this.state.resources.firstName}/>
          </div>
          <div>
            <label>Email</label>
              <input
                onChange={this.handleChange('email')}
                values={this.state.resources.email}/>
          </div>
          <div>
            <label>Phone</label>
              <input
                onChange={this.handleChange('phone')}
                values={this.state.resources.phone}/>
          </div>
          <div>
            <button>Submit</button>
          </div>
        </form>
      </div>
    )
  }
})

module.exports = ResourceForm
