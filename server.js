const express = require('express');
const path = require('path');
const open = require('open');
const fs = require("fs");
// Database module
const sqlite3 = require('sqlite3').verbose();


//Configure the express server
const app = express();
const port = process.env.PORT || 8080;

//Opens up the specified port on the local machine without depending on platform specific commands
open('http://localhost:' + port);

//Sets the path to the public folder
app.use(express.static('public'))

//Serves the initial page on start and redirects back to with an empty address
app.get('/', function(req, res) {
    //Sends the index.html file to the client
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

//Printing a message in the console when the server is started
app.listen(port);
console.log('Server started at http://localhost:' + port);


// --------------------------------------------------
// Database
// --------------------------------------------------

// Variables for the database
const database = "database.db";
const db = new sqlite3.Database(database);

//Creates a new database if it doesn't exist
function createDatabase(database){
    if(!fs.existsSync(database)){
        console.log("creating database file");
        fs.openSync(database, "w");
        //Creates the table for the database using a SQL statement
        db.run("CREATE TABLE IF NOT EXISTS book_db (id INTEGER PRIMARY KEY, title TEXT, author TEXT, description TEXT)", function(createResult){
            if(createResult) throw createResult;
        });
        console.log("database initialized");
    }
    return db;
}

// Add a new book to the database, id is not needed since it's auto incremented
function add_to_database(title, author, description){
    db.run("INSERT INTO book_db (title, author, description) VALUES (?, ?, ?)", [title, author, description], function(insertResult){
        if(insertResult) throw insertResult;
    });
}

// Get all books from the database
function read_all_from_database(){
    db.all("SELECT * FROM book_db", function(err, rows){
        if(err) throw err;
        console.log(rows);
    });
}

// Delete a book from the database with an id
function delete_from_database(id){
    db.run("DELETE FROM book_db WHERE id = ?", [id], function(deleteResult){
        if(deleteResult) throw deleteResult;
    });
}

//Load the database
createDatabase("database.db");
// add_to_database('The Great Gatsby', 'F. Scott Fitzgerald', 'The Great Gatsby is a 1925 novel written by American author F. Scott Fitzgerald. The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted as "gin was the national drink and');
read_all_from_database();