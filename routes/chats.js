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
            res.json(chat);
        }).catch(e => {
            res.json(e);
        })
});
router.post("/getChat",(req,res)=>{
    const {handle,curUser} = req.body;
    Chats.findOne({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]}, {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]})
    .then(chatResponse=>{
        if(chatResponse === null){
            return res.json({
                userHandle1:handle,
                userHandle2:curUser,
                msgs:[]
            });
        }
        res.json(chatResponse)
    })
})
//@GET /api/chats/send
//@DESC sends the chat
router.post("/send", (req, res) => {
    //send a msg
    console.log("message sent by",req.body.curUser);
    console.log("message recieve by",req.body.handle);
    const handle = req.body.handle; // handle of the friend whose chat is opened
    const msgBody = {
        msgText: req.body.msgText,
        from: req.body.from,
        to: req.body.to,
        timestamp: req.body.timestamp,
        seenByFrom: req.body.seenByFrom,
        seenByTo:req.body.seenByTo,
        // seen: false,
        saved: false
    }
    //updating the chat collection
    Chats.findOne({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]},
                     {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]})
        .then(async(chat) => {
            if(chat == null){
                const newChat = new Chat({
                    userHandle1: req.body.handle,
                    userHandle2: req.body.curUser,
                    msgs: [{...msgBody}]
                });
                const resChat = await newChat.save();
                res.json(resChat);
            }else{
                Chats.findOneAndUpdate({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]},
                                            {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]},
                                            {$push: {msgs: msgBody}},
                                            {upsert: true})
                    .then(chat => {
                        Chats.findOne({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]},
                                             {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]})
                        .then(chatResponse=>{
                            res.json(chatResponse)
                        })
                    })
                    
            }
        })
        .catch(e => {
            res.json(e);
        });
});

//@POST /api/chats/deleteMsg
//@DESC for deleting the seen messages from the collection
router.post('/deleteMsg', (req, res) => {
    // req.body has --> handle, curUser

    const delMessagesIDs = req.body.ids;
    
    Chats.findOneAndUpdate({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]},
                            {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]},
                            {$pull: {msgs: {saved: false}}}, {multi: true})
        .then(chat => {

            res.json({success: true});
        })
        .catch(e => {
            res.json(e);
        })
        
});


//@POST /api/chats/seenMsg
router.post('/seenMsg', (req, res) => {
    //req.body has msgID, handle, curUser
    const seenMsgIDs = req.body.msgIDs; //an ARRAY
    console.log(seenMsgIDs);
    Chats.findOne({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]},
                            {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]})
        .then(chat => {
            //finding the index and the msg from the list of all msgs
            const msgList = chat.msgs;
            const newMsgList = msgList.forEach((msg, index) => {
                if(seenMsgIDs.includes(`${msg._id}`)){
                    console.log(msg);
                    msg.seenByTo = true;
                }
            });

            //updating the messages in the database
            Chats.findOneAndUpdate({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]},
                {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]},
                {$set: {msgs: msgList}})
                .then(chatRes => {
                    return res.json({success: true}); 
                });
            
        })
        .catch(e => {
            res.json(e);
        });
});

//@POST /api/chats/saveMsg
//@DESC for setting the saved status of messages to true
router.post('/saveMsg', (req, res) => {
    //req.body has msgID, handle, curUser
    const saveMsgIDs = req.body.msgIDs; //an ARRAY
    
    Chats.findOne({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]},
                            {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]})
        .then(chat => {
            //finding the index and the msg from the list of all msgs
            const msgList = chat.msgs;
            const newMsgList = msgList.forEach((msg, index) => {
                if(saveMsgIDs.includes(`${msg._id}`)){
                    msg.saved = true;
                }
            });

            //updating the messages in the database
            Chats.findOneAndUpdate({$or: [{$and: [{userHandle1: req.body.handle}, {userHandle2: req.body.curUser}]},
                {$and: [{userHandle1: req.body.curUser}, {userHandle2: req.body.handle}]}]},
                {$set: {msgs: msgList}})
                .then(chatRes => {
                    return res.json({success: true}); 
                });
            
        })
        .catch(e => {
            res.json(e);
        });
});

//@GET /api/chats/test
//@DESC for test
router.get("/test", (req, res) => {
    res.json({msg: "Chat works"});
})
module.exports = router;

