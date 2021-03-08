require('dotenv').config()
const app = require('express')();
const connectToDb = require('./config/db');

connectToDb();

const listener = app.listen(process.env.PORT, () => console.log(`Server listening on port ${listener.address().port}`));
