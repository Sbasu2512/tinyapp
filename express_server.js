const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
//Create a global object called users which will be used to store and access the users in the app.
const users = {};

//emailLooker function to check if email exist in users database
let emailLooker = (email) =>{
  for(let user in users){
    if(user.email === email){
      return true;
    }
  }
  return false;
};

// simulate generating unique shortURL - 6 random alphanumeric characters
const generateRandomString = function () {
  return Math.random().toString(36).substring(2, 8);
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
  //console.log("cookies: ", req.cookies.userid);
  //can not play with it right after writing cookies
  //user is one deep into user object. it now stores the random string generated and stored into the cookies.
  let user = users[req.cookies.userid]; //we take the name not the value from res.cookie()
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username,
    user: user,
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

// for creating new shortURLs
app.get("/urls/new", (req, res) => {
  let user = users[req.cookies.userid];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username,
    user: user,
  };

  res.render("urls_new", templateVars);
});

// creates the shortURL and redirects to show user their newly created link
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// shows user their shortURL
app.get("/urls/:shortURL", (req, res) => {
  let user = users[req.cookies.userid];
  console.log("line 82: user is ",user);
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userid: req.cookies.userid,
    user: user,
  };
  res.render("urls_show", templateVars);
});

// updates URL - longURL edited for specified shortURL
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

// uses shortURL to redirect to longURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// remove shortURL then redirect back to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
//get the login page to let user login
app.get("/login", (req, res)=>{
  res.render("login",{});
});

// allows user to login with a username - redirects to /urls
app.post("/login", (req, res) => {
  // accept user information
  //console.log(req.body);
  const userLogin = req.body ;
  //console.log("User email to login was: ",userLogin.email);
  //console.log("users is: ",users);
  // check if username exists
  let user ;  
  for(let userid in users){
    if(users[userid].email === userLogin.email){
       user = users[userid]   //userid = random string
      break;
    } 
  }
  //const user = users[userLogin.email] //checking for the email key of the user obj
  //console.log("user is: ",user);
  // if user exists
  if (user) {
    // if password matches
    if (user.password === userLogin.password) {
       //this log will appear in the server terminal, NOT on the browser
      console.log("passwords match!")
      // set cookie with name = "userid" and value = users name (lowercase)
      res.cookie("userid", userLogin.userid)
      // redirect to homepage
      // early return to stop the function
      return res.redirect("/urls")
    }
  } 
  res.status(403).send("credentials do not match");  
});

// allows users to logout
app.post("/logout", (req, res) => {
  res.clearCookie("userid");
  //console.log("cookie cleared");
  res.redirect("/login");
  //console.log("logged out");
});

//which returns the template regitration.ejs
app.get("/register", (req, res) => {
  //we are getting the userid cookie. name should be same all over
  let user = users[req.cookies.userid];
  //console.log("req.cookies.userid line 159 :", req.cookies.userid);
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userid: req.cookies.userid,
    user: user, //user = users[req.cookies.userid]
  };
  //resgitration == view, templateVars == local object for this specific view
  res.render("registration", templateVars); //res.render(view [, locals] [, callback])
});

//Registering New Users
app.post("/register", (req, res) => {
  const errorMsg = "User email exists";
  const userId = generateRandomString();
  const newUser = {
    id: userId, //create a new object so we do not have to go....
    email: req.body.email, //....two levels deep of the get go.
    password: req.body.password,
  };
  //console.log("user obj has now", users); //update users everytime :)
  if (!emailLooker(req.body.email)) {  //if emailLooker is false that means email does not exist
    if(req.body.email && req.body.password) {
    users[userId] = newUser;
    res.cookie("userid", userId); //set a cookie with name(key), value
    return res.redirect("/urls"); //redirect
    } else {
      //res.send(errorMsg);
    res.redirect('/register');
    }
  } else {    //if emailLooker is true send a message saying useremail exists!
    res.send(errorMsg);
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
  console.log("Request Made!") ;
});
