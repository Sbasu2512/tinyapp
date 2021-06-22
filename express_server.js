//package imports
const express = require("express");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
//local imports
const loginRoutes = require("./routes/login");
const homeRoutes = require("./routes/home");
const func = require("./routes/functionality");
const { urlDatabase, users } = require("./routes/database");
//constants
const PORT = process.env.PORT || 8080; // default port 8080
//Middlewares
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

//activating my login routes
app.use("/", loginRoutes(users, urlDatabase));
// homepage (root)
app.use("/", homeRoutes(users, urlDatabase));
//activating func
app.use("/", func(users, urlDatabase));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
