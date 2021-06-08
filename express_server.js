const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.urlencoded({extended: true}));
//app.use(require('body-parser').json());
app.set("view engine", "ejs");
const PORT = 8080;
//short URL: long URL
const urlDatabase = {
  "b2xVn2":"http://www.lighthouselabs.ca",
  "9sm5xK":"http://www/google.ca"
};

const users = { 

};

app.get("/", (request, response)=>{
  response.send("hello");
});

app.listen(PORT, ()=>{
console.log("App is listening on port: ",PORT)
});

app.get("/urls.JSON", (req, res)=>{
  res.json(urlDatabase);
});

app.get("/urls", (req,res)=>{
const templateVars = {urls: urlDatabase};
res.render("urls_index", templateVars); //file name in views, the data to show on the webpage
});

//Update your express server so that the shortURL-longURL key-value pair are saved to the urlDatabase when it receives a POST request to /urls
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  // console.log(req.body);  // Log the POST request body to the console
  urlDatabase[shortURL] = req.body.longURL;    
  res.redirect(`/urls/${shortURL}`);       
});

app.get("/urls/new", (req, res)=>{
  //console.log("Testing here.")
  res.render("urls_new");
});
//req.params => u can access the variables within your routes.
app.get("/urls/:shortURL", (req,res)=>{
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

function generateRandomString() {
return Math.random().toString(36).substring(7);
}
//registration
app.get("/register", (req, res)=>{
res.render("registration");
});

app.post("/register", (req, res)=>{

});