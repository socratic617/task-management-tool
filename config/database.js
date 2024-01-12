const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;

// config/database.js
module.exports = {

    'url' : 'mongodb+srv://mongDB:happy123!@cluster0.c1bg23b.mongodb.net/taskmanagement?retryWrites=true&w=majority', 
    'dbName': 'taskmanagement'
};
