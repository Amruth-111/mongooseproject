const User=require('../models/users');
const jwt=require('jsonwebtoken')

const authentication=async(req,res,next)=>{
    // const token=req.header('Authentication');
    // console.log(token)
    try{
        const token=req.header('Authentication');
        console.log(token)
        const user =jwt.verify(token,"amsnshshadshkncm283u2oi901nxkjINZ9N0Z90219");
        if(!user){
            return res.json({message:"there is no such userid"})
        }
        console.log(user.userId)
        let person=await User.find({"_id":user.userId})
        req.user=person;
        next();
    }catch(e){
        console.log(e);
        console.log("jws fucoink")
        res.status(500).json({success:false})
    }
}

module.exports={
    authentication
}