const { assert } = require('chai');

const { urlsForUser } = require('../helper');

describe('urlsForUser', function() {
  it('should return true if the user exsits in the database', function() {
    const user = urlsForUser('userRandomID', database);
    console.log(user);
    const expectedOutput = true;
    // Write your assert statement here
    assert.equal(user,expectedOutput);
  });

  it('should return false if the user does not exsits in the database', function() {
    const user = urlsForUser('user3RandomID', database)
    const expectedOutput = false;
    // Write your assert statement here
    assert.equal(user,expectedOutput);
  });
});

const database = {
  "userRandomID": {
    userRandomID: 'www.facebook.com',
    userRandomID: 'www.yahoo.com'
  },
  "user2RandomID": {
    user2RandomID: "www.bitcoin.com", 
    user2RandomID: "www.wwe.com"
  }
}

