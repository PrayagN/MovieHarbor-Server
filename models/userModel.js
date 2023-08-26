const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:[true,'Please add a full name']
    },
    email:{
        type:String,
        required:[true,'Please add an email'],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:[6,'Password must be at least 6 characters']
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    likedMovies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Movie'
    }],
},{timestamps:true});

module.exports = mongoose.model('User',userSchema)