require('dotenv').config()
const app = require('express')();
const connectToDb = require('./config/db');
const bodyParser = require("body-parser");

connectToDb();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));
app.use('/api/auth', require('./routes/api/auth'));

const listener = app.listen(process.env.PORT, () => console.log(`Server listening on port ${listener.address().port}`));
