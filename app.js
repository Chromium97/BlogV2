//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const lodash = require('lodash');

const homeStartingContent = "Welcome to the Basic Blog! This website demos the use of Node.js, Express, MongoDB and mongoose. Try to create a post by heading over to /compose, play around and have some fun! Because I had fun making this :)";
const aboutContent = "This website is meant to explore some of the MongoDB features along with Mongoose by adding new posts into a collection stored in a local instance of a mongo database";
const contactContent = "Connect with me on LinkedIn";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//creating db
mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

//creating schema for db
const postSchema = new mongoose.Schema({
  name: String,
  content: String
});

//creating model
const Post = new mongoose.model("Post", postSchema);


//rending home page, passing home and posts content
app.get('/', (req, res) => {

  //finding all posts in the db, rendering to home page
  const findPosts = async function () {
    let foundPosts = await Post.find({});

    //if posts exist, render
    if (foundPosts) {
      res.render('home', { homeStartingContent: homeStartingContent, posts: foundPosts });
    }
  }
  findPosts();
});

//rending home page, passing about content
app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent });
});

//rending home page, passing contact content
app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent })
});

//rending the compose page
app.get('/compose', (req, res) => {
  res.render('compose');
});

//get for posts/specific post name
app.get('/posts/:postName', (req, res) => {

  //storing post param in variable
  let searchPost = req.params.postName

  //function to find a single post and render to screen
  const findPost = async function () {
    let foundPost = await Post.find({});

    //if post matches the searched parameter, render to the pafe
    foundPost.forEach(function (renderPost) {
      if (lodash.lowerCase(searchPost) === lodash.lowerCase(renderPost.name)) {
        res.render('post', {
          name: renderPost.name,
          content: renderPost.content
        })
      }
    })
  }
  findPost();
});

//post route, creating post object to puch to posts array 
app.post('/compose', (req, res) => {
  const newPost = new Post({
    name: req.body.postTitle,
    content: req.body.postContent
  });
  newPost.save();
  res.redirect('/')
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});