const express = require('express');
const Users = require('../models/Users');
const Chats = require('../models/Chats');

const router = express.Router();

//this is the page where the chats with a particular friend will be shown

//@GET /api/chats/
//@DESC sends the chat with a particular person
router.get("/", (req, res) => {
    //give the complete chat for the current user
    const handle = req.body.handle; // handle of the friend whose chat is opened
    Users.findOne({user: req.body.curUser})
        .then(user => {
            const chat = user.chats.find(chat => chat.userHandle === handle);
            res.json(chat);
        }).catch(e => {
            res.json(e);
        })
});

//@GET /api/chats/send
//@DESC sends the chat
router.post("/send", (req, res) => {
    console.log(req.body)
    //send a msg
    const handle = req.body.handle; // handle of the friend whose chat is opened
    const msgBody = {
        msgText: req.body.msgText,
        from: req.body.from,
        to: req.body.to,
        timestamp: req.body.timestamp
    }
    //updating the chat collection
    Chats.findOne({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]}, {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]})
        .then(chat => {
            res.json(chat)
            if(chat == null){
                const newChat = new Chat({
                    userHandle1: req.body.handle,
                    userHandle2: req.body.curUser,
                    msgs: [{...msgBody}]
                });
                newChat.save();
            }else{
                Chats.findOneAndUpdate({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]}, {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]}, {$push: {msgs: msgBody}}, {upsert: true})
                    .then(chat => {
                        console.log('msg sent');
                    })
            }
        })
        .catch(e => {
            res.json(e);
        });
});

//@GET /api/chats/test
//@DESC for test


//@GET /api/chats/test
//@DESC for test
router.get("/test", (req, res) => {
    res.json({msg: "Chat works"});
})

module.exports = router;