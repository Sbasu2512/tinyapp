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

module.exports = urlsForUser;