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
            firstName: String,
            lastName: String,
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

        // Define driver schema 
        this.driverSchema = mongoose.Schema({
            lat: Number,
            lng: Number,
            type: [{type_name: String}],
            driverName: String,
            driverPhone: String,
            license: String,
            car_model: String,
            idle: Boolean,
            trueID: String
        });

        // user schema model
        this.user_m = mongoose.model('user_m',this.userSchema);
        this.pass_m = mongoose.model('pass_m',this.passengerSchema);
        this.driv_m = mongoose.model('driv_m',this.driverSchema);
    }
    driver_updateOrCreate(scaber_account,lat,lng,type_array,license,car_model,idle,callback){
        var driver_model = this.driv_m;
        this.user_m.findOne({name: scaber_account},'trueID lastName firstName userTYPE phone',function(err,user){
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
                        // find driver model
                        driver_model.findOne({trueID: user.trueID},'lat lng type driverName idle trueID',function(derr,driver){
                            if(derr){
                                callback(1,"Error when findOne driver model");
                            }
                            else{
                                if(driver == null){
                                    // not found , create 
                                    let newdriver = new driver_model({lat: lat,lng: lng,type: type_array,idle: idle,driverName: user.lastName + user.firstName,driverPhone: user.phone,license: license,car_model: car_model,trueID: user.trueID});
                                    newdriver.save(function(nderr,newdriver){
                                        if(nderr){
                                            callback(1,"Error when save new driver.");
                                        }
                                        else{
                                            callback(0,newdriver);
                                        }
                                    });
                                }
                                else{
                                    // Duplicated , so update 
                                    driver.lat = lat;
                                    driver.lng = lng;
                                    if(type_array.length != 0){
                                        // If specific type array > 0, then update !
                                        driver.type = type_array;
                                    }
                                    driver.driverName = user.lastName + user.firstName;
                                    driver.idle = idle;
                                    driver.license = (license.length == 0) ? driver.license : license;
                                    driver.car_model = (car_model.length == 0) ? driver.car_model : car_model;
                                    driver.save(function(oderr,driver){
                                        if(oderr){
                                            callback(1,"Error when update existed driver.");
                                        }
                                        else{
                                            callback(0,driver);
                                        }
                                    });
                                }
                            }
                        });
                    }
                    else{
                        console.log("This is passenger account!");
                        callback(1,"Driver cash");
                    }
                }
            }
        });
    }
    // callback method of findorCreate
    user_findOrCreateCB(scaber_account,auth_type,firstName,lastName,scaber_type,token,trueid,email,phone,callback){
        var usermodel = this.user_m;
        this.user_m.findOne({name: scaber_account}, 'name type',function(err,user){
            if(err){
                console.log(err);
                callback(1,"User findone error.");
            }
            else{
                if(user == null){
                    // not found
                    let newuser = new usermodel({name:scaber_account,type:auth_type,firstName: firstName,lastName: lastName,userTYPE: scaber_type,token: token,trueID: trueid,email: email,phone: phone});
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
    // Add ride
    add_ride(scaber_account,callback){
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
                        pass_model.findOne({trueID: user.trueID},'cash case ride',function(perr,passenger){
                            if(perr){
                                console.log("Error occur when checking passenger");
                                callback(1,"Error occur when checking passenger");
                            }
                            else{
                                if(passenger == null){
                                    // not found this user -> create for one
                                    let newpass = new pass_model({trueID: user.trueID, cash: cash, case: 1,ride: 1});
                                    newpass.save(function(nerr,newpass){
                                        if(nerr){
                                            console.log("Error with passenger save:" + nerr);
                                            callback(1,"New passenger saving error.");
                                        }
                                        else {
                                            console.log("Successfully save passenger");
                                            callback(0,newpass);
                                        }
                                    });
                                }
                                else{
                                    // found , update cash and case by trueID
                                    passenger.ride++;
                                    passenger.save(function(nerr,passenger){
                                        if(nerr){
                                            console.log("Error with add cash: " + nerr);
                                            callback(1,"Error with add cash");
                                        }
                                        else{
                                            callback(0,passenger);
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
                        pass_model.findOne({trueID: user.trueID},'cash case ride',function(perr,passenger){
                            if(perr){
                                console.log("Error occur when checking passenger");
                                callback(1,"Error occur when checking passenger");
                            }
                            else{
                                if(passenger == null){
                                    // not found this user -> create for one
                                    let newpass = new pass_model({trueID: user.trueID, cash: cash, case: 1,ride: 0});
                                    newpass.save(function(nerr,newpass){
                                        if(nerr){
                                            console.log("Error with passenger save:" + nerr);
                                            callback(1,"New passenger saving error.");
                                        }
                                        else {
                                            console.log("Successfully save passenger");
                                            callback(0,newpass);
                                        }
                                    });
                                }
                                else{
                                    // found , update cash and case by trueID
                                    passenger.cash+=cash;
                                    if(cash > 0){
                                        passenger.case++;
                                    }
                                    passenger.save(function(nerr,passenger){
                                        if(nerr){
                                            console.log("Error with add cash: " + nerr);
                                            callback(1,"Error with add cash");
                                        }
                                        else{
                                            callback(0,passenger);
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
