const bodyparser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const env = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

// creadentials pakcages imported
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const { UserSchema, postSchema } = require("./schemas/posts");
const hashGenerator = require("./security/hashGenerator");
const mailSender = require("./security/sendMail");
const { prevHash, updateHash, postAdd } = require("./mongoose/hash");
// const LocalStrategy = require('passport-local').Strategy;
// verififcation system
// authentication details
const accountSid = "ACdba14084c725044bb3edce0b3d62ff4f";
const authToken = "f82868b33c43e0a16c70e59906aa57e8";
const verifySid = "VAd0d2249f115f2dd4c39354329c78c232";
const client = require("twilio")(accountSid, authToken);

const app = express();
app.use(
  express.urlencoded({ extended: true })
);
  
  app.use(express.json());//we can assign the limits
  app.use(bodyparser.urlencoded({extended:true}));

  // set up the cors for the ss events
  app.use(cors(
    {
    origin:['http://localhost:3000'],
    methods:['GET', 'POST','PUT','DELETE'],
    credentials:true
  }
));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

// Making Creadentials
  app.use(session({
    secret:process.env.SECRETKEY,
    resave:false,
    saveUninitialized:false
  }))
  app.use(passport.initialize());
  app.use(passport.session());
  
  var pass = process.env.PASS_DB;

  // const mongoose = require('mongoose');

  const connectionString = 'mongodb://127.0.0.1:27017/manoop';
  
  pass ='mongodb+srv://Siddh1418:vfpYtzGxw8hSdjmG@chatbot.4zqxkh3.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  // mongoose.connect(connectionString);
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console,'connection error:'));
  db.once('open', function() {
  console.log('Connected to MongoDB');
  });
  
  UserSchema.plugin(passportLocalMongoose);

  const User = mongoose.model('User', UserSchema);
  const Post = mongoose.model('Post', postSchema);

  passport.use(User.createStrategy());

// PASSPORT SERIALIZATION
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());


app.post('/login', function(req,res){
  const user = new User({
      username: req.body.userId,
      password: req.body.password
  });
  passport.authenticate('local', function(err) {
    if (err) {
      // Handle authentication error
      console.error(err);
      res.status(401).send({ status: false, message: err.message });
    }
    else {
      // Authentication successful, log in the user and send response
      req.login(user, function(err) {
        if (err) {
          console.error(err);
          return res.status(400).send({ status: false, message: err.message });
        }
        res.send({ status: true, message: 'Successfully logged in' });
      });
    }
  })(req, res);
})

app.get('/logout', function(req, res){
  req.logout((err)=>{
    err ? 
    res.status(500).send({status:"Error",message:"logOut Failed"})
    :
    res.send({status:"Logged Out"});
  });
  // res.send({status:'logout'});
})

app.get('/checkAuth',function(req, res){
  if(req.isAuthenticated()){
      res.send({status:true,user:req.user});
      console.log('Autherized user');
  } else{
      res.send({status:false});
      console.log('Un-Autherized user');
  }
});


app.post('/register', async function (req, res) {
  const { userId, password,number,name,dob,gender,adhar,email } = req.body;
  console.log(req.body);
  try {
    // Server-side validation (optional)
    if (!userId || !password) {
      throw new Error('Missing required fields: username or password');
    }
    if (userId.length < 6 || password.length < 8) {
      throw new Error('Username and password must be at least 6 and 8 characters long, respectively');
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register user with Passport
    const user = await User.register({ username: userId,email:email,moNumber:number,name:name,dob:dob,gender:gender,adhar:adhar}, password);
    passport.authenticate('local', function(err) {
      if (err) {
        // Handle authentication error
        console.error(err);
        res.status(401).send({ status: false, message: err.message });
      }
      else {
        // Authentication successful, log in the user and send response
        req.login(user, function(err) {
          if (err) {
            console.error(err);
            return res.status(400).send({ status: false, message: err.message });
          }
          res.send({ status: true, message: 'Successfully logged in' });
        });
      }
    })(req, res);
  } 
  catch (error) {
    console.error(error);
    res.status(400).send({ status: false, message: error.message });
  }
});




// otp creation and sending process

app.post('/storeNo',(req, res) => {
  let number = "+91"+req.body.number;
  console.log(number);
    client.verify.v2
    .services(verifySid)
    .verifications.create({ to: number, channel: "sms" })
    .then((verification) => console.log(verification.status))
    res.send({status: true});
})

// Verification of the number
app.post('/verify',(req, res) => {
    let { number, otpCode } = req.body;
    number = "+91"+number;
    // console.log(otpCode.value);
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: number, code:otpCode.value })
      .then((verification_check) => {
        console.log('verificationCheck:', verification_check);
        res.send({ status: verification_check.status });
      })
      .catch((err) => {
        console.error('err:', err);
        res.status(500).send('Something went wrong.');
      });
  });
  

  const AdharSchema = new mongoose.Schema({
    AdharNo:String,
    name:String,
    mobileNo:String
  })
  
  const Adhar = new mongoose.model("Adhar",AdharSchema);
  //  Verification of the Adhar Number number
  app.post('/verifyAdhar',(req, res) => {
    // Define the model
    console.log(req.body);
    Adhar.findOne({
      $and: [
        { AdharNo: req.body.adhar
          // req.body.adhar 
        },
        { mobileNo: req.body.number
          // req.body.number 
        }
      ]
    })
      .exec()
      .then(user => {
        console.log("Executed Query:", user);
        if (user) {
          console.log("User found:", user);
          res.send({status: true});
        } else {
          console.log("User not found");
        }
      })
      .catch(err => {
        console.error("Error during findOne:", err);
      });
    })



// hashgenerator
app.post('/genHash', (req, res) => {
  console.log("---------------------at gethash --------------------");
  if(req.isAuthenticated()){
    let {_id,email,name,dob,username,gender} = req.user;
    const currentDate = new Date();
    const dateString = currentDate.toString();
    if(req.body.goal == 'verify'){
      console.log("----------------------fetch the hash----------------");
      prevHash(User,_id.toString())
      .then(key=>{
        console.log("lasthash is : "+key.hash);
        if(key.status){
          mailSender(email,key.hash)
          res.send({status:true});
        } else{
            let hash = hashGenerator(email+name+username+gender+dob+dateString);
            updateHash(User,_id.toString(),hash) && res.send({status: true});
            res.send({status:true});
        }
      })
      .catch(err=>{console.log(err);});
    } else{
      console.log("----------------------Upgrade the hash----------------");
      let hash = hashGenerator(req.body.post+dateString);
      updateHash(User,_id.toString(),hash) && res.send({status: true});
      // Save the post
      // creating the content for the post
      let data = {
        text:req.body.post,
        likes:0,
        commentOn: new Date(),
        comment:[]
      }
      postAdd(Post,_id,data);
      // .catch(err => {console.error("Error saving post : "+err)});
      res.send({status: true});
    }
  }
})



app.post('/VerifyHash',(req,res)=>{
  console.log("----------------------verify hash --------------------");
  req.isAuthenticated() && console.log(req.user);
  req.isAuthenticated() ?
  req.body.hash == req.user.keyhash ? res.send({status: true}) : res.send({status: false})
  :
  console.log("Unautherized user");
})


app.get('/postData',(req,res)=>{
  // res.send(process.env.SECRETKEY);
    console.log("--------------------------at posts route------------------------");
    // res.send({status:req.user,posts:""});
    Post.find({ user: req.user._id })
    .exec()
    .then(posts => {
      console.log('User posts retrieved successfully:', posts);
      res.send({ posts: posts,user:req.user, status: true });
    })
    .catch(error => {
      console.error('Error retrieving user posts:', error);
      res.send({ posts: '', status: false });
    });
})


app.get('/', function(req, res) {
  console.log("------------------------Main Route------------------------");
  res.send({status: false});
})

app.listen(process.env.PORT || 500 , function() {
    console.log("Server started on port 500");
  
});