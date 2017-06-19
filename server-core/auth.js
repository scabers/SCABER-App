// Dealing with User authenticate
const https = require('https');
const config = require('./config');
const passport = require('passport');
const querystring = require('querystring');
const GithubStrategy = require('passport-github').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {RedisServer} = require('./redis');
const {MongoDBService} = require('./mongoDB_module');

// definition here
class AuthService{
    init(app){
        // Initial passport Strategy
        app.use(passport.initialize());
        app.use(passport.session());
        // Using luffy configuration
        passport.use(new FacebookStrategy({
            clientID: config.auth.facebook.clientID,
            clientSecret: config.auth.facebook.clientSecret,
            profileFields: config.auth.facebook.profileFields,
            callbackURL: config.auth.facebook.callback_luffy
            },
            function(accessToken, refreshToken, profile,done){
                let userdata = profile;
                return done(null,userdata);
            }
        ));
        passport.use(new GoogleStrategy({
            clientID: config.auth.google.clientID,
            clientSecret: config.auth.google.clientSecret,
            scope: ['profile'],
            callbackURL: config.auth.google.callback_luffy
            },
            function(accessToken, refreshToken, profile, done){
                return done(null,profile);
            }
        ));
        //serialize and deserialize
        passport.serializeUser(function(user, done) {
            done(null, user);
        });

        passport.deserializeUser(function(user, done) {
            // And then here: attach user object to req!!
            done(null, user);
        });
        // for login
        app.post('/login',this.login);
        // for facebook
        app.post('/auth/facebook',this.fbauth);
        app.get('/auth/facebook/callback',passport.authenticate('facebook',{ failureRedirect: config.auth.facebook.failureUrl_luffy}),
            function(req,res){
                //console.log(req.user);
                res.redirect(config.auth.facebook.successUrl_luffy);
        }
        );
        // for google
        app.post('/auth/google',this.googleauth);
        app.get('/auth/google/callback',passport.authenticate('google',{ failureRedirect: config.auth.google.failureUrl_luffy }),
            function(req,res){
                // successful goes here - debug with req.user data
                //console.log(req.user);
                // Prepare page for Google Auth
                res.redirect(config.auth.google.successUrl_luffy);
            }
        );

        // logout
        app.get('/logout',this.logout);
    }
    // Facebook
    fbauth(req,res,next){
        // Using passport to get authenticate
        if (!req.session) req.session = {};
        req.session.returnTo = config.auth.facebook.successUrl_luffy;
        // Pass them to session
        req.session.username = req.body.account;
        req.session.email = req.body.email;
        req.session.phone = req.body.phone;
        req.session.type = req.body.user_type;
        passport.authenticate('facebook')(req, res, next);
    }
    // Google
    googleauth(req,res,next){
        // Using passport to get authenticate
        if (!req.session) req.session = {};
        req.session.returnTo = config.auth.google.successUrl_luffy;
        // Pass them to session
        req.session.username = req.body.account;
        req.session.email = req.body.email;
        req.session.phone = req.body.phone;
        req.session.type = req.body.user_type;
        passport.authenticate('google')(req, res, next);
    }
    login(req,res){
        // fetch user and theck out
        let username = req.body.account;
        // Check this user from database
        MongoDBService.user_check(username,function(err,msg_data){
            if(err)
                res.end(msg_data);
            else {
                MongoDBService.add_cash(username,0,function(c_err,profile){
                    if(c_err)
                        res.end("Error in fetch profile.");
                    else{
                        res.render('passenger',{
                            title: "歡迎使用 SCABER",
                            user_familyName: msg_data.lastName,
                            user_givenName: msg_data.firstName,
                            scaber_account: username,
                            user_email: msg_data.email,
                            user_phone: msg_data.phone,
                            passenger_profile: profile
                        });
                    }
                });
            }
        });
    }
    logout(req,res){
        req.session.destroy();
        // FIXME change to kill this logout person
        RedisServer.destroy();
        res.end("Logout");
    }
}

module.exports = {
    AuthService: new AuthService()
}
