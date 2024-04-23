const express = require("express");
const moment = require("moment");
const postModel = require("../model/postModel");
const postRouter = require("../routes/postRoute");
const userModel = require('../model/userModel')
const { query } = require("express");

//Add Blog Post CRUD Controller Functions.

const createBlogPost = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id)
    if(user){
      
      // Algorithm for calculating read_time.
      function read_time() {
        const postTexts = req.body.body;
        //Average adult reading word per minute(wpm) is 225.
        const wpm = 225;
        //Hence
        const words = postTexts.trim().split(/\s+/).length;
        return Math.ceil(words / wpm)
      }
      
      const readTime = read_time();
      // console.log("readTime =>",readTime);
      const blogPostCreated = {
        title: req.body.title,
        
        tags: req.body.tags,
        author: `${user.first_name} ${user.last_name}`,
        owner: user._id,
        description: req.body.description,
        body: req.body.body,
        readTime,
      };
      blogPostCreated.lastUpdateAt = new Date() // set the lastUpdateAt to the current date
      const blogPost = await postModel.create(blogPostCreated);
  
      return res.status(201).json({ status: true, blogPost });
      } else( res.status(401).json({message: "user not found"}))
      
      } catch (err) {
        next(err);
      }
  };
    
  const getBlogPost = async (req, res, next) => {
    try {
      
      const blogPost = await postModel.findById(req.params.blogPostId)
      if (!blogPost) {
        res.status(404).json({ status: false, blogPost: null });
        return 
      }
      blogPost.readCount++
      await blogPost.save()
      res.status(200).json({ status: true, blogPost })
      
    } catch (err) {
          next(err);
      }
  };
  
     
  const getAllBlogPost = async (req, res, next) => {
  try {
    const query = req.query;
    const {
      created_at,
      state = "published",
      order_by = ("read_count", "reading_time", "created_at"),
      page = 1,
      per_page = 20,
    } = query;
    
        //Query object
      const findQuery = {};
    
        if (created_at) {
          findQuery.created_at = {
            $gt: moment(created_at).startOf("day").toDate(),
            $lt: moment(created_at).endOf("day").toDate(),
          };
        }
  


    //Searchable by
    const sortQuery = {};
    const sortAttributes = order_by.split(",");

      const blogPost = await postModel
        .find(findQuery)
        .sort(sortQuery)
        .skip(page)
        .limit(per_page);

      return res.status(200).json({ status: true, blogPost });
    } catch (err) {
      next(err);
    }
    }
;

const updateBlogPost = async (req, res)=>{
    const { id } = req.params
    

    let blogPost = await postModel.findById(id)
    // console.log("blogPost =>", blogPost)
    
    
    if(!blogPost){
       return res.send(404).json({ status: false,message: "blogPost not found" })
    }
    blogPost.lastUpdateAt = new Date() // set the lastUpdateAt to the current date
    await postModel.findOneAndUpdate({_id: id}, {state: req.body.state})
    blogPost = await postModel.findById(id)
   

    return res.json({status: true, blogPost})

}

const deleteBlogPost = async (req, res) =>{
    const { id } = req.params
    // console.log("ID =>", id);

    const blogPost = await postModel.deleteOne({_id : id})

    if(!blogPost){
        return res.status(401).json({status: false, blogPost:null, message: "Error deleting wrong post"})
    }
    
    return res.status(201).json({status: true, blogPost})
}



module.exports = { createBlogPost,getBlogPost, getAllBlogPost, updateBlogPost, deleteBlogPost };
