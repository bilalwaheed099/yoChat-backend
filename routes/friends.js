const express = require('express');
const User = require('../models/Users');
const passport = require('passport');

const router = express.Router();

//send the list of all the friends >>>>> arranged by the order of last msg sent >>>>> with new msgs on top

// @GET /api/friends/list
// @DESC returns the friends list
router.get('/list', (req, res) => {
    // 1. get the user id from req
    // 2. get his friends list 
    // 3. send the list
});

// @GET /api/friends/test
// @DESC for test
router.get('/test', (req, res) => {
    res.json({msg: "Friends works!"})
});

router.post('/add', (req, res) => { 
    console.log(req.body);
    const username = req.body.username; // current user's handle
    console.log(username);
    const friendHandle = req.body.friendHandle; // handle of friend to be added
    console.log(friendHandle)
    // const friends = [];
    User.findOneAndUpdate({username}, {$addToSet: {friends: friendHandle}}, {upsert: true})
        .then(user => {
            // res.json(user);
            res.json({msg: "Friend added", success: true})
        });
});

// @GET /api/friends/allusers
// @DESC for getting all users for search features
router.get('/allusers', (req, res) => {
    User.find({})
        .then(users => {
            res.json(users)
        })
})

module.exports = router;
