const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
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

app.get("urls/new", (req, res)=>{
res.render("urls_new");
});

app.get("/urls/:shortURL", (req,res)=>{
const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] }
res.render("urls_show", templateVars);
});
