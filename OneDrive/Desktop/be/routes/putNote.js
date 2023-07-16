const router = require('express').Router();
const Note = require('../models/note');

// put request to replace the entire identified resource with the request data
router.put('/:id', (request, response) => {
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

module.exports = router;