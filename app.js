const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const Post = require('./models/post')
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://neel:Pass_key@meanlearning.vbh9djc.mongodb.net/meanDB?retryWrites=true&w=majority').then(
    () => {
        console.log('DB 8connection sucessful');
    }).catch(() => {
        console.log('DB connection failed');
    }
)

app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-control-Allow-Orgin', '*');
    res.setHeader('Access-control-Allow-Headers', 'Orgin, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    next();
});

app.post("/mean/post", (req, res, next) => {
    const posts = new Post({
        title: req.body.title,
        content: req.body.content
    });
    console.log(posts);
    posts.save();
    res.status(201).json({
        messeage: 'Post added sucessfully'
    });
})

app.get('/mean/posts', (req, res, next) => {
    Post.find().then(documents => {
        // console.log(documents);
        res.status(200).json({
            messeage: 'data send sucessfully',
            posts: documents
        });
    })
});

app.delete('/mean/post/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({ messeage: "Post Deleted Sucessfully" });
    })
});

module.exports = app;