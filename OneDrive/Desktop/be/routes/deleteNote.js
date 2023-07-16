const router = require('express').Router();
const Note = require('../models/note');

router.delete('/:id', (request, response) => {
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

module.exports = router;