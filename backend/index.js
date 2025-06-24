const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const session = require('express-session');

const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/userschema.js');


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
