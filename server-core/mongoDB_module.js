/* mongoose - usage */
const RedisSessions = require('redis-sessions');
const mongoose = require('mongoose');
const config = require('./config');

class MongoDBService {
    constructor(){
        this.options = {
            db: {native_parser: true},
            server: {poolSize:5},
            user: config.db.user,
            password: config.db.password
        }
        // Connect to our SCABER db
        mongoose.connect('mongodb://'+config.db.user+":"+config.db.password+"@localhost:27017/"+config.db.dbname);
        this.scaberdb = mongoose.connection;

        // Define user schema
        this.userSchema = mongoose.Schema({
            name: String,
            type: String,
            authID: String,
            userTYPE: String,
            token: String,
            email: String,
            phone: String,
            trueID: String
        });
        
        // Define passenger schema
        this.passengerSchema = mongoose.Schema({
            cash: Number,
            case: Number,
            ride: Number,
            driverCOLL: [{ trueID: String }],
            trueID: String
        });

        // user schema model
        this.user_m = mongoose.model('user_m',this.userSchema);
        this.pass_m = mongoose.model('pass_m',this.passengerSchema);
    }

    // callback method of findorCreate
    user_findOrCreateCB(scaber_account,auth_type,auth_id,scaber_type,token,trueid,email,phone,callback){
        var usermodel = this.user_m;
        this.user_m.findOne({name: scaber_account}, 'name type',function(err,user){
            if(err){
                console.log(err);
                callback(1,"User findone error.");
            }
            else{
                if(user == null){
                    // not found
                    let newuser = new usermodel({name:scaber_account,type:auth_type,authID: auth_id,userTYPE: scaber_type,token: token,trueID: trueid,email: email,phone: phone});
                    newuser.save(function(err,newuser){
                        if(err){
                            console.log("Error with user save:" + err);
                            callback(1,"New user saving error.");
                        }
                        else {
                            console.log("Successfully save user");
                            callback(0,"create");
                        }
                    });
                }
                else{
                    // found one , return with error
                    callback(1,"Duplicate account");
                }
            }
        });
    }
    // delete user 
    user_delete(scaber_account,callback){
        var user_model = this.user_m;
        var pass_model = this.pass_m;
        this.user_m.findOne({name: scaber_account},'trueID',function(err,user){
            if(err){
                callback(1,"Error occur when find-delete user");
            }
            else{
                if(user == null){
                    callback(1,"Not found "+scaber_account);
                }
                else{
                    // found this user , delete the passenger of this user 
                    pass_model.findOne({trueID: user.trueID},'',function(err,pass){
                        pass.remove(function(err){
                            if(err)
                                callback(1,"Can't Delete cash");
                            else{
                                // delete itself
                                user.remove(function(err){
                                    if(err)
                                        callback(1,"Can't Delete user profile");
                                    else
                                        callback(0,"delete");
                                });
                            }
                        });
                    });
                }
            }
        })
    }
    // check user
    user_check(scaber_account,callback){
        this.user_m.findOne({name: scaber_account},'',function(err,user){
            if(err){
                console.log("Error occur when checking user");
                callback(1,"Error occur when checking user");
            }
            else{
                if(user == null){
                    console.log("Not found");
                    callback(1,"Not found");
                }
                else{
                    // find one
                    console.log("Find!");
                    callback(0,user);
                }
            }
        });
    }
    // Add cash 
    add_cash(scaber_account,cash,callback){
        var pass_model = this.pass_m;
        this.user_m.findOne({name: scaber_account},'trueID userTYPE',function(err,user){
            if(err){
                console.log("Error occur when checking user");
                callback(1,"Error occur when checking user");
            }
            else{
                if(user == null){
                    console.log("Not found");
                    callback(1,"Not found");
                }
                else{
                    // find one
                    if(user.userTYPE == "driver"){
                        // doing driver cash add 
                        console.log("Driver cash!");
                        callback(0,"Driver cash");
                    }
                    else{
                        // passenger (GAs) bonus cash 
                        this.pass_m.findOne({trueID: user.trueID},'cash case',function(perr,passenger){
                            if(perr){
                                console.log("Error occur when checking passenger");
                                callback(1,"Error occur when checking passenger");
                            }
                            else{
                                if(passenger == null){
                                    // not found this user -> create for one
                                    let newpass = new pass_model({trueID: user.trueID, cash: cash, case: 1});
                                    newpass.save(function(nerr,newpass){
                                        if(nerr){
                                            console.log("Error with passenger save:" + nerr);
                                            callback(1,"New passenger saving error.");
                                        }
                                        else {
                                            console.log("Successfully save passenger");
                                            callback(0,"create passenger");
                                        }
                                    });
                                }
                                else{
                                    // found , update cash and case by trueID
                                    passenger.cash+=cash;
                                    passenger.case++;
                                    passenger.save(function(nerr,passenger){
                                        if(nerr){
                                            console.log("Error with add cash: " + nerr);
                                            callback(1,"Error with add cash");
                                        }
                                        else{
                                            callback(0,"add cash");
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            }
        });
    }
}

module.exports = {
    MongoDBService : new MongoDBService()
}
