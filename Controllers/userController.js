const { userModel } = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const hash = require('hash');

//update user
async function updateUser(req, resp, next) {
    const { name, lastname, email, password, location } = req.body;
    try {
        if (!name || !email || !password) {
            return next('Please Enter all mandatory fields.');
        }
        const data = await userModel.findById(req.user);
        if (!data) {
            return next('User not found.')
        }

        const securepassword = await bcrypt.hash(password, 10);
        data.name = name;
        data.lastname = lastname;
        data.email = email;
        data.password = securepassword;
        data.location = location;
        await data.save();
        return resp.status(200).send('Data updated Successfully.');
    }
    catch (error) {
        next(`Error in update: ${error}`);
    }

}


module.exports = {
    updateUser,
}