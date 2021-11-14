const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const router = express.Router();
const qs = require('querystring');
app.use(express.urlencoded({ extended: true }));
// this is all new stuff could delete
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'))
//end of experimental code 
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

router.get("/", (req, res) => {
  res.render("index", {user: "Rob"})
});

router.get("/about", (req, res) => {
  res.render("about", { title: "Hey", message: "Hello there!" });
});

app.use("/", router);
app.listen(process.env.port || 3000);
//this is the POST request from the client if someone selects a new verse



console.log("Running at Port 3000");

//commenting this out because I dont think I need it anymore
/*
fs.readFile("test.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("Error reading file:", err);
    return;
  }
  try {
    const cardinfo = JSON.parse(jsonString);
    console.log("Random sentence:", cardinfo.Scripture); 
    //I know now that we can pass the cardinfo.scripture value on 
    //i assume it can be done dynamincally through rendering but right now
    //it's melting my brain to actually figure that out 
    global.scriptureverse = cardinfo.Scripture
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
});
*/ 
//EXPERIMENTAL JSON READING GOING ON BELOW VERY SCARY 
//now we're going to try to replicate the function above but with user input
//it should read through the json arrray and match it up with the appropriate verse
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
        const verseposition = 0;
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
      try {
        const verseblock = JSON.parse(jsonString);
        //take a user provided chapter and verse number and then log it into the console 
        const userchapter = 0;
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
    }
}

BibleReader();

app.post('/', (req, res) =>{ 
  global.verseposition = req.body.verse1; //this grabs the right string info we want
  console.log(verseposition);
  BibleReader();
  res.sendStatus(200); //tell the server we've got it
});



