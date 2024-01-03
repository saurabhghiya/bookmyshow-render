const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

// route to register new user
router.post('/register',async(req,res)=>{
    try{
        const userExists = await User.findOne({email:req.body.email});
        if(userExists){
            return res.send({
                success:false,
                message:"User already exists"
            })
        }

        // using bcrypt to hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        req.body.password = hashedPassword;

        const newUser = await User(req.body);
        await newUser.save();
        res.send({
            success:true,
            message:"User Registered, please Login"
        })

    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
    
});

// route to login - check for user details and login
router.post('/login', async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email:email})
    if(!user){
        return res.send({
            success:false,
            message: "User does not exist"
        });
    }

    const validPassword = await bcrypt.compare(password,user.password);

    if(!validPassword){
        return res.send({
            success: false,
            message: "Invalid Password"
        });
    }
    // token created using jsonwebtoken
    const token =  jwt.sign({userId:user._id},process.env.secret_key_jwt,{expiresIn:'1d'});
    res.send({
        success:true,
        message:"User Logged In",
        greet:`Hello ${user.name}`,
        token:token
    });
});

router.get('/get-current-user',authMiddleware, async(req,res)=>{
    //getting user details from db excluding the password
    const user = await User.findById(req.body.userId).select('-password');
    res.send({
        success:true,
        message:"You are allowed to go to protected route",
        data:user
    });
});

module.exports = router;