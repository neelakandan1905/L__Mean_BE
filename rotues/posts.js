const express = require("express");
const router = express.Router();
const Post = require('../models/post')

router.post("", (req, res, next) => {
    const posts = new Post({
        title: req.body.title,
        content: req.body.content
    });
    posts.save().then(createdPost => {
        res.status(201).json({
            messeage: 'Post added sucessfully',
            postId : createdPost._id
        });
    });
});

router.put("/:id", (req, res, next) => {
    const post = new Post ({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    console.log(post);
    Post.updateOne({_id: req.params.id}, post).then((result) => {
        res.status(200).json({messeage: 'Update Sucessfull'})
    })
})

router.get('', (req, res, next) => {
    Post.find().then(documents => {
        // console.log(documents);
        res.status(200).json({
            messeage: 'data send sucessfully',
            posts: documents
        });
    })
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        } else {
            res.status(404).json({messeage: 'Post Not Found'});
        }
    })
})

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({ messeage: "Post Deleted Sucessfully" });
    })
});

module.exports = router;