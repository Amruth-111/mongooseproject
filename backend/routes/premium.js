const express=require('express')
const premium=require('../controllers/premium_features.js');


let route=express.Router();
const user_authenticate=require('../middleware/auth')

route.get('/show-leaderboard',user_authenticate.authentication,premium.premium_features)

module.exports=route;