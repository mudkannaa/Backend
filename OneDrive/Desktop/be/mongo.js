const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as command line argument');
    process.exit(1);
}

// get the password from the command line argument
const password = process.argv[2];

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

// end of testing connection

// create a schema
const noteSchema = new mongoose.Schema({
    content: String,
    date: {
        type: Date,
        default: Date.now
    },
    important: Boolean
});

// create a model
const Note = mongoose.model('Note', noteSchema, 'notes');

// prepare an object to store it in the database
// const note = new Note({
//     content: 'Callback functions are cool',
//     important: true
// });

// // storing the new object to the database
// note.save()
//     .then(result => {
//         console.log('note saved!');
//         mongoose.connection.close();
//     });

// // get all the notes from the database
// Note.find({}, {})
//     .then((result) => {
//         result.forEach((note) => {
//             console.log(note);
//         })
//         mongoose.connection.close();
//     });

// get all the important notes from the database
Note.find({important: true}, {})
    .then((result) => {
        result.forEach((note) => {
            console.log(note);
        })
        mongoose.connection.close();
    });