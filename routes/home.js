const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { urlsForUser, generateRandomString, emailLooker } = require("../helper");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const homeRoutes = (users, urlDatabase) => {
  //home page
  router.get("/", (req, res) => {
    let user = users[req.session.userid];
    const templateVars = {
      user: user,
    };
    if (user && user !== "undefined") {
      return res.redirect( "/urls");
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
  // creates the shortURL and redirects to show user their newly created link
  router.post("/urls", (req, res) => {
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
  return router;
};
module.exports = homeRoutes ;