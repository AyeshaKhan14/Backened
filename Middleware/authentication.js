var jwt = require('jsonwebtoken');
require('dotenv').config()

const authentication =(req,res,next)=>{
    const token= req.headers?.authorization?.split(" ")[1]
    if(!token)
    {
        res.send({"mssg" :"Plz Login"})
    }
    var decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded)
    const user_id= decoded.userId
    if(decoded)
    {
         req.body.user_id= user_id;
        next()
    }
    else{
        res.send({"mssg" :"Plz Login"})
    }

}
module.exports= {authentication}