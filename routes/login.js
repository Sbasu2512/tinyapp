const express = require("express");
const router = express.Router() ;
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const { urlsForUser, generateRandomString } = require('../helper');
const bcrypt = require('bcrypt');
const saltRounds = 10;  

const loginRoutes = (users) => {
/**************************************/
/********* Regitering The User *******/
/************************************/
//which returns the template regitration.ejs
router.get("/register", (req, res) => {
  let user = users[req.session.userid];
  const templateVars = {
    userid: req.session.userid,
    user: user, 
  };
  res.render("registration", templateVars); 
});
//Registering New Users
router.post("/register", (req, res) => {
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
  req.session['userid'] = userId
  res.redirect("/urls");
});
/*********************************/
/***********Login****************/
/*******************************/
//get the login page to let user login
router.get("/login", (req, res) => {
  res.render("login", {});
});
// allows user to login with a username - redirects to /urls
router.post("/login", (req, res) => {
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
      // console.log('users object has: inside if statemtn 177',users[id]);
      user = users[id]; //id = random string
      
      break;
    }
  }
  // if user exists & password matches
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
router.post("/logout", (req, res) => {
  req.session['userid'] = null ;
  res.redirect("/login");
});

 return router; 
}

module.exports = loginRoutes;