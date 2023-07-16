const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('Note', noteSchema);