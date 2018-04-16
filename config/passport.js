const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
require('../models/users');
const User = mongoose.model('users');

module.exports = (passport) => {
    passport.use(new LocalStrategy({usernameField: 'email'},(email, password,done) =>{
        User.findOne({
            //Match User
            email:email
        })
            .then(user => {
                if(!user){
                    return done(null,false,{message: 'User not found'});
                }
                //Match password
                bcrypt.compare(password,user.password,(err, isMatch) =>{
                    if(err) throw err;
                    if(!isMatch){
                        return done(null,false,{message: 'Password Incorrect'});
                    }
                    return done(null, user);
                })
            })
    }));
    /*The user id (you provide as the second argument of the done function) is saved in the session
        and is later used to retrieve the whole object via the deserializeUser function.
        serializeUser determines, which data of the user object should be stored in the session.
        The result of the serializeUser method is attached to the session
        as req.session.passport.user = {}
    */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
/*
    The first argument of deserializeUser corresponds to the key of the user object that was given to the done function.
    So your whole object is retrieved with help of that key.
    That key here is the user id (key can be any key of the user object i.e. name,email etc).
    In deserializeUser that key is matched with the in memory array / database or any data resource.
    The fetched object is attached to the request object as req.user
 */
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};