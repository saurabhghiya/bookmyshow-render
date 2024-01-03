const jwt = require('jsonwebtoken');

module.exports = function (req,res,next){
    try {
        // getting token from header
        
        const token = req.headers.authorization.split(' ')[1];
        // verify token using jwt
        const decoded = jwt.verify(token,process.env.secret_key_jwt);
        req.body.userId = decoded.userId;
        next();
    } catch (error) {
        res.send({
            success:false,
            message:'Invalid Token'
        })
    }
}