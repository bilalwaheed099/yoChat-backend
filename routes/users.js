const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');
const User = require('../models/Users');

// @POST route /api/users/test
// @DESC testing the reoute
router.post('/test', (req, res) => {
    res.send({msg: "Users works!"})
})

// @POST route /api/users/register
// @DESC register the user
router.post('/register', (req, res) => {
    // req body => { fn, ln, un, email, pw }
    // 1. check if the email already exists
    // 2. if not then create the new user object
    // 3. hash the pwd
    // 4. save the user object
    User.findOne({username:req.body.username})
        .then(user => {
            if(user){
                return res.json({user: "User Already Exists!",success:false})
            }
            else{
                const newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                });

                //encryption of the password
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                res.json(user);
                            })
                            .catch(err =>{
                                console.log(err);
                            })
                    });
                });
            }
        });
});


// @POST route /api/users/login
// @DESC login the user
router.post('/login', (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({username})
        .then(user => {
            if(!user){
               return res.json({username: "Username not found!",success:false});
            }
            // compare password
            bcrypt.compare(password, user.password)
                .then(isMatched => {
                    if(isMatched){
                        const payload = {
                            id: user.id,
                            username: user.username,
                            email: user.email
                        }

                        //jwt
                        jwt.sign(payload, keys.secret, {expiresIn: 3600}, (err, token) => {
                          res.json({
                              success: true,
                              token: 'Bearer ' + token
                          });
                        });
                    }
                    else {
                        return res.json({username: "Password does not match",success:false});
                    }
                });
        });
});


module.exports = router;