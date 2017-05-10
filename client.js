const FitbitClient = require('fitbit-client-oauth2');

var client = new FitbitClient('228J4G', '49d90902c4387ccf743a61791b331daa');
var redirect_uri = 'http://localhost:9999';
var scope =  'activity nutrition profile settings sleep social weight';
    
server.get('/auth/fitbit', function(req, res, next) {
    var authorization_uri = client.getAuthorizationUrl(redirect_uri, scope);
    res.redirect(authorization_uri);
});
    
server.get('/auth/fitbit/callback', function(req, res, next) {

    var code = req.query.code;
    
    client.getToken(code, redirect_uri)
        .then(function(token) {

            // ... save your token on db or session... 
            
            // then redirect
            res.redirect(302, '/user');

        })
        .catch(function(err) {
            // something went wrong.
            res.send(500, err);
        
        });

});