//a function which returns the URLs where the userID is equal to the id of the currently logged-in user
const urlsForUser = function(id, database) {
  const userURLs = {};
  for (let url in database) {
    if (database[url].userID === id) {
      userURLs[url] = database[url];
    }
  }
  return userURLs;
};

//Looks up if an email exists or not
const emailLooker = (email) =>{
  for (let id in users) {
    if (users[id].email === email) {
       return users[id]; 
    }
  }
}
// simulate generating unique shortURL - 6 random alphanumeric characters
const generateRandomString = function () {
  return Math.random().toString(36).substring(2, 8);
};

module.exports = { urlsForUser , generateRandomString, emailLooker };