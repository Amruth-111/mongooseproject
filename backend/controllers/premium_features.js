
let user=require('../models/users')
// let expense=require('../models/expenses');
const sequelize = require('../util/database');
const Expenses = require('../models/expenses');


exports.premium_features=async(req,res)=>{
    try{
        // let leaderboardofusers=await user.findAll({
        //     attributes:["name","totalExpenses"],
        //     order:[["totalExpenses","DESC"]]
        // });
        const leaderboardofusers=await user.find().select("name totalExpenses").sort({totalExpenses:-1})
        console.log(leaderboardofusers)
        res.json({leaderboardofusers})

    }catch(e){
        console.log(e)
        res.json("error in leaderboard secton")
    }
}