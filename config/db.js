const mongoose = requrie('mongoose');


const connectToDb = () => {
    mongoose.connect(
        'mongodb:/localhost:27017/AuthDB',
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