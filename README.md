# ![CF](http://i.imgur.com/7v5ASc8.png) 41 OAuth

## Submission Instructions
* Work in a fork of this repository
* Work in a branch on your fork
* Write all of your code in a directory named `lab-` + `<your name>` **e.g.** `lab-duncan`
* Submit a pull request to this repository
* Submit a link to your pull request on canvas
* Submit a question, observation, and how long you spent on canvas  

## Resources
* [Github OAuth](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)
* [Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/OAuth2WebServer)
  
## Learning Objectives  
* Students will learn to add OAuth to an express/monogo app

## Requirements  
* Build a simple app where users can log-in via a third-party OAuth provider.
* You may choose to use either Google or GitHub for OAuth.
* Store the OAuth token in a cookie on the users browser.
* Your app should have a page that detects whether the user has the cookie
  and displays one thing or another depending on if they have it.
* Your app DOES NOT need to use React or Redux.

#### Configuration  
* Create a directory to host your server.
* Create an `index.html` file as a homepage.
* Serve the `index.html` file at the root of your server.

## Feature Tasks
#### Frontend 
* Create an index.html with an anchor tag pointing to the OAuth authoraztion page 
* Configure the query string with correct key value pairs
* Create a page that displays one way or another depending on whether the user
  is logged in with a cookie with a token.
* Display some sort of user-identifying information (like an email or username)
  obtained from the OAuth provider.

### Backend
* Create and register your app with your OAuth provider
* Configure the app to live at `http://localhost:3000`
* Configure the app to redirect back to `http://localhost:3000/oauth-callback`
* Create a backend route `GET /oauth-callback` for handling the redirect
* Set a cookie to store the users token on their browser.

#### Reading and Writing Cookies
Use `res.cookie` to set cookies. `npm install cookie` to deserialize cookies.

```js
// cookies becomes { foo: 'bar', equation: 'E=mc^2' }
let cookie = require('cookie');
let cookies = cookie.parse('foo=bar; equation=E%3Dmc%5E2');
```

```js
let tenSeconds = 10000; // 10 thousand milliseconds
res.cookie('cookie-name', 'cookie-value', {maxAge: tenSeconds});
```

#### Rendering HTML
Use `res.sendFile('./path-to/index.html', {root: './'})` to serve static files.

Use `res.write` and `res.end` to write dynamic HTML that changes depending on
the state of the application.

```js
app.get('/profile', (req, res) => {
  let isLoggedIn = false;
  if (!isLoggedIn) {
    res.write('<h1>You Must Log In</h1>');
    res.write('<p>Please go to the homepage and auth to log in.</p>');
    res.end();
    return;
  }

  res.write('<h1>You\'re Logged In</h1>');
  res.write('<p>Welcome back!</p>');
  res.end();
});
```

####  Documentation  
Write a description of the project in your README.md

#### Stretch Goals
Add more pages to your app that shows additional information fetched from the
authorized OAuth resources.
