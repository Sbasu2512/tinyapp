const express = require("express");
const router = express.Router() ;
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const { urlsForUser, generateRandomString, emailLooker } = require('../helper');
const bcrypt = require('bcrypt');
const saltRounds = 10;  

const homeRoutes = (users) => {
  //home page
  router.get("/", (req, res) => {
    let user = users[req.session.userid];
    const templateVars = {
      user: user,
    };
    if (user !== "undefined" && user) {
      return res.render("urls_new", templateVars);
    }
    res.redirect("/login");
  });
  // urlDatabase
  router.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });
  // shows the shortURL longURL pairs
  router.get("/urls", (req, res) => {
    const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
    let user = users[req.session.userid]; //we take the name not the value from res.cookie()
    const templateVars = {
      user: user,
      urls: ownedURLs,
    };
    if (user !== "undefined" && user) {
      return res.render("urls_index", templateVars);
    }
    res.send("Please Log in or Create a account");
  });
  return router;
}