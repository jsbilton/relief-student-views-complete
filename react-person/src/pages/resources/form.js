const React = require('react')
const xhr = require('xhr')

const dbUrl = process.env.REACT_APP_DB
const PouchDB = require('pouchdb-http')
const db = PouchDB(dbUrl)

const ResourceForm = React.createClass({
  getInitialState () {
    return {
      error: '',
      result: {},
      resource: {
        lastName: '',
        firstName: '',
        email: '',
        phone: '',
        _id: ''
      }
    }
  },
  handleChange(field) {
    return e => {
      let resource = this.state.resource
      resource[field] = e.target.value
      this.setState({ resource })
    }
  },
  handleSubmit(e) {
    e.preventDefault()
    const resource = this.state.resource
    resource._id = new Date().toISOString()
    db.put(resource, (error, result) => {
      if (err) this.setState({ error: err.message })
      this.setState){ result: result}
    })
    xhr({
      method: 'POST',
      json: resource,
      url: 'http://localhost:8080/persons',
      headers: {
        "Content-type", "application/json"
      }
    }, function (error, result) {
        if (err) {
          this.setState({error})
        console.log(err)
      }
      console.log(res)
    })

  },
  render () {

    const showError = _ => {
      this.state.error !== '' ?
      <div>{this.state.error}</div>
      : null
    }
    const showResult = _ => {
      this.state.result !== '' ?
      <div>{this.state.result}</div>
      : null
    }

    return (
      <div>
        <h1>Hello World </h1>
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
        <pre>
          {JSON.stringify(this.state.result, null, 2)}
          {JSON.stringify(this.state.error, null, 2)}
        </pre>
      </div>
    )
  }
})

module.exports = ResourceForm
