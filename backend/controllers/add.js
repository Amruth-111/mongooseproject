
let bcrypt=require('bcrypt')
let users=require('../models/users');
let jwt=require('jsonwebtoken')
require('dotenv').config();


function isStringInvalid(string){
    if(string===undefined || string.length===0){
        return true;
    }else{
        return false
    }
}

exports.signup=async(req,res)=>{
    try{
        let {name,email,password}=req.body;
        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)){
           return res.json({message:"something is missing",success:false})
        }
        if(password.length<5){
            return res.json({success:false,message:"password must contains atleast 8 characters"})
          }
        
        bcrypt.hash(password,10,async(err,hash)=>{
            if(err){
                console.log("encryption error-->",err)
                
             }
            const personemail=await users.find({"email":email})
            //mongodb find to check email

            if(personemail.length!==0){
                return res.json({success:false,message:"user already exist,change the Email"})
            }

           const data=new users({
                name:name,
                email:email,
                password:hash 
           })
           await data.save()
        res.status(201).json({message:"signup successfull ",success:true})
        })
        
    }catch(e){
        console.log("error in signup method");
        res.json({message:"user aleready exists so please enter new email",success:false})
    }
    
}
function generateAccessToken(id,premium){
    return jwt.sign({userId:id,premium},process.env.JWT_KEY);
}

exports.signin=async(req,res)=>{
    try{
        let {email,password}=req.body;
        if(isStringInvalid(email)|| isStringInvalid(password)){
            return res.json({message:"something is missing",success:false})
        }

        const user = await users.find({ 'email':email });
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(err){
                    throw new Error("something went wrong")
                }
                if(result===true){
                    return res.json({success:true,message:"login successfull",token:generateAccessToken(user[0].id,user[0].premium)}) 
                    
                }
                else{
                    return res.json({success:false,message:"password doesnt match"})
                }
            })
            }else{
                return json({success:false,message:"user doesnot exist"})
            }
        }

    catch(e){
        res.json({error:e})
        console.log("aabj")
    }
}


