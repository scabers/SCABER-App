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
                MongoDBService.driv_m.find({idle: true}).limit(1).exec(function(err,array){
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
                    }
                });
            });
        }); // Web Socket Listening
    }
}

module.exports = {
    SyncService : new SyncService()
}
