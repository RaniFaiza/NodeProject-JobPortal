const { userModel } = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const hash = require('hash');
const jwt = require('jsonwebtoken');

async function posttest(req, resp) {
    const { name, email } = req.body;
    resp.status(200).send(`My name is ${name} and my email is ${email}`);
}

/******** JWT Token Generation ********/
async function GenerateToken(userdata) {
    return jwt.sign({ _id: userdata._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })

}

//User Registration
async function userRegister(req, resp, next) {
    const { name, lastname, password, email, location } = req.body;
    // try{
    if (!name || !password || !email) {
        next("Enter all mandatory fields.");
    }
    const emailexist = await userModel.findOne({ email })
    if (emailexist) {
        next("Email already exists.");
    }
    const securepassword = await bcrypt.hash(password, 10);
    const data = new userModel({
        name,
        lastname,
        password: securepassword,
        email,
        location
    });
    await data.save();
    return resp.status(201).send('User Registered Successfully.')

    // }
    // catch(error){
    //     // resp.status(502).send(`Error:${error}`);
    //     return next(error);
    // }

}

//User Login
async function userLogin(req, resp, next) {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
        return next('Enter mandatory fields.');
    }

    //find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
        return next('Invalid Email or Password.');
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next('Invalid Email or Password.');
    }
    else {
        const token = await GenerateToken(user);
        user.password = undefined;
        resp.status(200).send({
            message: 'User Login Successfully.',
            token
        })

    }


}

module.exports = {
    posttest,
    userRegister,
    userLogin,

}