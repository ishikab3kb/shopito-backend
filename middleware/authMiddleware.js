const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// protect some routes.... that is provide access to some data only after chceking if the user is logged in
const protect = asyncHandler(async(req,res,next) => {
    try {
        // since we logged in a user using cookie so we need to use that cookie here. so we are using res.cookies.token as the name of the cookie we have given to login user is token
        const token = req.cookies.token
        if(!token){
            res.status(401);
            throw new Error("Not authorized, Please Login");
        }
        // verify token. we also have the chcek that the token hasn't expired. we verify user token using JWT_SECRET
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        // get user id fron the token and also we don't want he password sent
        const user = await User.findById(verified.id).select("-password");
        // now checked if the user exists in db
        if(!user) {
            res.status(401);
            throw new Error("Not authorized, Please Login");
        }
        req.user = user;
        // we usually mention next that the required task is done now you can proceed with whatever the next task is
        next();

    }catch(error) {
        res.status(401);
        throw new Error("Not authorized, Please Login");
    }
})

module.exports = {
    protect,
}