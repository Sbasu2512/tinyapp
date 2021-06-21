const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const { urlsForUser, generateRandomString, emailLooker } = require("../helper");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const func = (users, urlDatabase) => {
// for creating new shortURLs
router.get("/urls/new", (req, res) => {
  let user = users[req.session.userid];
  const templateVars = {
    user: user,
  };
  if(user !== 'undefined' && user){
    res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});
// shows user their shortURL
router.get("/urls/:shortURL", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
  let shortURL = req.params.shortURL;
  let user = users[req.session.userid];
  //if user logged in or not check
  if (!user) {
    return res.send("Please Login/Register");
  }
  //checking if the user owns the url or not
  if (!ownedURLs[shortURL]) {
    return res.send("URL does not exist");
    };
    //checking if the short url is owned by the user 
  if(urlDatabase[shortURL].userID !== req.session.userid){
    return res.send("User does not own this URL");
  }
  
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
router.post("/urls/:shortURL/update", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
  let user = users[req.session.userid]; 
  shortURL = req.params.shortURL;
  if (!user) {
    return res.send("Please Login/Register");
  }
  if (!ownedURLs[shortURL]) {
    return res.send("URL does not exsist");
    };
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.userid
    };
  res.redirect(`/urls/${req.params.shortURL}`);

});
// uses shortURL to redirect to longURL
router.get("/u/:shortURL", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
  let user = users[req.session.userid];
  let shortURL = req.params.shortURL;
  //checking if user is logged in or not
  if (!user) {
   return res.redirect('./login');
  }
  //checking if url for a shortURL exists or not and belongs to the user logged in!
  if (!ownedURLs[shortURL]) {
    return res.send("URL does not exsist");
    };
    let longURL = ownedURLs[req.params.shortURL].longURL ;
    urlDatabase[shortURL] = {
      longURL,
      userID: req.session.userid
    };  
    res.redirect(`${ownedURLs[req.params.shortURL].longURL}`);
});
// remove shortURL then redirect back to /urls
router.post("/urls/:shortURL/delete", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
  let user = users[req.session.userid]; //user id
  let shortURL = req.params.shortURL;
  if (!user) {
    return res.send("Please Login/Register");
  }
  if (!ownedURLs[shortURL]) {
    return res.send("URL does not exsist");
  }
  if (user.id === ownedURLs[shortURL].userID) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});

return router;
}
module.exports = func;