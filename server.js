var express = require('express')
var app = express()
var FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;
var passport = require('passport');
const FitbitClient = require('fitbit-client-oauth2');
var client = new FitbitClient('228J4G', '49d90902c4387ccf743a61791b331daa');
var redirect_uri = 'http://localhost:9999/auth/fitbit/callback';
var scope =  'activity nutrition profile settings sleep social weight';

var token = '';

app.get('/data', function(req,res,next) {
	console.log("token is ", token);
	//access_token
	   var options = { /* TIME_SERIES_OPTIONS */ };
    
    client.getTimeSeries(token, options)
        .then(function(fres) {
            console.log('results: ', fres);
        }).catch(function(err) {
            console.log('error getting user data', err);
        });
	res.send(token);
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
            // ... save your TIME_SERIES_OPTIONSken on db or session... 
           

            // then redirect
            res.redirect(302, '/data');

        })
        .catch(function(err) {
            // something went wrong.
            res.send(500, err);
        
        });

});

app.listen(9999, function () {
  console.log('Example app listening on port 9999!')
})