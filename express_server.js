const express = require("express");
const loginRoutes = require("./routes/login");
const homeRoutes = require("./routes/home");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;  
const cookieSession = require('cookie-session');
const { urlsForUser, generateRandomString, emailLooker } = require('./helper');
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1','key2']
}))
//Create a global object called users which will be used to store and access the users in the app.
const users = {
  admin: {
    id: "admin",
    email: "admin",
    password: bcrypt.hashSync("admin", saltRounds),
  },
};
//URL database
const urlDatabase = {};
//activating my login routes
app.use('/',loginRoutes(users));
// homepage (root)
app.use('/', homeRoutes(users, urlDatabase));
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
app.get("/u/:shortURL", (req, res) => {
  const ownedURLs = urlsForUser(req.session.userid, urlDatabase);
  let user = users[req.session.userid];
  if (!user) {
   return res.redirect('./login');
  }
  return res.send("Please login/register");
});
// remove shortURL then redirect back to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
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

app.get("/user", (req, res)=>{
  if(user && userLogin.email === "admin" &&  bcrypt.compareSync("admin", userLogin.password)){
 return res.render("user",{users});
}
return res.redirect("/login")
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
