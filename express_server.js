const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
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
//URL database
const urlDatabase = {};
//Create a global object called users which will be used to store and access the users in the app.
const users = {
  admin: {
    id: "admin",
    email: "admin",
    password: bcrypt.hashSync("admin", saltRounds),
  },
};
// homepage (root)
app.get("/", (req, res) => {
  res.send("Hello!");
});
// urlDatabase
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// demonstrates can use HTML to display message
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
// shows the shortURL longURL pairs
app.get("/urls", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid,urlDatabase);
  let user = users[req.session.userid]; //we take the name not the value from res.cookie()
  const templateVars = {
    user: user,
    urls: ownedURLs
  };
  return res.render("urls_index", templateVars);
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
  const shortURL = generateRandomString();
  const userid = req.session.userid;
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: userid
  };
  res.redirect(`/urls/${shortURL}`);
});
// shows user their shortURL
app.get("/urls/:shortURL", (req, res) => {
  let user = users[req.session.userid];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    userid: req.session.userid,
    user: user,
  };
  res.render("urls_show", templateVars);
});
// updates URL - longURL edited for specified shortURL
app.post("/urls/:shortURL/update", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
  let user = users[req.session.userid]; //user id 
  if(user.id === ownedURLs[req.params.shortURL].userID){
  urlDatabase[req.params.shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userid
  };
} 
  res.redirect(`/urls/${req.params.shortURL}`);

});
// uses shortURL to redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
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
//get the login page to let user login
app.get("/login", (req, res) => {
  res.render("login", {});
});
app.get("/user", (req, res)=>{
  res.render("user",{users});
})
// allows user to login with a username - redirects to /urls
app.post("/login", (req, res) => {
  //check if login credentials belong to admin
  // accept user information
  const userLogin = req.body;
  let user;
  //admin login
  if (userLogin.email === "admin" &&  bcrypt.compareSync("admin", userLogin.password)) {
    user = users['admin'];
    const templateVars = {
      user: user,
      userid: user.userid,
      users: users
    };
    req.session['userid'] = 'admin' ;
    return res.render("user", templateVars);
  }
  // check if username exists
  for (let id in users) {
    if (users[id].email === userLogin.email) {
      console.log('users object has: inside if statemtn 177',users[id]);
      user = users[id]; //id = random string
      
      break;
    }
  }
  if (user && bcrypt.compareSync(userLogin.password, user.password)) {
      //this log will appear in the server terminal, NOT on the browser
      console.log(`someone logged in!`);
      // set cookie with name = "userid" and value = users name (lowercase)
      req.session["userid"] = user.id;
      // redirect to homepage
      // early return to stop the function
      return res.redirect("/urls");
    
  }
  res.status(403).send("credentials do not match");
});
// allows users to logout
app.post("/logout", (req, res) => {
  req.session['userid'] = null ;
  res.redirect("/login");
});
//which returns the template regitration.ejs
app.get("/register", (req, res) => {
  let user = users[req.session.userid];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userid: req.session.userid,
    user: user, //user = users[req.cookies.userid]
  };
  res.render("registration", templateVars); //res.render(view [, locals] [, callback])
});
//Registering New Users
app.post("/register", (req, res) => {
  const errorMsg = "User email exists, please login";
  const userId = generateRandomString();
  const newUser = {
    id: userId, 
    email: req.body.email, 
    password: bcrypt.hashSync(req.body.password, saltRounds),
  };
  let user;
  userLogin = req.body;
  for (let id in users) {
    if (users[id].email === userLogin.email) {
      user = users[id]; 
      break;
    }
  }
  if (user) {
    if (user.email === userLogin.email) {
      // redirect to homepage & early return to stop the function
      return res.status(403).send(errorMsg);
    }
  }
  users[userId] = newUser;
  // console.log(userId);
  //res.cookie("userid", userId); //set a cookie with name(key), value
  req.session['userid'] = userId
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
