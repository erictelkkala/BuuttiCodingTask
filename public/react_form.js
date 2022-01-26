const readBooks = require('list_of_books1.js')
class Form extends React.Component {
    constructor(props) {
        super(props)
    }

    // Send the form data to the server using a POST request
    handleSubmit(event) {
        event.preventDefault()
        const data = new FormData(event.target)
        fetch('/', {
            method: 'POST',
            body: data,
        })
            .then((response) => response.text())
            .then((result) => console.log(result))
            .then(() => readBooks())
    }

    // Form
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Title:
                    <input type="text" />
                </label>
                <label>
                    Author:
                    <input type="text" />
                </label>
                <label>
                    Description:
                    <input type="text" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}

// Render the form at the root element
ReactDOM.render(<Form />, document.getElementById('form-left'))
