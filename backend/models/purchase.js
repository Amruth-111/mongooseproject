// let Sequelize=require('sequelize');
// let sequelize=require('../util/database');

// let premium=sequelize.define('order',{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         primaryKey:true,
//         autoIncrement:true
//     },
//     paymentid:Sequelize.STRING,
//     orderid:Sequelize.STRING,
//     status:Sequelize.STRING
// })

// module.exports=premium

const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const orderSchema=new Schema({
    paymentId:{
        type:String
    },
    orderId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})
module.exports=mongoose.model("Order",orderSchema)