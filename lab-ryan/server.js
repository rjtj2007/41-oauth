require('dotenv').config();

let express = require('express');
let app = express();
let superagent = require('superagent');

app.get('/', (req, res) => {
  res.cookie('newUser', false, {maxAge: 900000});
  res.sendFile('./index.html', {root: './'});
});

app.get('/new', (req, res) => {
  let authToken = 'newUser=false';
  let newUser = !req.headers.cookie.includes(authToken);
  if (newUser) {
    res.write('<h1>Welcome!</h1>');
    res.end();
  } else {
    res.write('<h1>Welcome Back!</h1>');
    res.end();
  }
});

app.get('/oauth-callback', (req, res) => {
  let {code, state} = req.query;
  if (!code) {
    res.write('<h1>Unauthorized</h1>');
    res.write('<p>You must be authorized to access this page.</p>');
    res.end();
  }

  let tokenUrl = 'https://github.com/login/oauth/access_token';
  superagent.post(tokenUrl)
  .send({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: code
  })
  .then(tokenResponse => {
    let token = tokenResponse.body.access_token;
    token = 'cheat' + token + 'cheat';
    res.cookie('oauth-token', token, {maxAge: 100000});
    res.write('<h1>Authorized!</h1>');
    res.write(`<p>Token: ${token}</p>`);
    res.write('<a href="/profile">Your Profile Page</a>');
    res.end();
  });
});

app.get('/profile', (req, res) => {
  let authToken = 'oauth-token';
  let isLoggedIn = req.headers.cookie.includes(authToken);
  if (!isLoggedIn) {
    res.write('<h1>Not Authorized</h1>');
    res.write('<p>Please log in to view this page.</p>');
    res.end();
    return;
  }

  let token = req.headers.cookie.split('cheat')[1];
  let userUrl = 'https://api.github.com/user?';
  userUrl += 'access_token=' + token;
  superagent.get(userUrl)
  .then(userResponse => {
    let username = userResponse.body.login;
    let bio = userResponse.body.bio;
    res.write('<div>');
    res.write('<a href="http://localhost:3000"><< home</a>');
    res.write('</div>');
    res.write('<div>');
    res.write('<img src="' + userResponse.body.avatar_url + '"/>')
    res.write('</div>');
    res.write('<h1>' + username + '</h1>');
    res.write('<p>' + bio + '</p>');
    res.write('<p>' + JSON.stringify(userResponse.body) + '</p>');
    res.end();
  })
  .catch(err => {
    res.write('<h1>Error</h1>');
    res.write('<p>' + err.body + '</p>');
    res.end();
  });
});

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('http://localhost:' + PORT);
});