const { assert } = require('chai');

const { urlsForUser } = require('../helper');

describe('urlsForUser', function() {
  it('should return the id of which the user exsits in the database', function() {
    const user = urlsForUser('aJ48lW', database);
    console.log("value of user is ",user);
    const expectedOutput = {b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" }};
    // Write your assert statement here
    assert.deepEqual(user,expectedOutput);
   
  });

  it('should return an empty object if the userid does not exsits in the database', function() {
    const user = urlsForUser('user3RandomID', database)
   // console.log(user);
    const expectedOutput = {};
    // Write your assert statement here
    assert.deepEqual(user,expectedOutput);
  });
});

const database = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "bJ48lU" }
}

