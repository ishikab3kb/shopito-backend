const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const bcrypt = require("bcryptjs");

// in this we are gonnna define all of the properties that are user data should have 
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
        },
        email: {
            type: String,
            required: [true, "Please add a email"],
            unique: true,
            trim: true,   // if there is space at the starting or end of the email then it willl trim them
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please enter a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "Please add a password"],
            minLength: [6, "Password must be up to 6 characters"],
            //   maxLength: [23, "Password must not be more than 23 characters"],
        },
        role: {
            type: String,
            required: [true],
            default: "customer",
            enum: ["customer", "admin"],   // this specifies the posssible roles a user can have
        },
        photo: {
            type: String,
            required: [true, "Please add a photo"],
            default: "https://i.ibb.co/4pDNDk1/avatar.png",
        },
        phone: {
            type: String,
            default: "+234",
        },
        address: {
            type: String,     // address, state, country
        },
        state: {
            type: String,     // address, state, country
        },
        country: {
            type: String,     // address, state, country
        },
    }
)

// Encrypt password before saving it to db
// this basically means before you save the users data in db fire the following callback function
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        return next()
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    // we call the next function to proceed with whatever will be having next
    next()
})

// exporting the schema 
const User = mongoose.model("User", userSchema); 
module.exports = User;