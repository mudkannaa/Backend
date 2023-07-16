// import the express Router
const router = require('express').Router();

// import the model
const Note = require('../models/note');

// endpoint to get all the notes
router.get('/', (request, response) => {
    Note.find({}, {})
    .then((notes) => {
        response.json(notes);
    });
});

module.exports = router;