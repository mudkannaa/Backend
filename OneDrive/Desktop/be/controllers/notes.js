// import the express Router
const notesRouter = require('express').Router();
const jwt = require('jsonwebtoken');

// import the model
const Note = require('../models/note');
const User = require('../models/user');

// endpoint to get all the notes
notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({}, {}).populate('user', {username: 1, name: 1});
    response.status(200).json(notes);
});

// fetches a single resource
notesRouter.get('/:id', (request, response, next) => {
    const id = request.params.id;
    Note.findById(id)
        .then((note) => {
            if (!note) {
                return response.status(404).json({ error: 'Note not found' });
            }
            response.json(note);
        })
        .catch(error => next(error));
});

// creates a new resource based on the request data
notesRouter.post('/', async (request, response) => {
    const body = request.body;

    const getTokenFrom = (request) => {
        const authorization = request.get('authorization');

        if(authorization && authorization.startsWith('bearer ')){
            return authorization.replace('bearer ', '');
        }

        return null;
    }

    // verify the token
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);

    if(!decodedToken.id){
        return response.status(401).json({ error: 'token invalid' })
    }

    const user  = await User.findById(decodedToken.id);

    // prepare the note
    const note = new Note({
        content: body.content,
        important: body.important,
        user: user._id
    });

    // save the note
    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    response.status(201).json(savedNote);
});

// deletes a single resource
notesRouter.delete('/:id', (request, response) => {
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
});

// patch request to update the identified resource with the request data
notesRouter.patch('/:id', (request, response) => {
    const id = request.params.id;
    const noteToPatch = request.body;

    Note.findByIdAndUpdate(id, noteToPatch)
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

// put request to replace the entire identified resource with the request data
notesRouter.put('/:id', (request, response) => {
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

module.exports = notesRouter;