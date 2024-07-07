// Import Mongoose package, an Object Data Modeling (ODM) 
// library for MongoDB and Node.js
const mongoose = require('mongoose'); 

//Asynchronous function that establishes a coonection to MongoDB database
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/appointment-system',{
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
        console.log('MongoDB connected...')
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;