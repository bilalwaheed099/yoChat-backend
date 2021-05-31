const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    userHandle1: {
        type: String,
        required: true
    },
    userHandle2: {
        type: String,
        required: true
    },
    msgs: [
        {
            to: {
                type: String,
                required: true,
            },
            from: {
                type: String,
                required: true
            },
            msgText: {
                type: String,
            },
            timestamp: {
                type: String
            },
            // seen: {
            //     type: Boolean
            // },
            saved: {
                type: Boolean
            }
        }
    ]
});

module.exports = Chat = mongoose.model('chats', ChatSchema);