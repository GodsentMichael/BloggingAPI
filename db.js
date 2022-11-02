const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI

//connect to mongoDB
function connectToMongoDB(){
    mongoose.connect(MONGODB_URI)

    mongoose.connection.on('connected', ()=> {
        console.log('Connected to MongoDB succesfully');
    })

    mongoose.connection.on('error', (err)=>{
        console.log('Error connecting to the MongoDB', err);
    })
}

module.exports = {connectToMongoDB}

