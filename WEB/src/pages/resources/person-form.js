const React = require('react')
const xhr = require('xhr')

// const dbUrl = process.env.REACT_APP_DB
// const PouchDB = require('pouchdb-http')
// const db = PouchDB(dbUrl)

const ResourceForm = React.createClass({
    getInitialState() {
        return {
            error: '',
            result: {},
            resource: {
                lastName: '',
                firstName: '',
                email: '',
                phone: ''
            }
        }
    },
    handleChange(field) {
        return e => {
            let resource = this.state.resource
            resource[field] = e.target.value
            this.setState({resource})
        }
    },
    handleSubmit(e) {
        e.preventDefault()
        const resource = this.state.resource
        resource._id = new Date().toISOString()
        // db.put(resource, (error, result) => {
        //     if (err)
        //         this.setState({error: err.message})
        //     this.setState) {result: result}
        // })
        xhr({
            method: 'POST',
            json: true,
            url: 'http://localhost:3000/persons',
            headers: {
                "Content-type":
                "application/json"
            }
        }, (err, response, body) => {
              if (err) return this.setState({error: err.message})
              this.setState({ result: body })
        })
    },
    render() {

        // const showError = _ => {
        //     this.state.error !== ''
        //         ? <div>{this.state.error}</div>
        //         : null
        // }
        // const showResult = _ => {
        //     this.state.result !== ''
        //         ? <div>{this.state.result}</div>
        //         : null
        // }
        return (
            <div>
              <span>{this.state.error}</span>
                <pre>
                {JSON.stringify(this.state.result, null, 2)}
                </pre>
                <h1>
                    Relief Team
                </h1>
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
                        <button>Add Team Member</button>
                    </div>
                </form>
                <pre>
                  {JSON.stringify(this.state.resource, null, 2)}
                </pre>
            </div>
        )
    }
})

module.exports = ResourceForm
