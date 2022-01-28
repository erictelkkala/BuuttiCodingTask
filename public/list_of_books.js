function Books() {
    // Variables for states
    const [error, setError] = React.useState(null)
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [items, setItems] = React.useState([])
    // Variable to determine the action that the user is performing (Submit or Save)
    const [submitButtonId, setSubmitButtonId] = React.useState('submit-button')
    const [itemId, setItemId] = React.useState(0)

    // Run the readBooks function at the start of render
    React.useEffect(() => {
        // No need to handle the promise, since it's handled by the function itself, so it returns undefined here
        readBooks()
    }, [])

    // --------------------------------------------------
    // ------------------ FUNCTIONS ---------------------
    // Read all the books from the database
    async function readBooks() {
        // Use the API route
        await fetch('/api/getData')
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

    // Function to send a delete request to the API with an id as a parameter
    async function deleteBook(id) {
        // Use the API route and the parameter at the end of the URI
        await fetch('/api/deleteBook/' + id, {
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
    async function handleSubmit(event) {
        // Prevent the page from reloading
        event.preventDefault()
        // Check the value of the useState variable submitButtonId
        // Add a book if it's equal to submit-button
        if (submitButtonId === 'submit-button') {
            // Create a new FromData object from the event.target
            const data = new FormData(event.target)
            fetch('/api/addBook', {
                // Use the POST method to send the request
                method: 'POST',
                // Set the body of the request to the FormData object
                body: data,
            })
                // Process the response
                .then((response) => response.text())
                .then((result) => console.log(result))
                // Then rerender the list of book so that you can see the new book
                .then(() => readBooks())
                //Clear the value of the form if successful
                .then(() => document.getElementById('form').reset())
            // If the value of the submitButtonId is 'save-button'
        } else if (submitButtonId === 'save-button') {
            // Create a new FromData object from the event.target
            const data = new FormData(event.target)
            // Add an id key to the formData object using append, so that the API knows which book to update
            data.append('id', itemId)
            // Enable the submit button again and disable the save button
            document.getElementById('submit-button').disabled = false
            document.getElementById('save-button').disabled = true
            await fetch('/api/updateBook', {
                method: 'POST',
                body: data,
            })
                // See above for the process of the response
                .then((response) => response.text())
                .then((result) => console.log(result))
                //Clear the value of the form if successful
                .then(() => cancelEdit())
                // Then rerender the component with the readBooks function
                .then(() => readBooks())
        } else {
            // Else log that the submit button id is not equal to either of the two
            console.log(
                'Submit button id not found or is not equal to either of the two'
            )
        }
    }

    // Open the data of the book in the pre-existing form so that you can edit it
    async function openEdit(item) {
        // Disables the submit button and enables the save and cancel buttons
        document.getElementById('submit-button').disabled = true
        document.getElementById('save-button').disabled = false
        document.getElementById('cancel-button').disabled = false

        // Then set the form values to the values in the book that is edited
        document.getElementById('title').value = item.title
        document.getElementById('author').value = item.author
        document.getElementById('description').value = item.description
        // Set the itemId state to the id of the book that is being edited
        setItemId(item.id)
        await setSubmitButtonId('save-button')
    }

    // Reset the form and enable the 2 disabled buttons on cancel
    async function cancelEdit() {
        document.getElementById('submit-button').disabled = false
        document.getElementById('save-button').disabled = true
        document.getElementById('cancel-button').disabled = true
        document.getElementById('form').reset()
        await setSubmitButtonId('submit-button')
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
                    {/*------------------------------------------------------*/}
                    {/*------------------------FORM--------------------------*/}
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
                                required={true}
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
                                required={true}
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
                                required={true}
                            />
                        </div>
                        {/*Buttons on the bottom of the form*/}
                        <button
                            form={'form'}
                            id="submit-button"
                            className="btn btn-primary mr-2"
                            type={'submit'}
                            disabled={false}
                        >
                            Save new book
                        </button>
                        <button
                            form={'form'}
                            id="save-button"
                            className="btn btn-success mx-2"
                            type={'submit'}
                            disabled={true}
                        >
                            Save changes
                        </button>
                        <button
                            form={'form'}
                            type="reset"
                            id="cancel-button"
                            className="btn btn-secondary ml-2"
                            disabled={true}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
                {/*------------------------------------------------------*/}
                {/*---------------------RIGHT SIDE-----------------------*/}
                {/*The stack of items on the right*/}
                <div className="col-md" id="form-right">
                    {/*Group the items into a list*/}
                    <ul className="list-group list-group-flush">
                        {/*Make the list vertical with a small gap in between*/}
                        <div className="vstack gap-2">
                            {/* Maps the item array and creates a list item with the item values*/}
                            {/* Conditional rendering, so this will render if there are books in the items useState*/}
                            {items.length > 0 &&
                                items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="list-group-item"
                                    >
                                        {/*Each item has a flex-box in the row direction*/}
                                        <div className="d-flex w-100 flex-row">
                                            {/*Then there's the left side of the item with max width, which gets overruled by the static 90px on the right side element*/}
                                            <div className="d-flex flex-column justify-content-start w-100">
                                                <h3>{item.title}</h3>
                                                <div className="small fw-bolder">
                                                    {item.author}
                                                </div>
                                                <p className="text-break">
                                                    {item.description}
                                                </p>
                                            </div>
                                            {/*Right side element with the static 90px width*/}
                                            {/*The element is vertical so that the buttons don't take up too much space*/}
                                            <div
                                                className="d-flex flex-column justify-content-start vstack gap-2"
                                                style={{ width: '90px' }}
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
