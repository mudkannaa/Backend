require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// create an express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to the database
const url = process.env.MONGODB_URI;

// set the strictQuery to false, so that it will disable the strict mode for the query filters
// mongoose will not throw any error when we use an undefined field in the query (ignored)
mongoose.set('strictQuery', false);

// to connect to the database
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB Database');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    })

// create a model
const Note = require('./models/note');

// set the endpoints

// import the controllers/routes
const getAllNotes = require('./routes/getAllNotes');
const createNote = require('./routes/createNote');
const getNote = require('./routes/getNote');
const deleteNote = require('./routes/deleteNote');
const putNote = require('./routes/putNote');
const patchNote = require('./routes/patchNote');

// fetches all resources in the collection
app.use('/api/notes', getAllNotes);

// creates a new resource based on the request data
app.use('/api/notes', createNote);

// fetching a sigle resource
app.use('/api/notes', getNote);

// deleting a resource
app.use('/api/notes', deleteNote);

// replace the entire identified resource with the request data
app.use('/api/notes', putNote);

// patch request to update the identified resource with the request data
app.use('/api/notes', patchNote);

// Listen to the PORT for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});