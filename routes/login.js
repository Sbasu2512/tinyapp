const express = require("express");
const router = express.Router ;
/**************************************/
/********* Regitering The User *******/
/************************************/
//which returns the template regitration.ejs
router.get("/register", (req, res) => {
  let user = users[req.session.userid];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    userid: req.session.userid,
    user: user, 
  };
  res.render("registration", templateVars); 
});
//Registering New Users
router.post("/register", (req, res) => {
  const errorMsg = "User email exists, please login";
  const userId = generateRandomString();
  const newUser = {
    id: userId, 
    email: req.body.email, 
    password: bcrypt.hashSync(req.body.password, saltRounds),
  };
  let user;
  userLogin = req.body;
  for (let id in users) {
    if (users[id].email === userLogin.email) {
      user = users[id]; 
      break;
    }
  }
  if (user) {
    if (user.email === userLogin.email) {
      // redirect to homepage & early return to stop the function
      return res.status(403).send(errorMsg);
    }
  }
  users[userId] = newUser;
  req.session['userid'] = userId
  res.redirect("/urls");
});
router.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});