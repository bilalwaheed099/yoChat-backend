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

router.post('/add', passport.authenticate('jwt', {session: false}), (req, res) => {
    console.log(req.body);
    const user = req.user.id;
    console.log(user);
    const friendHandle = req.body.handle;
    console.log(friendHandle)
    // const friends = [];
    User.findOneAndUpdate({_id: req.user.id}, {$addToSet: {friends: friendHandle}}, {upsert: true})
        .then(user => {
            res.json(user);
        });
})

module.exports = router;