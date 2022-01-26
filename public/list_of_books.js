function Books() {
    const [error, setError] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [items, setItems] = React.useState([])

    React.useState(() => {
        readBooks()
    }, [])

    // --------------------------------------------------
    // ------------------ FUNCTIONS ---------------------
    // Read all the books from the database
    function readBooks() {
        // Use the API route
        fetch('/api/getData')
            // Convert the response to JSON
            .then((res) => res.json())
            .then(
                // Sets the state of the items to the JSON response
                (result) => {
                    // Set the states if the response is successful
                    setItems(result)
                    setIsLoaded(true)
                },
                // If there is an error, set the error state to the error
                (error) => {
                    setError(error)
                    setIsLoaded(true)
                }
            )
    }

    // function to send a delete request to the API with an id as a parameter
    function deleteBook(id) {
        // Use the API route and the parameter at the end of the URI
        fetch('/api/deleteBook/' + id, {
            // Use the POST method to send the request
            method: 'POST',
        })
            .then(
                () => {
                    // If the response is successful, set the setIsLoaded state to false
                    setIsLoaded(false)
                },
                // If there is an error, set the error state to the error
                (error) => {
                    setIsLoaded(true)
                    setError(error)
                }
            )
            // Then rerender the component with teh readBooks function
            .then(() => {
                readBooks()
            })
    }

    // Send the form data to the server using a POST request
    function handleSubmit(event) {
        event.preventDefault()
        const data = new FormData(event.target)
        fetch('/api/addBook', {
            method: 'POST',
            body: data,
        })
            .then((response) => response.text())
            .then((result) => console.log(result))
            .then(() => readBooks())
            //Clear the value of the form if successful
            .then(() => document.getElementById('form').reset())
    }

    // --------------------------------------------------
    // -------------------- RENDER ----------------------
    if (error) {
        // Writes the error on the front-end if there is one
        return (
            <div className="d-flex justify-content-center">
                <div>Error: {error.message}</div>
            </div>
        )
    } else if (!isLoaded) {
        // A placeholder spinner when the list is loading
        return (
            <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className="row">
                {/*        Column container-->*/}
                <div className="col-md" id="form-left">
                    {/*Use the handleSubmit function when submitting the form*/}
                    <form onSubmit={handleSubmit} id="form">
                        <label>
                            Title:
                            <input type="text" id="title" name="title" />
                        </label>
                        <label>
                            Author:
                            <input type="text" id="author" name="author" />
                        </label>
                        <label>
                            Description:
                            <input
                                type="text"
                                id="description"
                                name="description"
                            />
                        </label>
                        <input
                            type="submit"
                            className="btn btn-primary"
                            value="Submit"
                        />
                    </form>
                </div>
                <div className="col-md" id="form-right">
                    <ul className="list-group list-group-flush">
                        <div className="vstack gap-2">
                            {/* Maps the item array and creates a list item with the item values*/}
                            {items.map((item) => (
                                <li key={item.id} className="list-group-item">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h3>{item.title}</h3>
                                        <small>
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    deleteBook(item.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </small>
                                    </div>
                                    <div className="small fw-bolder">
                                        {item.author}
                                    </div>
                                    {item.description}
                                </li>
                            ))}
                        </div>
                    </ul>
                </div>
            </div>
        )
    }
}

//Renders the list of books on the root of the page
ReactDOM.render(<Books />, document.getElementById('root'))
