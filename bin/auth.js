var Auth = require('../lib/auth');

if (typeof process.env.TWITTER_CONSUMER_KEY === 'undefined' || typeof process.env.TWITTER_CONSUMER_SECRET == 'undefined') {
  process.stderr.write("TWITTER_CONSUMER_KEY and TWITTER_CUSTOMER_SECRET environment variables must be set.\n");
  process.exit(1);
}

var auth = new Auth(process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET);

auth.getRequestToken().then((oauth) => {
  return auth.authorize(oauth);
}).catch((err) => {
  console.error(err.message);
}).then((oauth) => {
  return auth.getAccessToken(oauth);
}).catch((err) => {
  console.error(err.message);
}).then((oauth) => {
  console.log(oauth);
});