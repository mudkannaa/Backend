const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const notesRouter = require('./controllers/notes');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

// create an express app
const app = express();

// set the strictQuery to false, so that it will disable the strict mode for the query filters
// mongoose will not throw any error when we use an undefined field in the query (ignored)
mongoose.set('strictQuery', false);

logger.info('connecting to', config.MONGODB_URI);

// connect to the database
mongoose.connect(config.MONGODB_URI)
    .then(result => {
        logger.info('Connected to MongoDB Database');
    })
    .catch((error) => {
        logger.info('Error connecting to MongoDB:', error.message);
    })

// middleware
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// Listen to the PORT for requests
app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`);
});