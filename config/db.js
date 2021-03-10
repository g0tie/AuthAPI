const mongoose = require('mongoose');

const connectToDb = () => {
    mongoose.connect(
        `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        {
            useNewUrlParser: true,
            useUnifiedTypology: true
        }
    )
    
    const db = mongoose.connection;
    
    db.on('error', (err) => console.error(`connection error:${err}`));
    db.once('open', () => console.log("connection to database successfull"));    
}

module.exports = connectToDb;