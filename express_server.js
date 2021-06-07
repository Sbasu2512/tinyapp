const express = require('express');
const app = express();
const PORT = 8080;
const urlDatabase = {
  "b2xVn2":"http://www.lighthouselabs.ca",
  "9sm5xK":"http://www/google.ca"
};
app.get("/", (request, response)=>{
  response.send("hello");
});

app.listen(PORT, ()=>{
console.log("App is listening on port: ",PORT)
});

app.get("/urls.JSON", (req, res)=>{
  res.json(urlDatabase);
})