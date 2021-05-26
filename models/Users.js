const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: {
        type: [String]
    },
    chats: [
        {
            userHandle: {
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
                    msg: {
                        type: String,
                    },
                    timestamp: {
                        type: String
                    }
                }
            ]
        }
    ]

});

module.exports = User = mongoose.model('users', UserSchema);