function Books() {
    // Variables for states
    const [error, setError] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [items, setItems] = React.useState([])

    // Run the readBooks function at the start of render
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

    // TODO: Move the submitting to the backend so that you can switch between submit types

    // Open the data of the book in the pre-existing form so that you can edit it
    function openEdit(item) {
        // Disables the submit button and enables the save button
        document.getElementById('submit-button').disabled = true
        document.getElementById('save-button').disabled = false
        document.getElementById('cancel-button').disabled = false
        // Then set the form values to the values in the book that is edited
        document.getElementById('title').value = item.title
        document.getElementById('author').value = item.author
        document.getElementById('description').value = item.description
    }

    // Send data to the server to modify an existing book in the database
    function handleEdit(event) {
        event.preventDefault()
        const data = new FormData(event.target)
        document.getElementById('submit-button').disabled = false
        document.getElementById('save-button').disabled = true
        fetch('/api/editBook', {
            method: 'POST',
            body: JSON.stringify(data),
        })
            .then((response) => response.text())
            .then((result) => console.log(result))
            .then(() => readBooks())
            //Clear the value of the form if successful
            .then(() => cancelEdit())
    }

    // Reset the form and enable the 2 disabled buttons on cancel
    function cancelEdit() {
        document.getElementById('submit-button').disabled = false
        document.getElementById('save-button').disabled = true
        document.getElementById('cancel-button').disabled = true
        document.getElementById('form').reset()
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
                    <form
                        onSubmit={handleSubmit}
                        onReset={cancelEdit}
                        id="form"
                    >
                        <div className="mb-4">
                            <label htmlFor="title" className="form-label">
                                Title:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                name="title"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="author" className="form-label">
                                Author:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="author"
                                name="author"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="form-label">
                                Description:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                            />
                        </div>
                        <button
                            type="submit"
                            id="submit-button"
                            className="btn btn-primary mr-2"
                        >
                            Save new book
                        </button>
                        <button
                            type="button"
                            id="save-button"
                            className="btn btn-success mx-2"
                            onClick={handleEdit.bind(this)}
                            disabled={true}
                        >
                            Save changes
                        </button>
                        <button
                            type="reset"
                            id="cancel-button"
                            className="btn btn-secondary ml-2"
                            disabled={true}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
                <div className="col-md" id="form-right">
                    <ul className="list-group list-group-flush">
                        <div className="vstack gap-2">
                            {/* Maps the item array and creates a list item with the item values*/}
                            {/* Conditional rendering, so this will render if there are books in the items useState*/}
                            {items.length > 0 &&
                                items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="list-group-item"
                                    >
                                        <div className="d-flex w-100 flex-row">
                                            <div className="d-flex flex-column justify-content-start w-100">
                                                <h3>{item.title}</h3>
                                                <div className="small fw-bolder">
                                                    {item.author}
                                                </div>
                                                <p className="text-break">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <div
                                                className="d-flex flex-column justify-content-start vstack gap-2"
                                                style={{ width: '100px' }}
                                            >
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        openEdit(item)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() =>
                                                        deleteBook(item.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            {/* This will be rendered if the items useState is empty*/}
                            {items.length === 0 && (
                                <div className="d-flex w-100 justify-content-center">
                                    <h4>No books added yet</h4>
                                </div>
                            )}
                        </div>
                    </ul>
                </div>
            </div>
        )
    }
}

//Renders the list of books on the root of the page
ReactDOM.render(<Books />, document.getElementById('root'))
