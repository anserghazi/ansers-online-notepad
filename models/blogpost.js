const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const BlogPostSchema = new Schema({
    title: String,
    body: String,
    date: String
},
{ timestamps: true }
);

// Model
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

module.exports = BlogPost;