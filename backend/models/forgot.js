// let Sequelize=require('sequelize');
// let sequelize=require('../util/database');

// let forgot=sequelize.define("forgot",{
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
//     expiresby: Sequelize.DATE
// })

// module.exports = forgot;

const mongoose=require("mongoose");
const uuid=require("uuid")

const Schema=mongoose.Schema;

const forgotPasswordSchema=new Schema({
    _id: { type: String, default: function genUUID() {
        uuid.v1()
    }},
    isactive:{
        type:Boolean
    },
    userId:{
        type:Schema.Types.ObjectId
    }
}) 
module.exports=mongoose.model("Forgot",forgotPasswordSchema)