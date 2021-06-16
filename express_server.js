const express = require("express");
const loginRoutes = require("./routes/login");
const homeRoutes = require("./routes/home");
const func = require("./routes/functionality");
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
app.use('/',loginRoutes(users, urlDatabase));
// homepage (root)
app.use('/', homeRoutes(users, urlDatabase));
//activating func
app.use('/', func(users, urlDatabase));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
