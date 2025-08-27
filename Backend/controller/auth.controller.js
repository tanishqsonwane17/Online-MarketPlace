const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function createUser({
    email,
    fullName:{firstName, lastName},
    username,
    password,
    role = "user"
}) {
         const isUserAlreadyExist = await userModel.findOne({
        $or:[
            {email:email},
            {username:username}
        ]
    })
    if(isUserAlreadyExist){
        throw new Error("User already exist")
    };
     
    const hashedPassword = await bcrypt.hash(password, 10)
 const user = await userModel.create({
        email,
        fullName: {
            firstName,
            lastName
        },
        username,
        password: hashedPassword,
        role
    })
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
}

async function registerUser(req, res) {
    const {email, fullName:{firstName, lastName}, username, password} = req.body
   
  try{
     const {user,token} = await createUser({
        email,
        fullName:{firstName, lastName},
        username,
        password
    })

    res.cookie('token',token)
    res.status(201).json({
        message: "User created successfully",
        user
    })
  }catch(err){
    return res.status(400).json({
        message: err.message
    })
  }


  return{user,token}
}

async function loginUser(req, res) {
    const {email, password, username} = req.body

    const user = await userModel.findOne({
        $or:[
            {email:email},
            {username:username}
        ]
    }).select('+password')

    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if(!isPasswordMatch){
        return res.status(401).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
    res.cookie('token',token)
    res.status(200).json({
        message: "User logged in successfully",
        token
    })

    
}

async function  registerSeller(req, res) {
    const {email, fullName:{firstName, lastName}, username, password} = req.body

    try{
        const {user:seller,token} = await createUser({
            email,
            fullName:{firstName, lastName},
            username,
            password,
            role:"seller"
        })
        res.cookie('token',token)
        res.status(201).json({
            message: "Seller created successfully",
            user
        })
    }catch(err){
        return res.status(400).json({
            message: err.message
        })
    }
}

module.exports = {
    registerUser, loginUser, registerSeller
}