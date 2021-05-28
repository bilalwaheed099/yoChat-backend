const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { hash, compare } = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');

const profile = require('./routes/profile');
const users = require('./routes/users');
const friends = require('./routes/friends');
const chats = require('./routes/chats');


const app = express();

// express middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cors middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

//cookieParser middleware
app.use(cookieParser());

//Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

//Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/friends', friends)
app.use('/api/chats', chats)


const db = require('./config/keys').mongoURI;

mongoose
    .connect(db)
    .then(() => {console.log("Connected to MongoDB successfully!")})
    .catch((e) => {console.log("There was an error connecting to MongoDB!" + e)})


const PORT = 5000;

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)});

