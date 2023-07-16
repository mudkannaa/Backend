const router = require('express').Router();

const Note = require('../models/note');

// fetches a single resource
router.get('/:id', (request, response) => {
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

module.exports = router;