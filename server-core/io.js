// lib
const IO = require('socket.io');
const sjcl = require('sjcl');
const rs = require('randomstring');
const jsfs = require('jsonfile');
const path = require('path');
// server-core
const {RedisServer} = require('./redis');
const {MongoDBService} = require('./mongoDB_module');

class SyncService {
    init(server){
        // Create Web Socket Server
        this.io = new IO().listen(server);
        // Maintain current waiting GA channel
        this.waiting_channel = [];
        // Binding this to use
        var self = this;
        // Web Socket Listening
        this.io.sockets.on('connection',function(socket){
            // when client side connection to our server
            // ========================== "Join" type ==========================
            socket.on("join",function(room_info){
                console.log('[Sync] Join Room request send from : ' + socket.request.connection.remoteAddress+" ; With Room ID :" + room_info.room_name);
                // Remember the socket room_name
                socket.room_name = room_info.room_name;
                socket.room_type = room_info.type;
            });
            // ========================== "Disconnect" type ==========================
            socket.on("disconnect",function(){
                // disconnet
                console.log('[Sync] '+ socket.request.connection.remoteAddress +' ,detach from channel.' );
                // check out the room name
                console.log('[Sync] Leaving Room: ' + socket.room_name);
            });
            // ========================== Find driver ==========================
            socket.on("find_driver",function(find_obj){
                console.log("ID: " + find_obj.id + "; Pos:" + JSON.stringify(find_obj.pos) + "; True ID: " + find_obj.unique );
                // Join into channel (self-created)
                socket.join(find_obj.unique);
                // find driver
                MongoDBService.driv_m.find({idle: true}).limit(1).exec(function(err,array){
                    if(err){
                        socket.emit('find_driver_listen',{
                            header: "error",
                            msg: "Error when find available driver"
                        });
                    }
                    else{
                        if(array.length == 0){
                            // Not found , emit "404" to client , let client try again
                            socket.emit('find_driver_listen',{
                                header: "error",
                                msg: "Driver shortage"
                            });
                        }else{
                            // Found , send driver information to client
                            socket.emit('find_driver_listen',{
                                header: "accept",
                                msg: array[0]
                            });
                            // set this driver to idle
                            MongoDBService.driver_idle_status(array[0].trueID,false,function(err,msg){

                            });
                            // FIXME: And then add this channel into monitor channels
                            self.waiting_channel.push({
                                channel_name: find_obj.unique,
                                passenger_name: find_obj.id,
                                passenger_phone: find_obj.phone,
                                passenger_loc: find_obj.pos
                            });
                        }
                    }
                });
            });
            // ========================== Prepare to binding channel ==========================
            socket.on("trip_start",function(pass_obj){
                // broadcast in pass_obj.unique (receive by GAs, and they will go into monitor page)
                self.io.in(pass_obj.unique).emit('go_monitor',{
                    passenger: pass_obj.id,
                    startPos: pass_obj.startPos,
                    endPos: pass_obj.endPos 
                });
            });
            // ========================== Remove somebody from channel ==========================
            socket.on("cancel_ga",function(ga_obj){
                // FIXME 
                console.log("GA: " + ga_obj.account);
            });
        }); // Web Socket Listening
    }
}

module.exports = {
    SyncService : new SyncService()
}
