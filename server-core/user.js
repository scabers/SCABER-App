// lib
const rs = require('randomstring');
// server-core
const config = require('./config');
const {MongoDBService} = require('./mongoDB_module');
const {RedisServer} = require('./redis');

class UserService {
    init(app){
        // Normal usage
        app.get('/normal',this.normal);
        app.get('/error',this.error);
        // Monitor
        app.get('/monitor',this.monitor);
        // Rate 
        app.get('/rate',this.rate);
        // Help 
        app.get('/help',this.help);
        // debug 
        app.get('/delete',this.delete);
    }
    normal(req,res){
        // Parsing parameter from session
        console.log("Successfully Login with : " + req.query.type);
        let logintype = req.query.type;
        let profile = req.user;
        let username = req.session.username;
        let usertype = req.session.type;
        let useremail = req.session.email;
        let userphone = req.session.phone;
        // Successfully login , and get redis session create
        // User id : using authenticate id
        RedisServer.create( profile.id ,req.connection.remoteAddress,7200,logintype, (err,user_token) => {
            console.log("RedisServer:")
            if(err){
                console.log("Error in Redis Server user creation. Response: " + user_token);
                res.end("Error in Redis Server user creation. Response: " + user_token);
            }
            else {
                console.log("Get new user token: "+ user_token);
                // Store in db
                // FIXME Redis id need to store into mongo
                MongoDBService.user_findOrCreateCB(username,logintype,profile.name.givenName,profile.name.familyName,usertype,user_token,profile.id,useremail,userphone,function(err,msg_type){
                    if(err){
                        // Error occur
                        console.log(msg_type);
                        res.end("Error: " + msg_type);
                    }
                    else{
                        console.log("success : " + msg_type);
                        // res.end("SCABER account: " + username + "\nSCABER type: " + usertype + "\nAuth ID:" + profile.name.familyName + profile.name.givenName);
                        if(usertype == "passenger"){
                            // Create passenger profile
                            MongoDBService.add_cash(username,0,function(a_err,msg_body){
                                if(a_err){
                                    res.end(msg_body);
                                }
                                else{
                                    // Render Passenger
                                    /*res.end(`Passenger Page:\nName:${username}\nTrue Name:${profile.name.familyName + profile.name.givenName}\nEmail: ${useremail}\nPhone: ${userphone}\n`+
                                        +`Passenger Data:`+JSON.stringify(msg_body));*/
                                    res.render('passenger',{
                                        title: "歡迎使用 SCABER!",
                                        user_familyName: profile.name.familyName,
                                        user_givenName: profile.name.givenName,
                                        scaber_account: username,
                                        user_email: useremail,
                                        user_phone: userphone,
                                        passenger_profile: msg_body
                                    });
                                }
                            });
                        }
                        else if(usertype == "driver"){
                            // Render Driver
                            // res.end(`Driver Page:\n Name:${username}\n True Name:${profile.name.familyName + profile.name.givenName}\n`);
                            MongoDBService.driver_updateOrCreate(username,22.999337,120.222028,[],"UID-9487","HONDA-CR-V",false,function(a_err,msg_body){
                                if(a_err){
                                    res.end(msg_body);
                                }
                                else{
                                    // Render Passenger
                                    res.end(JSON.stringify(msg_body));
                                    /*res.render('passenger',{
                                        title: "歡迎使用 SCABER!",
                                        user_familyName: profile.name.familyName,
                                        user_givenName: profile.name.givenName,
                                        scaber_account: username,
                                        user_email: useremail,
                                        user_phone: userphone,
                                        passenger_profile: msg_body
                                    });*/
                                }
                            });
                        }
                    }
                });
            }
        });
    }
    error(req,res){
        res.end("End");
    }
    delete(req,res){
        // delete user 
        MongoDBService.user_delete(req.query.account,function(err,msg){
            res.end(msg);
        });
    }
}

module.exports = {
    UserService: new UserService()
};
