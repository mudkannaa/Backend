const express = require('express');
const app = express();
const mongoose = require('mongoose');
app.use(express.json());

const url =
`mongodb+srv://ashwinimudknna:tAgQYCGXoj8IqJkV@cluster0.47boroe.mongodb.net/`;

// set the strictQuery to false, so that it will disable the strict mode for the query filters
// mongoose will not throw any error when we use an undefined field in the query (ignored)
mongoose.set('strictQuery', false);

// to connect to the database
mongoose.connect(url);

// optional: to check whether a successful connection is made to the mongoDB database
const db = mongoose.connection;

db.once('connected', () => {
    console.log('Connected to MongoDB Database');
    // mongoose.connection.close();
})
db.on('error', console.error.bind(console, 'Connection Error'));

// create a schema
const noteSchema = new mongoose.Schema({
    content: String,
    date: {
        type: Date,
        default: Date.now
    },
    important: Boolean
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// create a model
const Note = mongoose.model('Note', noteSchema, 'notes');

// set the endpoints

// root end point: prints hello world as an HTML
// app.get('/', (request, response) => {
//     response.send('<h1>Hello World!</h1>');
// });

// fetches all resources in the collection
app.get('/api/notes', (request, response) => {
    Note.find({}, {})
    .then((notes) => {
        response.json(notes);
    });
});

// creates a new resource based on the request data
app.post('/api/notes', (request, response) => {
    // prepare an object to store it in the database
    const note = new Note(request.body);

    // storing the new object to the database
    note.save()
        .then(result => {
            response.status(201).json({ message: 'Note created successfully' });
        });
});

// fetching a sigle resource
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    Note.findById(id)
        .then((note) => {
            if (!note) {
                return response.status(404).json({ error: 'Note not found' });
            }
            response.json(note);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// deleting a resource
app.delete('/api/notes/:id', (request, response) => {
    // get the id of the resource from params
    const id = request.params.id;

    Note.findByIdAndDelete(id)
        .then((deletedNote) => {
            if (!deletedNote) {
                return response.status(404).json({ error: 'Note not found' });
            }
            response.status(204).json({ message: 'Note deleted successfully' });
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });

    // response.status(204).end();
});

// replace the entire identified resource with the request data
app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const noteToPut = request.body;

    Note.findByIdAndUpdate(id, noteToPut)
        .then((updatedNote) => {
            if (!updatedNote) {
                return response.status(404).json({ error: 'Note not found' });
            }
            response.json(updatedNote);
        })
        .catch((error) => {
            response.status(500).json({ error: 'Internal server error' });
        });
});

// Listen to the PORT for requests
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});