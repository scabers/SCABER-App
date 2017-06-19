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
            // ========================================================================================== "Join" type ==========================================================================================
            socket.on("join",function(room_info){
                console.log('[Sync] Join Room request send from : ' + socket.request.connection.remoteAddress+" ; With Room ID :" + room_info.room_name);
                // Remember the socket room_name
                socket.room_name = room_info.room_name;
                socket.room_type = room_info.type;
            });
            // ========================================================================================== "Disconnect" type ==========================================================================================
            socket.on("disconnect",function(){
                // disconnet
                console.log('[Sync] '+ socket.request.connection.remoteAddress +' ,detach from channel.' );
                // check out the room name
                console.log('[Sync] Leaving Room: ' + socket.room_name);
                if(socket.room_name == "waiting" || socket.room_name == undefined){
                    // don't splice
                }
                else{
                    // cancel the channel
                    if(socket.room_type == "user"){
                        socket.leave(socket.room_name);
                        self.waiting_channel.splice(self.waiting_channel.indexOf(socket.room_name),1);
                    }
                }
            });
        }); // Web Socket Listening
    }
}

module.exports = {
    SyncService : new SyncService()
}
