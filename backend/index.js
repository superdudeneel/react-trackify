const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const session = require('express-session');

//.env files
const dotenv = require('dotenv');
dotenv.config();

//nodemailer initialization
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

//models
const User = require('./models/userschema.js');
const Expense = require('./models/expenseschema.js')


const mongo_url = process.env.MONGO_URI;
mongoose
    .connect(mongo_url)
    .then(()=>{
        console.log('mongo db connected');
    })
    .catch((err)=>{
        console.log(err);
    })

const app = express();
const port = process.env.PORT;

//middlewares
app.use(cors({
    origin: process.env.FRONT_END_URI,
    credentials: true
}));
app.use(session({
  secret: 'secretkey',          // required - used to sign session ID cookie
  resave: false,                    // don't save session if unmodified
  saveUninitialized: false, 
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),        // don't create session until something stored
  cookie: { maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  } // 24 hour
}));    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//routes 
app.get('/', (req, res)=>{
    res.send('hello world');
})

app.post('/api/signup', async (req, res)=>{
    const {username, email, password} = req.body;
    const existinguser = await User.findOne({username: username});
    const existingemail = await User.findOne({email: email});

    if(!username||!email||!password){
        return res.json({success: false, message: 'All fields required'});

    }

    if(existinguser){
        return res.json({success: false, message: 'User already exists'});
    }
    if(existingemail){
        return res.json({success: false, message: 'Email already exists'})
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    await User.create({
        username: username,
        email: email,
        password: hashedpassword,
    })
    return res.json({success: true, message: 'Account created succesfully'});
})

app.post('/api/login', async(req, res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!email||!password){
        return res.json({success: false, message: 'Both fields required'});
    }
    if(!user){
        return res.json({success: false, message: 'User doesnt exist'});
    }
    const ispasswordvalid = await bcrypt.compare(password, user.password)
    if(!ispasswordvalid){
        return res.json({success: false, message: 'Passwords do not match'});
    }
    req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
    }
    res.cookie('username', user.username, {
        maxAge: 24*60*60*1000,
        httpOnly: true,
    })
    res.cookie('email', user.email, {
        maxAge: 24*60*60*1000,
        httpOnly: true,
    })

    return res.json({success: true, message: 'Logged In Successfuly'});
})

app.post('/api/addexpense', async (req, res)=>{
    const {name, date, expense, place, note, category} = req.body;
    const user = await User.findById(req.session.user.id);
    await Expense.create({
        userID: user._id,
        name:name,
        expense: expense,
        date: date,
        place: place,
        note: note,
        category: category,
    })
    return res.json({success: true, message: 'Expense Added'});

})

app.get('/api/expenses', async (req, res)=>{
    const expenses = await Expense.find({userID: req.session.user.id});
    return res.json({success: true, expenses: expenses});

})

app.put('/api/updateuser', async(req, res)=>{
    const {firstname, lastname, budget} = req.body;
    const user = await User.findById(req.session.user.id);
    user.firstname = firstname;
    user.lastname = lastname;
    user.budgetpermonth = budget;
    await user.save();
    return res.json({success:true, message: 'details updated'});

})

app.get('/api/populate', async(req, res)=>{
    const user = await User.findById(req.session.user.id);
    const User1 = {
        firstname: user.firstname,
        lastname: user.lastname,
        budget: user.budgetpermonth,
    }
    return res.json({success: true, User: User1});
})

app.get('/api/logout', (req, res)=>{
    req.session.destroy((err) => {
        if (err) {
            return res.json({success: false, message: 'Logout failed', user:req.session.user});
        }
        res.clearCookie('username');
        res.clearCookie('email');
        res.clearCookie('sessionid');
        return res.json({success: true, message: 'Logout successful', redirect: '/login'});
    });
})

app.post('/api/forgotpass', async (req, res)=>{
    const {email} = req.body;
    const user = await User.findOne({email:email});

    if(!email){
        return res.json({success: false, message: 'Email field required'});
    }
    if(!user){
        return res.json({success: false, message: 'USER NOT FOUND'});

    }

    const resettoken = crypto.randomBytes(32).toString('hex');
    user.resettoken = resettoken;
    user.resettokenexpiration = Date.now() + 3600000;
    await user.save();

    const resetLink  = `${process.env.FRONT_END_URI}/resetpass?token=${resettoken}`;


    const info = await transporter.sendMail({
      from: `"Neel from trackify" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset',
      html: `
        <h2>Password Reset Requested</h2>
        <p>Click the link below to reset your password. This link is valid for 1 hour.</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });
    return res.json({success: true, message: 'Email sent successfully'});
})

app.post('/api/updatepass', async (req, res)=>{
    const {password, confirmpassword} = req.body;
    const {token} = req.query;

    if(!token){
        return res.json({success: false, message: 'Token invalid or expired'});
    }
    const user = await User.findOne({
        resettoken: token,
        resettokenexpiration: { $gt: Date.now() }
    })
    if(!user){
        return res.json({success: false, message: 'Token invalid or expired'});
    }
    if(!password||!confirmpassword){
        return res.json({success: false, message: 'Both Fields are required'});

    }
    if(password!==confirmpassword){
        return res.json({success: false, message: 'Both fields dont match'});

    }
    const hashedpassword = await bcrypt.hash(password, 10);
    user.password = hashedpassword;
    user.resettoken = undefined;
    user.resettokenexpiration = undefined;
    await user.save();
    return res.json({success: true, message: 'Password updated successfully'});

})

app.get('/api/updatepass', async(req,res)=>{
    const {token} = req.query;
    if(!token){
        return res.json({success: false})

    }
    const user = await User.findOne({
        resettoken: token,
        resettokenexpiration: { $gt: Date.now() }
    })
    if(!user){
        return res.json({success: false, message: 'Token invalid or expired'});

    }
    return res.json({success: true});
})

app.get('/api/dashboard', async (req, res)=>{
    if(!req.session.user){
        return res.json({success: false, redirecturl: '/login'});

    }
    return res.json({success: true, user: req.session.user});

})




const myserver = http.createServer(app);
myserver.listen(port, ()=>{
    console.log('server has been started');

})
