const express = require('express');
const Users = require('../models/Users');

const router = express.Router();

//this is the page where the chats with a particular friend will be shown

//@GET /api/chats/
//@DESC sends the chat
router.get("/", (req, res) => {
    //give the complete chat for the current user
    const handle = req.body.handle; // handle of the friend whose chat is opened
    Users.findOne({user: req.user.id})
        .then(user => {
            const chat = user.chats.find(chat => chat.userHandle === handle)
            res.json(chat);
        });
});

router.post("/send", (req, res) => {
    //send a msg
    const handle = req.body.handle; // handle of the friend whose chat is opened
    const msgBody = {
        msgText: req.body.msg,
        from: req.body.from,
        to: req.body.to,
        timestamp = req.body.timestamp
    }
    // updating the current session user
    Users.findOneAndUpdate({$and: [{user: req.user.id}, {userHandle: handle}]}, {$push: {msgs: msgBody}} , {new: true})
        .then(user => {
            res.json(user);
        });
    // updating the user to whom the msg is sent
    Users.findOneAndUpdate({user: handle}, {$push: {msgs: msgBody}}, {new: true})
    .then(user => {
        res.json(user.chat.msgs);
    });
});


//@GET /api.chats/test
//@DESC for test
router.get("/", (req, res) => {
    res.json({msg: "Chat works"});
})

module.exports = router;