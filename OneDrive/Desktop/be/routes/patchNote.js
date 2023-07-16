const router = require('express').Router();
const Note = require('../models/note');

router.patch('/:id', (request, response) => {
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

module.exports = router;