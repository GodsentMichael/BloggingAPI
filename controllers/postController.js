const express = require("express");
const moment = require("moment");
const postModel = require("../model/postModel");
const postRouter = require("../routes/postRoute");


const { query } = require("express");

//Add Blog Post CRUD Controller Functions.

const createBlogPost = async (req, res, next) => {
  try {
    // Collecting details meant for blogPost creation
    
  

    // Algorithm for calculating read_time.
    function read_time() {
      const postTexts = req.body.body;
      //Average adult reading word per minute(wpm) is 225.
      const wpm = 225;
      //Hence
      const words = postTexts.trim().split(/\s+/).length;
      return Math.ceil(words / wpm)
      // const time = Math.ceil(words / wpm);
    }

    const readTime = read_time();
    console.log("readTime =>",readTime);
    const blogPostCreated = {
      title: req.body.title,
      state: req.body.state,
      tags: req.body.tags,
      author: req.body.author,
      description: req.body.description,
      body: req.body.body,
      readTime,
      state: "published"
    };
    //Creating the blogPost and saving it to the DB.
    const blogPost = await postModel.create(blogPostCreated);

    return res.status(201).json({ status: true, blogPost });
  } catch (err) {
    next(err);
  }
};

const getBlogPost = async (req, res, next) => {
  try {
    //Creating the blog object
    const { blogPostId } = req.params;
    //Making sure the blog also gives the author info. And is updated by 1
    const blogPost = await postModel.findById({
      blogPostId,
      author: req.user._id,
      read_count: 1,
    });

    if (!blogPost) {
      res.status(404).json({ status: true, blogPost: null });
    }
  } catch (err) {
    next(err);
  }
};

const getAllBlogPost = async (req, res, next) => {
  try {
    // const { query } = req
    const query = req.query;

    const {
      created_at,
      state = "published",
      order = "asc",
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

    // if( author ){
    //     findQuery.author = author._id
    // }

    if (author) {
      findQuery.author = req.user._id;
    }

    if (title) {
      findQuery.title = title;
    }

    if (tags) {
      findQuery.tag = tag;
    }

    //Searchable by
    const sortQuery = {};
    const sortAttributes = order_by.split(",");

    for (const attribute of sortAttributes) {
      if (blogPost === "author" && order_by) {
        sortQuery[attribute] = 1;
      }

      if (blogPost === "tag" && order_by) {
        sortQuery[attribute] = 1;
      }
      if (blogPost === "title" && order_by) {
        sortQuery[attribute] = 1;
      }

      const blogPost = await postModel
        .find(findQuery)
        .sort(sortQuery)
        .skip(page)
        .limit(per_page);

      return res.status(200).json({ status: true, blogPost });
    }
  } catch (err) {
    next(err);
  }
};

const updateBlogPost = async (req, res)=>{
    const {id } = req.params
    const {state} = req.body

    const blogPost = postModel.findById()
    
    if(!blogPost){
       return res.send(404).json({ status: false,blogPost: null })
    }

    if( state < blogPost.state){
        return res.status(422).json({ status: false, blogPost: null , message: 'invalid operation'})
    }

    blogPost.state = state

    await blogPost.save()

    return res.json({status: true, blogPost})

}

const deleteBlogPost = async (req, res) =>{
    const { id } = req.params

    const blogPost = await postModel.deleteOne({_id : id})

    if(!blogPost){
        return res.status(401).json({status: false, blogPost:null, message: "Error deleting wrong post"})
    }
    
    return res.status(201).json({status: true, blogPost})
}



module.exports = { createBlogPost,getBlogPost, getAllBlogPost, updateBlogPost, deleteBlogPost };
