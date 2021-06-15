const express = require("express");
const loginRoutes = require("./routes/login")
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;  
const cookieSession = require('cookie-session');
const { urlsForUser, generateRandomString } = require('./helper');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2']
}))
//user Database
const users = {
  admin: {
    id: "admin",
    email: "admin",
    password: bcrypt.hashSync("admin", saltRounds),
  },
};
//URL database
const urlDatabase = {};
//Create a global object called users which will be used to store and access the users in the app.
app.use('/',loginRoutes(users));
// homepage (root)
app.get("/", (req, res) => {
  let user = users[req.session.userid];
  const templateVars = {
    user: user,
  };
  if(user !== 'undefined' && user){
   return res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});
// urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// shows the shortURL longURL pairs
app.get("/urls", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid,urlDatabase);
  let user = users[req.session.userid]; //we take the name not the value from res.cookie()
  const templateVars = {
    user: user,
    urls: ownedURLs
  };
  if(user !== 'undefined' && user){
    return res.render("urls_index", templateVars);
  }
  res.send("Please Log in or Create a account");
});
// for creating new shortURLs
app.get("/urls/new", (req, res) => {
  let user = users[req.session.userid];
  const templateVars = {
    user: user,
  };
  if(user !== 'undefined' && user){
    res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});
// creates the shortURL and redirects to show user their newly created link
app.post("/urls", (req, res) => {
  let user = users[req.session.userid];
  const shortURL = generateRandomString();
  const userid = req.session.userid;
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: userid,
  };
  if (user !== "undefined" && user) {
    return res.redirect(`/urls/${shortURL}`);
  }
  res.send("Please login/register");
});
// shows user their shortURL
app.get("/urls/:shortURL", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
  let shortURL = req.params.shortURL;
  let user = users[req.session.userid];
  if (!user) {
    return res.send("Please Login/Register");
  }
  if (!ownedURLs[shortURL]) {
    return res.send("URL does not exsist");
    };
    let longURL = ownedURLs[req.params.shortURL].longURL;
    const templateVars = {
      shortURL,
      longURL,
      userid: req.session.userid,
      user,
    }
    return res.render("urls_show", templateVars);
});
// updates URL - longURL edited for specified shortURL
app.post("/urls/:shortURL/update", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
  let user = users[req.session.userid]; //user id undefined
  if(user.id === ownedURLs[req.params.shortURL].userID){  /*  */
  urlDatabase[req.params.shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userid
  };
} 
  res.redirect(`/urls/${req.params.shortURL}`);

});
// uses shortURL to redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
  let user = users[req.session.userid];
  if (user) {
    if (user.id !== ownedURLs[req.params.shortURL].userID) {
      const longURL = urlDatabase[req.params.shortURL].longURL;
      return res.send("URL do not belong to you!");
    }
    return res.redirect(longURL);
  }
  return res.send("Please login/register");
});
// remove shortURL then redirect back to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid, urlDatabase)
  let user = users[req.session.userid]; //user id 
  if(user.id === ownedURLs[req.params.shortURL].userID){
  delete urlDatabase[req.params.shortURL];
}
  res.redirect("/urls");
});

app.get("/user", (req, res)=>{
  if(user && userLogin.email === "admin" &&  bcrypt.compareSync("admin", userLogin.password)){
 return res.render("user",{users});
}
return res.redirect("/login")
})



app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});



/***

console.log('OwnedURL is :',ownedURLs); // shows the ownedURL object
console.log('user logged in is: ', req.session.userid);//returns current user that is logged in
console.log('shortURL', req.params.shortURL) //returns shortURL keys assigned to it  

if(req.params.shortURL === ownedURLs[req.params.shortURL]){
  console.log("Inside the first if statement i.e., shortURL found")
  if(user && req.session.userid === ownedURLs[req.params.shortURL].userID){
    console.log("Inside the second if statement")
    templateVars.longURL =  urlDatabase[req.params.shortURL].longURL;
      templateVars.shortURL = req.params.shortURL;
      res.render('urls_show', templateVars);
  } else {
    res.render('urls_show', templateVars);
  }
  res.send("URL does not belong to user");
} 

*/