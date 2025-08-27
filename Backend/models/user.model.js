const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    fullName:{
        firstName:{
            type:String,
            required:true
        },
        lastName:{
            type:String,
        }
    },
    role:{
        type:String,
        enum:['user','seller'],
        default:'user'
    },
    password:{
        type:String,
        required:true,
        select:false
    }
})

const User = mongoose.model('User',userSchema)
module.exports = User