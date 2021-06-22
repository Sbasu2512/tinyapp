//package import
const express = require("express");
//middleware
const router = express.Router();
//local imports
const { urlsForUser, generateRandomString } = require("../helper");

const homeRoutes = (users, urlDatabase) => {
  //home page
  router.get("/", (req, res) => {
    const user = users[req.session.userid];
    //checking if user has logged in or not
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
    const user = users[req.session.userid]; 
    
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
    const user = users[req.session.userid];
    const shortURL = generateRandomString();
    const userid = req.session.userid;
   //saving short url in urlDatabase
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: userid,
    };
    
    if (user !== "undefined" && user) {
      return res.redirect(`/urls/${shortURL}`);
    }
    res.send("Please login/register");
  });
  //adding an test case where it gives error if url does not exist
  app.get('*', (req, res) => {
    const templateVars = {
      error: '404 not found!'
    };
    res.render('404', templateVars);
  });
  return router;
};
module.exports = homeRoutes ;