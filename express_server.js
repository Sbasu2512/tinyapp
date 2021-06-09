const express = require('express');
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//Create a global object called users which will be used to store and access the users in the app.
const users = { 
  
};
// simulate generating unique shortURL - 6 random alphanumeric characters
const generateRandomString = function() {
  return Math.random().toString(36).substring(2, 8);
};
// homepage (root)
app.get('/', (req, res) => {
  res.send('Hello!');
});
// urlDatabase
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});
// demonstrates can use HTML to display message
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

// shows the shortURL longURL pairs
app.get('/urls', (req, res) => {
  console.log("cookies: ", req.cookies.userid); //can not play with it right after writing cookies
  //user is one deep into user object. it now stores the random string generated and stored into the cookies.
  user = users[req.cookies.userid]; //we take the name not the value from res.cookie()
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username,
    user: user,
    urls: urlDatabase                   
  }
  res.render('urls_index', templateVars);
});

// for creating new shortURLs
app.get('/urls/new', (req, res) => {
  user = users[req.cookies.userid]
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username,
    user: user
  }
  
  res.render('urls_new', templateVars);
});

// creates the shortURL and redirects to show user their newly created link
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

// shows user their shortURL
app.get('/urls/:shortURL', (req, res) => {
  user = users[req.cookies.userid]
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.username,
    user: user
  }
  res.render('urls_show', templateVars);
});

// updates URL - longURL edited for specified shortURL
app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls/${req.params.shortURL}`);
});

// uses shortURL to redirect to longURL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// remove shortURL then redirect back to /urls
app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

// allows user to login with a username - redirects to /urls
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
});

// allows users to logout
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});
//which returns the template regitration.ejs
app.get('/register', (req, res)=>{
  user = users[req.cookies.userid]  //we are getting the userid cookie. name should be same all over
  //console.log(user);
  const templateVars = { 
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies.userid,
    user: user
  }
  //resgitration == view, templateVars == local object for this specific view
res.render('registration', templateVars); //res.render(view [, locals] [, callback])
});

//Registering New Users
app.post("/register", (req, res)=>{
const userId = generateRandomString();
const newUser = {'id': userId,               //create a new object so we do not have to go....
                'email': req.body.email,    //....two levels deep of the get go.
                'password': req.body.password};
users[userId] = newUser ;
//console.log("user obj has now", users); //update users everytime :)
res.cookie('userid', userId);  //set a cookie with name(key), value
res.redirect('/urls');  //redirect 
}); 

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});