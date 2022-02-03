const express = require('express');
const path = require('path');
var db_json = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
//tell nodes that we are creating our express server
const app = express();
//adding to use of a unique id for notes here : https://www.npmjs.com/package/uniqid


//middleware for parsing appli/json and urlencoded data
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//basic route that sends our user to home page(note taker,get started)
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);
//get notes.html file as response(notes title,text)
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

//get resp -read the `db.json` file and return all saved notes as JSON.(title, text stored in json file)
app.get('/api/notes', (req, res) =>
    res.json(db_json)
);
// post route for submitting notes
app.post('/api/notes', (req, res) => {

    console.info(`${req.method} request receive to add db.json file`)//inform client post req receive //  res.json(`${req.method} request received`);
    //prepare a res object to send back to client(return a new note to client)
    //store notes each note have unique id


    // Destructuring assignment for the title and text in req.body
    const { title, text } = req.body;


    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuidv4()
        };
        db_json.push(newNote)
        console.log(db_json)
        fs.writeFile('./db/db.json', JSON.stringify(db_json), (err) =>
            err ? console.log(err) : console.log('response written to db.json file'))
        res.json(`${req.method} request received ${newNote.id}`);
    } else {
        res.status(500).json('Error in posting ');
    }
});
app.delete('/api/notes/:id', (req, res) => {
  
    //to delete a note ,readall notes from db.jsonfile, removethe node with id property, then rewrite the notes to db.json
    console.log(req.params)
    //remove
    var filterNotes = db_json.filter((x) => x.id!= req.params.id)
    console.log(filterNotes)
    db_json = filterNotes;
    fs.writeFile('./db/db.json', JSON.stringify(filterNotes), (err) =>
            err ? console.log(err) : console.log('response written to db.json file'))
        res.json(`${req.method} request received ${newNote.id}`);
}
)

//wildcard get index.html file 
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))

);

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);