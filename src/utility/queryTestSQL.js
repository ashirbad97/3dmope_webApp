const path = require('path')
const sqlite3 = require('sqlite3').verbose();

db_directory = path.join(__dirname, '../db/3dmoper.db')
// Defining connection to the on-disk db
let db = new sqlite3.Database(db_directory, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Successfully connected to database")
    }
});

fetch_allSubjects = () => {
    fetchAllUsersQuery = 'SELECT * FROM subjects'
    db.all(fetchAllUsersQuery, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row)
        })
    })
}

fetch_allSubjects()