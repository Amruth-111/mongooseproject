const mongoose=require("mongoose")
const Schema=mongoose.Schema;

const singupSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    premium:{
        type:Boolean
    },
    totalExpenses:{
        type:Number,
        default:0
    }   
})

module.exports=mongoose.model("User",singupSchema)


// let Sequelize=require('sequelize');
// let sequelize=require('../util/database');

// let user=sequelize.define("users",{
//     id:{
//         type:Sequelize.INTEGER,
//         allowNull:false,
//         primaryKey:true,
//         autoIncrement:true
//     },
//     name:{
//         type:Sequelize.STRING,
//         allowNull:false,
//     },
//     email:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         unique:true
//     },
//     password:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         unique:true
//     },
//     ispremium:{
//         type:Sequelize.BOOLEAN
//     },
//     totalExpenses:{
//         type:Sequelize.INTEGER,
//         defaultValue:0
//     }

// })


// module.exports=user;



