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

// requestLogger middleware
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    console.log('--------');
    next();// yielding the control to the next middleware
}

app.use(requestLogger);

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

// middleware for catching requests that are made to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'});
}

app.use(unknownEndpoint);

// Express error handlers - middleware
// handler of requests with result to errors
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'});
    }

    next(error);
}

app.use(errorHandler);

// Listen to the PORT for requests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});