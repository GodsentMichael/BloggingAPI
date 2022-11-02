const express = require("express");
const postModel = require("../model/postModel");
const postController = require('../controllers/postController')

const postRouter = express.Router();


postRouter.post('/', postController.createBlogPost)

postRouter.get('/:blogPostId', postController.getBlogPost)

postRouter.get('/', postController.getAllBlogPost)

postRouter.patch('/edit/:id', postController.updateBlogPost)
postRouter.delete('/delete/:id', postController.deleteBlogPost)


module.exports = postRouter;
