// to use the variables from .env file we require this module
const dotenv = require("dotenv").config();
// the framework we'll be using
const express =  require("express");
// mongoose helps us connect to mongodb
const mongoose = require("mongoose");
// we require cors as it helps resolve connection issues betwen the frontend and the backend
const cors = require("cors");
// we are goin to authenticate our user using cookies, so cookie-parser module
const cookieParser  = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware");

const app = express()

// <-------------Middlewares---------------->
// standard middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
//initalize cors
// here we are definig an object with the property origin which will have value of frontend url to which we want to have the permission to make requests to the backend
app.use(cors({
    origin: ["http://localhost:3000", "https://shopito-ecommerce-app.netlify.app"],
    credentials: true       // we set it to true as we want to be able to send token from the backend to the frontend when the user makes request
}))


// <------------------Routes---------------->
app.use("/api/users", userRoute)
// creating a route for the home page
app.get("/",(req,res) => {
    res.send("Home Page")
})

// Error Middleware
app.use(errorHandler); 

// <-------------------CREATE A PORT-------------->
 const PORT = process.env.PORT || 5000

 mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`)
        })
    }).catch((err) => {
        console.log(err)
    })
