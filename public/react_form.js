class Form extends React.Component {
    constructor(props) {
        super(props);
    }

    //Handle the submit action
    handleSubmit(event) {
        event.preventDefault();
    }

    // Form
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Title:
                    <input type="text"/>
                </label>
                <label>
                    Author:
                    <input type="text"/>
                </label>
                <label>
                    Description:
                    <input type="text"/>
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

// Render the form at the root element
ReactDOM.render(
    <Form />,
    document.getElementById('form-left')
);