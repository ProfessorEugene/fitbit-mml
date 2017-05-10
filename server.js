var express = require('express')
var app = express()
var FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;
var passport = require('passport');
const FitbitClient = require('fitbit-client-oauth2');
var client = new FitbitClient('228J4G', '49d90902c4387ccf743a61791b331daa');
var redirect_uri = 'http://localhost:9999/auth/fitbit/callback';
var scope =  'activity nutrition profile settings sleep social weight';
const jsparser = require("js2xmlparser");
var token = '';

app.get('/data', function(req,res,next) {
	console.log("token is ", token);
   var options = { 
   		period: '1m',
   		date: 'today',
   		'start-time': '00:00:00',
   		'end-time': '23:59:59'
    };
   
    Promise.all(['05','06','07','08','09','10'].map(day => {
    	var curDate = '2017-05-' + day;
    	console.log('grabbing ',curDate);
    	return client.getDailyActivitySummary(token,{
    		date: curDate
    	});
    })).then((results) => {
    	res.send(jsparser.parse("patient", results));
    	//res.send(JSON.stringify(results,null,2));
    })
});

app.get('/auth/fitbit', function(req, res, next) {
    var authorization_uri = client.getAuthorizationUrl(redirect_uri, scope);
    res.redirect(authorization_uri);
});
 
app.get('/auth/fitbit/callback', function(req, res, next) {
    var code = req.query.code;
    client.getToken(code, redirect_uri)
        .then(function(newToken) {
        	token = newToken;
            res.redirect(302, '/data');

        })
        .catch(function(err) {
            res.send(500, err);
        });
});

app.get('/', (req,res,next)=>{
	res.redirect(302, '/auth/fitbit')
})

app.listen(9999, function () {
  console.log('Example app listening on port 9999!')
})