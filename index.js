const express = require("express");
const { connectToMongoDB } = require("./db");
const passport = require('passport')
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const userModel = require('././model/userModel')
const postModel = require('./model/postModel')
const dotenv = require("dotenv").config();
const jwt = require('jsonwebtoken')
const userController = require('./controllers/userController')
const userRoute = require('./routes/userRoute')
const postRoute = require("./routes/postRoute");
const { urlencoded } = require("express");
const { getAllBlogPost } = require("./controllers/postController");
const app = express();
const PORT = 5000;

//connecting to MonGoDB Instance
connectToMongoDB();
app.use(express.json())
// app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json())
app.use(express.urlencoded({ extended: false }));
// app.use(methodOverride("_method"));


//Registeration Middleware Routes
app.use('/',userRoute);
app.use('/signup', passport.authenticate('jwt', { session: false }),userRoute);
app.use('/login', passport.authenticate('jwt', { session: false }),userRoute);
app.use('/posts',postRoute);
//Unauthenticated route, to get all published blogs by logged in unlogged-in users.




//Home route
app.get('/', (req, res) => {
  res.send('Welcome to the blog API');
});

//Users Routes
app.get("/users",userController.all );
app.get("/users/create", userController.create);
app.get("/users/:author", userController.find);
app.get("/users/:author/posts",userController.getAllPosts);

app.get('/posts')

// 404 route
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}....!`);
});
