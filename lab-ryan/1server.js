require('dotenv').config();

const express = require('express');
const app = express();
const superagent = require('superagent');

app.get('/', (req, res) => {
    res.sendFile('./index.html', {root: './'});
});

app.get('/oauth-callback', (req, res) => {
    let {code, state} = req.query;
    if(!code){
        res.write('<h3>Unauthorized</h3>');
        res.write('<p>You must be authorized to use thei application</p>')
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
        // res.send(tokenResponse.body);
        let token = tokenResponse.body.access_token;
        let userUrl = 'https://api.github.com/user?';
        userUrl +=  'access_token=' + token;
        superagent.get(userUrl);
    })
    .then(userResponse => {
        let username = userResponse.body.login;
        let bio = userResponse.body.bio;
        res.write('<div>');
        res.write('<a href="http://localhost:3000"><< HOME</a>');
        res.write('</div>');
        res.write('<div>');
        res.write('<img src="' + userResponse.body.avatar_url +'"/>')
        res.write('</div>')
        res.write('<h3>' + username+ '</h3>');
        res.write('<p>' + bio+ '</p>');
        res.write('<pre>' + JSON.stringify(userResponse.body) + '</pre>');
        res.end();
    })
    .catch(err => {
        res.write('<h3>Error</h3>');
        res.write('<p>' + err.body + '</p>')
        res.end();
    });
});


let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('http://localhost:' + PORT);
});