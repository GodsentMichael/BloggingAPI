const express = require("express");
const passport = require('passport')
const jwt = require('jsonwebtoken')
const postController = require('../controllers/postController')
const blogValidation = require('../middlewares/validator')

const postRouter = express.Router();


postRouter.post('/',passport.authenticate('jwt', { session: false }), blogValidation, postController.createBlogPost)
//Unauthenticated route, to get one/all published blogs by logged in and non-logged-in users.
postRouter.get('/:blogPostId',postController.getBlogPost)

postRouter.get('/',postController.getAllBlogPost)

postRouter.patch('/edit/:id',passport.authenticate('jwt', { session: false }) ,postController.updateBlogPost)
postRouter.delete('/delete/:id', passport.authenticate('jwt', { session: false }),postController.deleteBlogPost)


module.exports = postRouter;
