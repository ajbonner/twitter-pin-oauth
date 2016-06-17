var OAuth = require('oauth').OAuth;
var readlineSync = require('readline-sync');

var Auth = function(consumerKey, consumerSecret) {
  this.authorizeUrl = 'https://api.twitter.com/oauth/authorize';
  this.consumerKey = consumerKey;
  this.consumerSecret = consumerSecret;
  this.oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    this.consumerKey,
    this.consumerSecret,
    '1.0A',
    'oob',
    'HMAC-SHA1'
  );
};

Auth.prototype.getRequestToken = function () {
  return new Promise((resolve, reject) => {
    this.oauth.getOAuthRequestToken(function (err, oauth_token, oauth_token_secret, results) {
      if (err) {
        reject(Error(JSON.stringify(err)));
      } else {
        resolve({
          token: oauth_token,
          token_secret: oauth_token_secret
        });
      }
    });
  });
};

Auth.prototype.authorize = function (oauth) {
  return new Promise((resolve, reject) => {
    process.stdout.write(`Visit ${this.authorizeUrl}?oauth_token=${oauth.token}\n`);
    oauth.verifier = readlineSync.question('Enter Pin: ');
    resolve(oauth);
  });
};

Auth.prototype.getAccessToken = function (oauth) {
  return new Promise((resolve, reject) => {
    this.oauth.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
      function (err, oauth_access_token, oauth_access_token_secret, results) {
        if (err) {
          reject(Error(JSON.stringify(err)));
        } else {
          oauth.access_token = oauth_access_token;
          oauth.access_token_secret = oauth_access_token_secret;
          resolve(oauth);
        }
      }
    );
  });
};

module.exports = Auth;