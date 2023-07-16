const express = require('express');
const app = express();
app.use(express.json());

// data
let notes = [
    {
        id: 1,
        content: 'HTML is easy',
        important: true
    },
    {
        id: 2,
        content: 'Browser can execute only Javascript',
        important: false
    },
    {
        id: 3,
        content: 'GET and POST are the most important methods of HTTP protocol',
        important: true
    }
];

// set the endpoints

// root end point: prints hello world as an HTML
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

// fetches all resources in the collection
app.get('/api/notes', (request, response) => {
    response.json(notes);
});

// creates a new resource based on the request data
app.post('/api/notes', (request, response) => {
    notes = notes.concat(request.body);
    // console.log(request.body);
    response.status(201).json({ message: 'note created successfully' });
});

// fetching a sigle resource
app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end('id does not exist');
    }
});

// deleting a resource
app.delete('/api/notes/:id', (request, response) => {
    // get the id of the resource from params
    const id = Number(request.params.id);
    notes = notes.filter(note => note.id !== id);

    response.status(204).end();
});

// replace the entire identified resource with the request data
app.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    // const noteToPut = notes.find(note => note.id === id);

    const noteToPut = request.body;

    notes = notes.map(note => note.id === id ? noteToPut : note);
    response.status(200).end();
});

// Listen to the PORT for requests
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});