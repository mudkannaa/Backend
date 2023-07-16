const router = require('express').Router();

const Note = require('../models/note');

// creates a new resource based on the request data
router.post('/', (request, response) => {
    const note = new Note(request.body);

    note.save()
        .then((savedNote) => {
            response.status(201).json({ message: 'Note created successfully', note: savedNote });
        })
});

module.exports = router;
