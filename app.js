if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express");
const fs = require("fs");
const app = express();
const bcrypt = require("bcrypt")
const path = require("path");
const router = express.Router();
const qs = require('querystring');
const passport = require('passport');
const { request } = require("http");
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override') 
app.use(express.urlencoded({ extended: true })); 
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
    console.log("User successfully registered.")
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.use("/", router);
app.listen(process.env.port || 3000);

function BibleReader (){

  if(typeof verseposition === 'undefined'){
    fs.readFile("bibledatabase.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("Error reading file:", err);
        return;
      }
      try {
        const verseblock = JSON.parse(jsonString);
        //take a user provided chapter and verse number and then log it into the console 
        const userchapter = 0;
        global.verseposition = 0;
        global.currentverse = verseblock.chapters[userchapter].verses[verseposition].text
        // now i want to simply print out how many chapters there are and how many verses there are. 
        //find the nth position and then print out the number? like if there are 5 chapters, it should go to the last elemetn and then print the number? 
        global.booktitle = verseblock.book;
        global.chaptercount = Object.keys(verseblock.chapters).length; //this kind of works but it starts from the 0th 
        global.versecount = Object.keys(verseblock.chapters[0].verses).length; //this works but it starts from the 0th
      } catch (err) {
        console.log("Error parsing JSON string:", err);
      }
    });
  } else {
    fs.readFile("bibledatabase.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("Error reading file:", err);
        return;
      }
      try { //if verseposition is already defined (in the instance that the user selects it or previous verses have been done)
        const verseblock = JSON.parse(jsonString);
        //take a user provided chapter and verse number and then log it into the console 
        const userchapter = 0;
        console.log("Is automove turned on? " + automove);
        //writing an if/else statement for whether or not the user has "automove" turned on 
        if (automove === "yes"){ //the entire automove functionality is broken because i need to figure out how to do a counter 
          global.verseposition = verseposition;
          if (verseposition >= Object.keys(verseblock.chapters[0].verses).length){
          console.log("user has submitted a verse that doesn't exist, start from the beginning ");
          global.verseposition = 0;
          console.log(verseposition);
          currentverse = verseblock.chapters[userchapter].verses[verseposition].text
          // now i want to simply print out how many chapters there are and how many verses there are. 
          //find the nth position and then print out the number? like if there are 5 chapters, it should go to the last elemetn and then print the number? 
          global.booktitle = verseblock.book;
          global.chaptercount = Object.keys(verseblock.chapters).length; //this kind of works but it starts from the 0th 
          global.versecount = Object.keys(verseblock.chapters[0].verses).length; //this works but it starts from the 0th
          } else {
            console.log("user verse selection exists, continue on");
            console.log("automove is turned on, so we're going to the next verse");
            global.currentverse = verseblock.chapters[userchapter].verses[verseposition].text
            // now i want to simply print out how many chapters there are and how many verses there are. 
            //find the nth position and then print out the number? like if there are 5 chapters, it should go to the last elemetn and then print the number? 
            global.booktitle = verseblock.book;
            global.chaptercount = Object.keys(verseblock.chapters).length; //this kind of works but it starts from the 0th 
            global.versecount = Object.keys(verseblock.chapters[0].verses).length; //this works but it starts from the 0th
          }
        } else { //NON-AUTOMOVE SECTION 
          console.log("Automove is turned off, so we're showing the user selected verse ");
          global.currentverse = verseblock.chapters[userchapter].verses[verseposition].text
          // now i want to simply print out how many chapters there are and how many verses there are. 
          //find the nth position and then print out the number? like if there are 5 chapters, it should go to the last elemetn and then print the number? 
          global.booktitle = verseblock.book;
          global.chaptercount = Object.keys(verseblock.chapters).length; //this kind of works but it starts from the 0th 
          global.versecount = Object.keys(verseblock.chapters[0].verses).length; //this works but it starts from the 0th
        }
      } catch (err) {
        console.log("Error parsing JSON string:", err);
      }
    });
    }
}

BibleReader();

app.post('/', (req, res) =>{ 
  global.verseposition = req.body.verse1; //this grabs the right string info we want
  global.automove = req.body.automove; //this determines if the user wanted to automatically progress 
  console.log("verseposition received from the user is: " + verseposition);
  BibleReader();
  res.sendStatus(200); //tell the server we've got it
});



