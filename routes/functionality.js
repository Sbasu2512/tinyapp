//package imports
const express = require("express");
const router = express.Router();
//local imports
const { urlsForUser} = require("../helper");

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
// uses shortURL to redirect to longURL. non logged in users should be able to use it
router.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  if (longURL.includes('http')) {
    return res.redirect(longURL);
  } else {
    return res.redirect(`https://${longURL}`);
  }
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