const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const postRoutes = require('./rotues/posts')

mongoose.connect('mongodb+srv://neel:Pass_key@meanlearning.vbh9djc.mongodb.net/meanDB?retryWrites=true&w=majority').then(
    () => {
        console.log('DB connection sucessful');
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

app.use('/mean/post', postRoutes);
module.exports = app;