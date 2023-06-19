const express=require('express')
const purchase=require('../controllers/purchase-premium');

let route=express.Router();
const user_authenticate=require('../middleware/auth')


route.get('/buy-premium',user_authenticate.authentication,purchase.buypremium);
route.post('/updatetransactionstatus',user_authenticate.authentication,purchase.updatetransactionstatus);

module.exports=route;