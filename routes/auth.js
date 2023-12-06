const express = require("express");
const router = new express.Router();
const jwt = require('jsonwebtoken');
const ExpressError = require("../expressError");
const User = require("../models/user");
const {SECRET_KEY} = require("../config");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async(req,res,next)=>{
    try{
        let {username,password} = req.body;
        if(await User.authenticate(username,password)){
            let token = jwt.sign({username}, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.status(200).json({token});
        }else{
            throw new ExpressError("Invalid username or password", 400);
        }
    }catch(e){
        return next(e);
    }
})




/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async(req,res,next)=>{
    try{
        const {username, password, first_name, last_name, phone} = req.body;
        const result = await User.register({username, password, first_name, last_name, phone})
        const token = jwt.sign(result, SECRET_KEY);
        User.updateLoginTimestamp(result.username);
        return res.json({token})
    }catch(e){
        return next(e)
    }
})



module.exports = router;