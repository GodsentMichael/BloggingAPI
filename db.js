const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI

//connect to mongoDB
function connectToMongoDB(){
    mongoose.connect(MONGODB_URI)

    mongoose.connection.on('connected', async ()=> {
        console.log('Connected to MongoDB succesfully');
    })

    mongoose.connection.on('error', (err)=>{
        console.log('Error connecting to the MongoDB', err);
    })
}

module.exports = {connectToMongoDB}


const connectDB = async () => {
    try {
        let connect;
        const options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
         }
        switch(process.env.NODE_ENV) {
            case "development":
                connect = await mongoose.connect(process.env.DEV_MONGO_URI, options);
                break;
            case "test":
                connect = await mongoose.connect(process.env.TEST_MONGO_URI, options);
                break;
            default:
               console.log("Connection did not succeed");
            }; 
        console.log(`connected to MongoDB in ${process.env.NODE_ENV} mode on ${connect.connection.host}`);
    } catch (error) {
      return error;
    };
};