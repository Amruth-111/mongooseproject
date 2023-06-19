const express=require('express')
const forgot=require('../controllers/forgot');

let route=express.Router();

route.use('/forgot_password',forgot.forgotpass);
route.get('/reset_password/:id',forgot.resetpass);
route.get('/update_password/:rid',forgot.updatepass)

module.exports=route;