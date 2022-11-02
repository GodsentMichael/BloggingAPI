const express = require("express");
const { connectToMongoDB } = require("./db");
const passport = require('passport')
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const userModel = require('././model/userModel')
const postModel = require('./model/postModel')
const methodOverride = require("method-override");
const dotenv = require("dotenv").config();
const jwt = require('jsonwebtoken')
const userController = require('./controllers/userController')
const userRoute = require('./routes/userRoute')
const postRoute = require("./routes/postRoute");
const { urlencoded } = require("express");
const app = express();
const PORT = 5000;

//connecting to MonGoDB Instance
connectToMongoDB();
app.use(express.json())
// app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

//Routes
// app.use("/articles", postRouter);

// app.get("/", async (req, res) => {
//   const articles = await Post.find().sort({
//     createdAt: "desc",
//   });

//   res.render("articles/index", { articles: articles });
// });

//Registering Routes
app.use('/',userRoute);
app.use('/signup', passport.authenticate('jwt', { session: false }),userRoute);
app.use('/login', passport.authenticate('jwt', { session: false }),userRoute);
app.use('/posts',passport.authenticate('jwt', { session: false }),postRoute);




//Routes
// app.use("/api", userRoute);

//Home route

app.get('/', (req, res) => {
  res.send('Welcome to the blog API');
});

// 404 route
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'route not found' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}....!`);
});
