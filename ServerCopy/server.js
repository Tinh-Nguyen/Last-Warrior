var io = require('socket.io')(process.env.PORT || 3000);
var ioe = require('socket.io')(process.env.PORT || 1800);
var shortid = require('shortid');
console.log('server started');
var players =[];

io.on('connection',function(socket){
    var thisClientId = shortid.generate();
    
    var player = {
        id: thisClientId,
        x:3, 
        y:-5,
    };
    
    players[thisClientId] = player;
    
    console.log('client connected, broadcasting sqawn, id:',thisClientId);
    
    socket.broadcast.emit('spawn',{id: thisClientId});
    socket.broadcast.emit('requestPosition');

   for(var playerId in players){
            if(playerId == thisClientId)continue;
            socket.emit('spawn',players[playerId]);
            console.log('sending spawn to nwe player for id: ',playerId);
    };
    
    socket.on('move',function(data){
            data.id = thisClientId;
            console.log('client',JSON.stringify(data));
            console.log("run here",data);
            socket.broadcast.emit('move',data);
    });
    socket.on('updatePosition',function(data){
            console.log("update position: ",data); 
            data.id = thisClientId;
            socket.broadcast.emit('updatePosition',data);
    });
    
    socket.on('disconnect',function(){
            console.log('client disconnected');
            delete players[thisClientId];
            socket.broadcast.overrideMimeType('disconnected',{id: thisClientId});
    })
})

ioe.on('connection',function(socket){
    
    socket.on('enermy',function(data){
            console.log('enermy',JSON.stringify(data));
            socket.broadcast.emit('enermy',data);
    });
    
    socket.on('enermy1',function(data){
            console.log('enermy1',JSON.stringify(data));
            socket.broadcast.emit('enermy1',data);
    });
    
    socket.on('enermy2',function(data){
            console.log('enermy2',JSON.stringify(data));
            socket.broadcast.emit('enermy2',data);
    });
    
    socket.on('horse',function(data){
            console.log('horse',JSON.stringify(data));
            socket.broadcast.emit('horse',data);
    });
})
