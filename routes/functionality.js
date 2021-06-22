//package imports
const express = require("express");
//middleware
const router = express.Router();
//local imports
const { urlsForUser } = require("../helper");

const func = (users, urlDatabase) => {
  // for creating new shortURLs
  router.get("/urls/new", (req, res) => {
    const user = users[req.session.userid];
    //template Vars to be passed to the page we are rendering
    const templateVars = {
      user: user,
    };
    //checking if user has logged in or not
    if (user !== "undefined" && user) {
      res.render("urls_new", templateVars);
    }
    res.redirect("/login");
  });
  // shows user their shortURL
  router.get("/urls/:shortURL", (req, res) => {
    const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
    const shortURL = req.params.shortURL;
    const user = users[req.session.userid];
    //if user logged in or not check
    if (!user) {
      return res.send("Please Login/Register");
    }
    //checking if the user owns the url or not
    if (!ownedURLs[shortURL]) {
      return res.send("URL does not exist");
    }
    const longURL = ownedURLs[req.params.shortURL].longURL;
    const templateVars = {
      shortURL,
      longURL,
      userid: req.session.userid,
      user,
    };
    return res.render("urls_show", templateVars);
  });
  // updates URL - longURL edited for specified shortURL
  router.post("/urls/:shortURL/update", (req, res) => {
    const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
    const user = users[req.session.userid];
    const shortURL = req.params.shortURL;
    //checking if user has logged in/not
    if (!user) {
      return res.send("Please Login/Register");
    }
    //checking if user owns the url or not
    if (!ownedURLs[shortURL]) {
      return res.send("URL does not exsist");
    }

    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.session.userid,
    };
    res.redirect(`/urls/${req.params.shortURL}`);
  });
  // uses shortURL to redirect to longURL. non logged in users should be able to use it
  router.get("/u/:shortURL", (req, res) => {
    const longURL = urlDatabase[req.params.shortURL].longURL;

    if (longURL.includes("http")) {
      return res.redirect(longURL);
    } else {
      return res.redirect(`https://${longURL}`);
    }
  });
  // remove shortURL then redirect back to /urls
  router.post("/urls/:shortURL/delete", (req, res) => {
    const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
    const user = users[req.session.userid]; 
    const shortURL = req.params.shortURL;
    
    if (!user) {
      return res.send("Please Login/Register");
    }

    if (!ownedURLs[shortURL]) {
      return res.send("URL does not exsist");
    }
    //double checking if the user owns the said url or not
    if (user.id === ownedURLs[shortURL].userID) {
      delete urlDatabase[shortURL];
    }
    res.redirect("/urls");
  });

  return router;
};
module.exports = func;