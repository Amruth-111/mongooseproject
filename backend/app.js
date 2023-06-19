const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');
const Razorpay=require('razorpay');
const path=require('path')
const morgan=require("morgan")
const mongoose=require("mongoose")
const sequelize=require('./util/database');
const usertable=require('./models/users');
const exptable=require('./models/expenses')
const users=require('./routes/user');
const expenses=require('./routes/expenses');
const purchase=require('./routes/purchase');
const premium=require('./routes/premium')
const premiumtable=require('./models/purchase');
const forgotpass=require('./routes/forgotpass')
const forgotpassword=require('./models/forgot')
const download=require('./models/downloaddb')


// const helmet=require('helmet')
// const compression=require('compression')
// const morgan=require('morgan');
const fs=require('fs')

require('dotenv').config();
const app=express();
// const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

app.use(cors());


app.use(bodyparser.json());
// app.use(helmet());
// app.use(compression());
// app.use(morgan('combined',{stream:accessLogStream}));


// usertable.hasMany(exptable);
// exptable.belongsTo(usertable);  

// usertable.hasMany(premiumtable);
// premiumtable.belongsTo(usertable);

// usertable.hasMany(forgotpassword);
// forgotpassword.belongsTo(usertable);

// usertable.hasMany(download);
// download.belongsTo(usertable);


app.use('/user',users)
app.use('/expense',expenses)
app.use('/purchase',purchase)
app.use('/premium',premium)
app.use('/password',forgotpass)


app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`views/${req.url}`))
    console.log(req.url)
})



mongoose.connect("mongodb+srv://user:aitP3amwerOYvmfa@cluster0.mye1knp.mongodb.net/expenseTracker?retryWrites=true&w=majority")
.then(()=>{
    app.listen(8081)
})
.catch((err)=>console.log("sync err-->",err))


// sequelize.sync().then(()=>{
//     app.listen(8081)
// }).catch(e=>{
//     console.log(e)
// })