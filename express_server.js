const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(require('body-parser').json());
app.set("view engine", "ejs");
const PORT = 8080;
//short URL: long URL
const urlDatabase = {
  "b2xVn2":"http://www.lighthouselabs.ca",
  "9sm5xK":"http://www/google.ca"
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

app.post("/urls", (req, res) => {
  const randomString = generateRandomString();
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase.randomString = req.body;  
  res.send("Being redirected");  
  res.redirect(`/urls/:${randomString}`)       
  
});

app.get(`/urls/:shortURL`, (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render(`urls_show`, templateVars);
});

app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("urls/new", (req, res)=>{
  res.render("urls_new");
  });

app.get("/urls/:shortURL", (req,res)=>{
const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }
res.render("urls_show", templateVars);
});

function generateRandomString() {
return Math.random().toString(36).substring(7);
}