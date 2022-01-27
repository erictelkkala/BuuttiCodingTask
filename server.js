// Express.js
const express = require('express')
// Body-parser
const bodyParser = require('body-parser')
const path = require('path')
const open = require('open')
// Filesystem
const fs = require('fs')
// Multer for parsing multipart/form-data
const multer = require('multer')
// Initialize multer
const form = multer()
// Database module
const sqlite3 = require('sqlite3').verbose()

//Configure the express app
const app = express()
const port = process.env.PORT || 8080

//Opens up the specified port on the local machine without depending on platform specific commands
open('http://localhost:' + port)

//Sets the path to the public folder
app.use(express.static('public'))
app.use(bodyParser.json()) // for parsing application/json !! requires () to function !!
app.use(form.array()) // for parsing multipart/form-data

//Serves the initial page on start and redirects back to with an empty address
app.get('/', function (req, res) {
    //Sends the index.html file to the client
    res.sendFile('index.html', { root: path.join(__dirname, 'public') })
})

app.get('/api/getData', function (req, res) {
    //Sends list of all the data in the database as JSON to the client
    if (!fs.existsSync(database)) {
        console.log('database file does not exist')
        createDatabase(database)
    }
    db.all('SELECT * FROM book_db', function (err, rows) {
        if (err) throw err
        res.send(rows)
        // console.log(rows)
    })
})

// --- POST requests ---
// Deletes a book from the database
app.post('/api/deleteBook/:id', function (req, res) {
    //Deletes the book with the specified id from the database
    db.run('DELETE FROM book_db WHERE id = ?', [req.params.id], function (err) {
        if (err) throw err
        res.send('Book deleted')
    })
})

// Adds a new book to the database
app.post('/api/addBook', function (req, res) {
    //Adds a new book to the database
    db.run(
        'INSERT INTO book_db (title, author, description) VALUES (?, ?, ?)',
        [req.body.title, req.body.author, req.body.description],

        function (err) {
            if (err) throw err
            res.send('Book added')
        }
    )
})
//Printing a message in the console when the server is started
app.listen(port)
console.log('Server started at http://localhost:' + port)

// --------------------------------------------------
// Database
// --------------------------------------------------

// Variables for the database
const database = 'database/database.db'
const db = new sqlite3.Database(database)

//Creates a new database if it doesn't exist
function createDatabase(database) {
    if (!fs.existsSync(database)) {
        console.log('Creating database')
        fs.openSync(database, 'w')
        //Creates the table for the database using a SQL statement
        db.run(
            'CREATE TABLE book_db (id INTEGER PRIMARY KEY, title TEXT, author TEXT, description TEXT)',
            function (createResult) {
                if (createResult) throw createResult
                console.log('Database created')
            }
        )
        console.log('Database file exists')
    }
    console.log('Database initialized')
}

//Load the database
createDatabase(database)
