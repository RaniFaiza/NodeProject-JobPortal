const { userModel } = require('../Models/userModel');
const jwt = require('jsonwebtoken');

async function userauth(req, resp, next) {
    console.log("I am in auth middleware.");
    const authheader = req.headers.authorization;
    console.log(`auth header ${authheader}`);
    if (!authheader || !authheader.startsWith('Bearer')) {
        next('Authentication failed');
    }
    //extracting/separating token from Bearer string
    const token = authheader.split(' ')[1];
    try {
        //extracting id
        const { _id } = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(`id:${_id}`);
        const data = await userModel.findById(_id);
        if (!data) {
            next('User not found.');
        }
        req.user = _id;
        next();
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    userauth,
}