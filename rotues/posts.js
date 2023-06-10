const express = require("express");
const router = express.Router();
const Post = require('../models/post');
const multer = require('multer');

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      callBack(error, "postImages");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase().split(" ").join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    }
  });

router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const posts = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/postImages/" + req.file.filename
    });
    posts.save().then(createdPost => {
        res.status(201).json({
            messeage: 'Post added sucessfully',
            post : {
                ...createdPost,
                id: createdPost._id
            }
        });
    });
});

router.put("/:id", multer({ storage: storage }).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/postImages/" + req.file.filename;
    }
    const post = new Post ({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({_id: req.params.id}, post).then((result) => {
        res.status(200).json({messeage: 'Update Sucessfull'})
    })
})

router.get('', (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery.then(documents => {
        fetchedPosts = documents;
        return Post.count();
    }) 
    .then(count => {
        // console.log(documents);
        res.status(200).json({
            messeage: 'data send sucessfully',
            posts: fetchedPosts,
            count: count
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