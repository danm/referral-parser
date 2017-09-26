const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const Referral = require('../index.js');

app.use( bodyParser.json() );

app.get('/', function (req, res) {
  res.send('Hi Shirley')
})

app.get('/url/:referrer', function (req, res) {
  res.json(new Referral(req.params.referrer, {bbc: true}));
})

app.post('/url', function (req, res) {
  res.json(new Referral(req.body.url, {bbc: true}));
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})