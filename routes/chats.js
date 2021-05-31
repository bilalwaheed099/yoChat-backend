const express = require('express');
const Users = require('../models/Users');
const Chats = require('../models/Chats');

const router = express.Router();

//this is the page where the chats with a particular friend will be shown

//@GET /api/chats/
//@DESC sends the chat with a particular person
router.post("/", (req, res) => {
    //give the complete chat for the current user
    const handle = req.body.handle; // handle of the friend whose chat is opened
    Users.findOne({user: req.body.curUser})
        .then(user => {
            const chat = user.chats.find(chat => chat.userHandle === handle);
            console.log(chat);
            res.json(chat);
        }).catch(e => {
            res.json(e);
        })
});

router.post("/getChat",(req,res)=>{
    const {handle,curUser} = req.body;
    Chats.findOne({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]}, {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]})
    .then(chatResponse=>{
        console.log(chatResponse);
        res.json(chatResponse)
    })
})


//@GET /api/chats/send
//@DESC sends the chat
router.post("/send", (req, res) => {
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
        .then(async(chat) => {
            if(chat == null){
                const newChat = new Chat({
                    userHandle1: req.body.handle,
                    userHandle2: req.body.curUser,
                    msgs: [{...msgBody}]
                });
                const resChat = await newChat.save();
                console.log(resChat);
                res.json(resChat);
            }else{
                Chats.findOneAndUpdate({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]}, {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]}, {$push: {msgs: msgBody}}, {upsert: true})
                    .then(chat => {
                        console.log('msg sent',chat);
                        Chats.findOne({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]}, {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]})
                        .then(chatResponse=>{
                            console.log(chatResponse);
                            res.json(chatResponse)
                        })
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