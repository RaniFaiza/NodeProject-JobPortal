const mongooseVar = require('mongoose');
const validator = require('validator');

//schema
const userSchema = new mongooseVar.Schema({
    name:{
          type:String,
          required:[true,'Name is required.']
        },
    lastname:{
        type:String
    },
    email:{
        type:String,
        required:[true,'Email is required.'],
        isLowercase:true,
        validate:validator.isEmail       //validate from mongoose
    },
    password:{
        type:String,
        required:[true,'Password is required.'],
        minlength:[6, 'Password length should be greater than 6 characters.']
    },
    location:{
        type:String,
        default:"Pakistan"
    }

},
{timestamps:true});

const userModel = mongooseVar.model('user',userSchema);

module.exports = {
    userModel,
}