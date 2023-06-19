
let user=require('../models/users');
const sequelize = require('../util/database');
const uuid=require('uuid')
const Sib=require("sib-api-v3-sdk")
require("dotenv").config()
const forgotpassword=require('../models/forgot')
const bcrypt=require('bcrypt')


exports.forgotpass=async(req,res)=>{
    try{
        const email=req.body.email;
        console.log(req.body.email)
        const users=await user.find({
           email:email
        })
        console.log(users.__proto__)
        if(users){
            const id=uuid.v4();
            // await users.createForgot({id,active:true})
            const createForgot=new forgotpassword({
                _id:id,
                isactive:true,
                userId:users[0]._id
            })
            await createForgot.save()
        const client=Sib.ApiClient.instance
            
        const apiKey=client.authentications['api-key']
        apiKey.apiKey=process.env.SENDINBLUE_API_KEY
        
        const transEmailApi=new Sib.TransactionalEmailsApi();
        const sender={
            email:"amruthkrishnaa@gmail.com"
        }
    
        const receivers=[
            {
                email:email
            }
        ]

        const data= await transEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:`this is the test subject`,
            textcontent:`reset password`,
            htmlContent:`<a href="http://localhost:8081/password/reset_password/${id}">Reset password</a>`
            
        })
        console.log(data)
        res.json({message:"mail sent successfully..!!",success:true})
        }else{
            console.log("user doesn't exist")
            res.json({message:"user doesnt exist",success:false})
        }
    
    }catch(e){
        console.log("error in forgot password",e)
    }
}

exports.resetpass=async(req,res)=>{
    try{
        const id=req.params.id;
        const forget=await forgotpassword.find({_id:id})
        console.log(forget)
        if(forget){
            await forget.findOneAndUpdate({_id:id},{isactive:false});
    res.send(`<html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
            </script>
            <style>
            body{
            justify-content: center;
            text-align: center;   
        }
        input{
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 10px;
            width:60%
        }
        button{
            color: white;
            background-color: rgb(73, 188, 73);
            padding: 10px 28px;
            text-align: center;
            font-family: inherit;
            font-weight: bold;
            font-size: large;
            border-radius: 20px;   
        }
        header{
            background-color: rgb(20, 117, 156);
            color: white;
            padding-top:86px ;
            margin-bottom:15px;
            height: 300px
        }
        label{
            font-family: inherit;
            font-size: 30px;
            }
            </style>
            <body>
            <header>
                <h1>Enter your New Password<h1>
            </header>
            <form action="/password/update_password/${id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input><br><br>
                <button>reset password</button>
            </form>
            </body>
        </html>`
        )
    res.end()
    }
    }catch(e){
        console.log("reset password error",e)
        res.json({Error:e})
    }
}

exports.updatepass=async(req,res)=>{
    try{
        const {newpassword}=req.query;
        const resetid=req.params.rid;
        console.log(resetid)
        const row=await forgotpassword.find({_id:resetid})
        const users=await user.find({ _id:row[0].userId})
        if(users){
                bcrypt.hash(newpassword,10,async(err,hash)=>{
                    if(err){
                        console.log(err);
                        throw new Error(err);
                    }
                    // await users.update({password:hash})
                    let data=await user.findOneAndUpdate({_id:users[0]._id},{password:hash}) 
                    return res.json({message:"password updated successfully",success:true})
                })    
        }else{
            return res.json({message:"no user exists",success:false})
        }
    }catch(e){
        console.log(e);
        return res.json({error:e})
    }
}

