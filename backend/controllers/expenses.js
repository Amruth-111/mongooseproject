let expenses=require('../models/expenses');
let users=require('../models/users');
const sequelize = require('../util/database');
const AWS=require('aws-sdk')
const downloaddb=require('../models/downloaddb')
require('dotenv').config();
// let stringinvalid=require('./add')

function isStringInvalid(string){
    if(string===undefined || string.length===0){
        return true;
    }else{
        return false
    }
}


exports.addexpense=async(req,res)=>{
    // const t=await sequelize.transaction();
    try{
        let {amount,description,category}=req.body
        let userId=req.body.userId //
        if(isStringInvalid(amount)||isStringInvalid(description)||isStringInvalid(category)){
            return res.json("something is missing");
        }
        let result=new expenses({
            amount:amount,
            description:description,
            category:category,
            userId:userId //
        })
        await result.save();
       
        const user=await users.find({_id:userId}) //
        const totalExpense=Number(user[0].totalExpenses)+Number(amount)
        // await user.update({totalExpenses:totalExpense},
        //     {
        //         where:{id:req.user.id},
        //         transaction:t
        //     })
        await users.findOneAndUpdate({_id:userId},{totalExpenses:totalExpense})
        console.log(result)
        // await t.commit();
        res.json({newexpense:result})
    }catch(e){
        // await t.rollback();
        console.log("error in add method")
        res.json({error:e})
    }
    
}

let expenseid
let totalamtdb;
exports.showexpenses=async(req,res)=>{
    // expenseid=req.user.id
    try{
        totalamtdb=req.user
        expenseid=req.user[0]._id  //array of elements we are going to get
        // let allexpense=await expenses.findAll({where:{userId:expenseid}});
       
        const allexpense=await expenses.find({userId:expenseid})
        res.json({allexpenses:allexpense})

    }catch(e){
        res.status(404).json({error:e})
    }
    
}
exports.deleteexpenses=async(req,res)=>{
    // const t=await sequelize.transaction();
    try{
        if(!req.params.id){
            res.json({message:"id is mandatory to delete the expenses"})
        }
        const delid=req.params.id;
        console.log(delid)
        // console.log(req.user.totalExpense)
        // const expense=await expenses.findOne({
        //     where:{
        //         id:delid
        //     }
        // })
       let b= await expenses.findByIdAndRemove({'_id':delid})
       console.log(b)
        // console.log(expense.amount)
        // console.log(req.user.totalExpenses)
        // let deleted=await expenses.destroy({where:{id:delid,userId:req.user.id}},{transaction:t})
        // const totalExpense=Number(req.user.totalExpenses)- Number(expense.amount)
        // console.log(totalExpense)
        // await users.update({totalExpenses:totalExpense},{
        //     where:{id:req.user.id},
        //     transaction:t
        // })
        // console.log(upt)
        // if(deleted===0){
        //     return res.json({success:false,message:"id does not belong to any user"})
        // }
        // await t.commit();
        return res.json({deleted:deleted,message:"deleted sudccessfully"})
    }catch(e){
        // await t.rollback();
        console.log("error in expenses delete method")
        res.json({error:e})
    }
}


function uploadtos3(data,filename){
    const BUCKET_NAME=process.env.BUCKET_NAME
    const IAM_USER_KEY=process.env.IAM_USER_KEY
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET


    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
    })

    var params={
        Bucket:BUCKET_NAME,
        Key:filename,
        Body:data,
        ACL:'public-read'
    }
    console.log(BUCKET_NAME,IAM_USER_SECRET)

    return new Promise((resolve,reject)=>{
        s3bucket.upload(params,(err,s3res)=>{
            if(err){
                console.log('something went wrong',err)
                reject(err)
            }else{
                console.log("success",s3res)
                resolve(s3res.Location)
            }
        })
    })
    
}
exports.downloadexpenses=async(req,res)=>{
    try{
        // const expenses= await req.user.getExpenses();

        const response=await expenses.find({userId:req.user[0]._id})

        let stringifiedexp=JSON.stringify(expenses)
        const userId=req.user[0]._id
        let fileName=`expense.txt${userId}/${new Date()}`
        let fileurl=await uploadtos3(stringifiedexp,fileName);

       //storing url in download table
    //    const data=await req.user.createDownload({
    //     url:fileurl
    //    })


        // const fetchData=await downloaddb.findAll({where:{userId:req.user.id}})
        // res.json({Url:fileurl,alldata:fetchData,success:true})

        res.json({Url:fileurl,success:true})

    }catch(e){
        console.log(e);
        res.status(500).json({err:e,success:false})

    }
    // console.log(req.user.__proto__)
   
}

exports.pagination=async(req,res)=>{
    try{
        const{page,pagesize}=req.query;
        const limits=+pagesize
        const data=  await expenses.find({"userId":req.user[0]._id}).skip((page-1)*pagesize).limit(limits)
        res.json({Data:data})

        // console.log(data)
        // res.json({Data:data})
    }catch(e){
        console.log("pagination error-->",e)
        res.json({Error:e})
    }
}

