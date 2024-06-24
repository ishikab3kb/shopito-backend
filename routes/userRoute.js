const express  = require("express");
const { registerUser, loginUser, logout, getUser, getLoginStatus, updateUser, updateUserPhoto } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register",registerUser);     // the functions mentioned here as callback will be defined in userController
router.post("/login",loginUser);
router.get("/logout",logout);
router.get("/getUser", protect, getUser);
router.get("/getLoginStatus", getLoginStatus);
// for updating user we are gonna use patch route as sometimes we want toupdate only few properties say profile image and leave the rest as it is
router.patch("/updateUser", protect, updateUser);
router.patch("/updatePhoto", protect, updateUserPhoto); 
module.exports = router;