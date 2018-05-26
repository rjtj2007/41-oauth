require('dotenv').config();

const express = require('express');
const superagent = require('superagent');
const app = express();

app.get('/', (req, res) => {
    res.sendFile('./index.html', {root: './'});
});

app.get('/oauth-callback', (req, res) => {
    let {code, state} = req.query;
    
    let tokenUrl = '';
    superagent.post(tokenUrl)
    .send({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: code
    })
    .then(tokenResponse => {
        // res.send(tokenResponse.body);
        let token = tokenResponse.body.access_token;
        let userUrl = 'https://api.github.com/user?';
        userUrl +=  'access_token=' + token;
        return superagent.get(userUrl);
    })
    .then(userResponse => {
        let username = userResponse.login;
        let bio = userResponse.bio;
        res.write('<a href=http://localhost:3000>' + username+ '</a>');
        res.write('<h3>' + username+ '</h3>');
        res.write('<p>' + bio+ '</p>');
        res.write('<pre>' + userResponse.body + '</pre>');
        res.end();
        // res.send(userResponse.body);
    })
    .catch(err => {
        res.send(err.body);
    });
});


let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('http://localhost:' + PORT);
});