// let Sequelize=require('sequelize');
// let sequelize=require('../util/database');

// let expenses=sequelize.define("expenses",{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         primaryKey:true,
//         autoIncrement:true
//     },
//     amount:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//     },
//     description:{
//         type:Sequelize.STRING,
//         allowNull:false,
//     },
//     category:{
//         type:Sequelize.STRING,
//         allowNull:false,
//     }

// })

// module.exports=expenses;

const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const expenseSchema=new Schema({
    amount:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})
module.exports=mongoose.model("Expense",expenseSchema)

