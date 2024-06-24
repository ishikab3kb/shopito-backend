const asyncHandler = require("express-async-handler");     // its a package that helps us to create our controller function in terms of handling errors
const jwt = require("jsonwebtoken");         // can help us create a toke that we can send to frontend
const bcrypt = require("bcryptjs");          // to encrypt our passwords
const User = require("../models/userModel")

// for us to create a token we require JWT secrets. its like a secrets code that is used to create that token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: "1d"
    })
}

// register user
const registerUser = asyncHandler(async(req,res) => {
    const {name, email, password} = req.body;

    //Validation
    if(!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all the required fields");
    }
    if(password.length < 6) {
        res.status(400);
        throw new Error("Password must be up to 6 characters");
    }
    //Check if user exists
    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400);
        throw new Error("Email has already been registered");
    }

    // Create new user 
    const user = await User.create({
        name,
        email,
        password
    })

    // generate token
    const token  =  generateToken(user._id);

    if(user) {
        const { _id, name, email, role }=user
        // we are sending the token to frontend over here
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            // when you are in development mode you need to comment this two properties as yuou may have some errors logging in as user when you set secure to tru
            secure: true,
            sameSite: none,
        });
        res.status(201).json({
            _id, name,email,role, token
        })
    }
    else {
        res.status(400);
        throw new Error("Invalid use data")
    }

    res.send("Register User");
})

// Login user
const loginUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    // validate request
    if(!email || !password) {
        res.status(400);
        throw new Error("Please add the email and password");
    }
    // check if the user existes in db
    const user = await User.findOne({email});
    if(!user) {
        res.status(400);
        throw new Error("User does not exist");
    }
    // after getting confirmed that the user exists we check that the entered password matches the one in db
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    // generate token
    const token  = generateToken(user._id);

    if(user && passwordIsCorrect) {
        // we are sending the token to frontend over here
        const userDataWithoutPassword = await User.findOne({email}).select("-password");
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            // when you are in development mode you need to comment this two properties as yuou may have some errors logging in as user when you set secure to tru
            secure: true,
            sameSite: none,
        });

        // send user data
        res.status(201).json(userDataWithoutPassword);
    }
    else {
        res.status(400);
        throw new Error("Invalid user or password");
    }
    // res.send("Login User");
})

// logout user
const logout = asyncHandler(async(req,res) => {
    // so when we logged in the user we send a cookie as a response. Now to logout we can send an empty cookie or delete the previous one
    res.cookie("token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        // when you are in development mode you need to comment this two properties as yuou may have some errors logging in as user when you set secure to tru
        secure: true,
        sameSite: none,
    });
    return res.status(200).json({message: "Succesfully Logged Out"})
    // res.send("logout")
})

//Get user
const getUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id).select("-password");
    if(user) {
        res.status(200).json(user);
    }
    else {
        res.status(400);
        throw new Error("User not Found");
    }
    // res.send("Get User")
})


// GET LOGIN STATUS
const getLoginStatus  = asyncHandler(async(req,res) => {
    // since we logged in a user using cookie so we need to use that cookie here. so we are using res.cookies.token as the name of the cookie we have given to login user is token
    const token = req.cookies.token
    if(!token){
        return res.json(false);
    }
    // verify token. we also have the chcek that the token hasn't expired. we verify user token using JWT_SECRET
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    if(verified) {
        res.json(true);
    }else {
        res.json(false);
    }
    // res.send("Login status");
})

// update user
const updateUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        // so we destructured the property of the user and updated them by the values we recieved in request
        const { name, phone, address } = user;
        // we gave an or statement here that if the value is not updated just save the earlier value
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.address = req.body.address || address;

        const updatedUser = await user.save();
        console.log(updatedUser);
        res.status(200).json(updatedUser);
    } else {
        res.status(404);
        throw new Error("User not found");
    }

    // res.send("Correct");
})

const updateUserPhoto = asyncHandler(async(req,res) => {
    const {photo} = req.body
    const user = await User.findById(req.user._id);
    user.photo = photo

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
    // res.send("photo updated");
})

module.exports ={
    registerUser,
    loginUser,
    logout,
    getUser,
    getLoginStatus,
    updateUser,
    updateUserPhoto,
}