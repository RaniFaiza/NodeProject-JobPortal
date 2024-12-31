const express = require('express');
const userroute = express.Router();
//import controller function
const { updateUser } = require('../Controllers/userController');
const { userauth } = require('../Middlewares/authMiddleware');

//update user
userroute.put('/update-user', userauth, updateUser);

module.exports = {
    userroute,
}