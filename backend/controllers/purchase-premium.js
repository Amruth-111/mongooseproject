
const Razorpay=require('razorpay');
let purchase=require('../models/purchase')
let user=require('../models/users')
let expense=require('../models/expenses')
let jwt=require('jsonwebtoken');
const expenses = require('../models/expenses');
require('dotenv').config();

// let userJWTgenerator=require('./add')

function generateAccessToken(id,ispremium){
    return jwt.sign({userId:id,ispremium},process.env.JWT_KEY);
}

exports.buypremium=async(req,res)=>{
    console.log(process.env.KEY_ID)
    try{
        let rzp=new Razorpay({
            key_id:process.env.KEY_ID,
            key_secret:process.env.KEY_SECRET
    })
    console.log(rzp)
    const amount=2500
    rzp.orders.create({amount,currency:"INR"},async(err,order)=>{
        if(err){
            throw new Error(JSON.stringify(err))
        }
    //     await purchase.create({
    //         orderid:order.id,
    //         status:"PENDING",
    //         userId:req.user.id
    //     })
    //     return res.json({order,key_id:rzp.key_id})
    // })

    const data=new purchase({
        orderId:order.id,
        status:"PENDING",
        userId:req.user[0]._id
    })
    await data.save()
    res.json({order,key_id:rzp.key_id})
})


    }catch(e){

        console.log("Razor pay error",e)
        res.json({Error:e})
    }
    

}

exports.updatetransactionstatus=async(req,res)=>{
    try {
            const payment_id=req.body.payment_id
            const order_id=req.body.order_id
            console.log(payment_id)
            
            const order=await purchase.find({'orderId':order_id})
            
            if(payment_id===null){
                res.json({message:"payment is failed"})
              return  purchase.updateOne({'paymentId':payment_id,status:"FAILED"})
            }
            function updateTable(order){
               return new Promise((resolve)=>{
                    resolve(purchase.updateOne({'paymentId':payment_id,status:"SUCCESS"}))
               }) 
            }
            function updateUserTable(){
                return new Promise((resolve)=>{
                   resolve(user.findOneAndUpdate({_id:req.user[0]._id},{"premium":true}))
                })
            }
            Promise.all([updateTable(order),updateUserTable()]).then(()=>{
                res.json({success:true,token:generateAccessToken(req.user.id,true),message:"Hurrey..!! you are a premium user now"})
            })
        }catch(err){
            console.log("error in update transaction",err)
            res.json({Error:err})
        }
    }

