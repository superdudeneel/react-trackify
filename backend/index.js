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
const multer = require('multer');
const Tesseract = require('tesseract.js');

//.env files
const dotenv = require('dotenv');
dotenv.config();

//storage for receipt upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

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
const Income = require('./models/incomeschema.js')
const Receipt = require('./models/receiptschema.js')

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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

app.post('/api/addincome', async (req, res)=>{
    const {name, date, income, place, note, category} = req.body;
    const user = await User.findById(req.session.user.id);
    await Income.create({
        userID: user._id,
        name: name,
        date: date,
        income: income,
        place: place,
        note: note,
        category: category,
    })
    return res.json({success: true, message: 'Income saved successfully'});
})

app.get('/api/expenses', async (req, res)=>{
    const expenses = await Expense.find({userID: req.session.user.id});
    return res.json({success: true, expenses: expenses});

})

app.get('/api/incomes', async (req, res)=>{
    const incomes = await Income.find({userID: req.session.user.id});
    return res.json({success: true, incomes: incomes});

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

app.post('/api/uploadreceipt', upload.single('receipt'), async (req , res)=>{
    const { date} = req.body;
    const user = await User.findById(req.session.user.id);

    if(!req.file || !date){
        return res.json({success: false, message: 'Error uploading the reciept'});

    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const localPath = req.file.path;
    await Receipt.create({
        userID: user._id,
        url: imageUrl,
        date:date,
    })
    const { data: { text } } = await Tesseract.recognize(localPath, 'eng', {
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,:-/₹$RsINR',
        preserve_interword_spaces: 1,
    });

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // Extract merchant name (first line)
    const name = lines.length > 0 ? lines[0] : 'Unknown Merchant';

    // Extract amount
    const amountRegex = /(?:₹|Rs\.?|INR|\$)\s?([\d,]+(?:\.\d{1,2})?)/gi;
    const matches = [...text.matchAll(amountRegex)];

    let amount = null;
    if (matches.length > 0) {
    const values = matches.map(m => parseFloat(m[1].replace(/,/g, '')));
    amount = Math.max(...values); // likely to be the total amount
    } 

    if (amount === null) {
    // Try to extract amount from "Total" line if available
    const totalLine = lines.find(line => /total/i.test(line));
    if (totalLine) {
        const totalMatch = totalLine.match(/([\d,]+(?:\.\d{1,2})?)/);
        if (totalMatch) {
            amount = parseFloat(totalMatch[1].replace(/,/g, ''));
        }
    }

    // As a last fallback, use the largest number but exclude big values (like pincodes)
    if (amount === null) {
        const fallbackRegex = /\b([\d,]+(?:\.\d{1,2})?)\b/g;
        const fallbackMatches = [...text.matchAll(fallbackRegex)];
        if (fallbackMatches.length > 0) {
            const values = fallbackMatches
                .map(m => parseFloat(m[1].replace(/,/g, '')))
                .filter(v => v > 1 && v < 100000); // Filter unrealistic values like pincodes
            if (values.length > 0) {
                amount = Math.max(...values);
            }
        }
    }
}




    // Extract date (dd-mm-yyyy or dd/mm/yyyy)
    const dateRegex = /\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b/;
    const dateMatch = text.match(dateRegex);
    const date1= dateMatch ? dateMatch[0] : 'Unknown Date';
    const parts = date1.split("/"); // ['27', '06', '2025']
    const formatted = `${parts[0]}-${parts[1]}-${parts[2]}`;

    let category = 'Other';
    if (/zomato|swiggy|pizza|restaurant|coffee|starbucks/i.test(text)) category = 'Food';
    else if (/uber|ola|auto|taxi|petrol/i.test(text)) category = 'Transport';
    else if (/electricity|gas|water|bill/i.test(text)) category = 'Utilities';
    else if (/movie|netflix|bookmyshow/i.test(text)) category = 'Entertainment';
    await Expense.create({
        userID: user._id,
        name: name,
        expense: amount,
        date: formatted,
        place: name,
        note: text,
        category: category,
    })
    return res.json({success: true, message: 'Uploaded with success'});
    
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
