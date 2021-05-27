const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FriendSchema = new Schema({
    friends: [
        {
            username: {
                type: String,
                required: true
            },
            lastSeen: {
                type: Date,
            }
        }
    ]
});