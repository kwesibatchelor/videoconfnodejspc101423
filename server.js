const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
//const { Server } = require("socket.io"); +
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true 
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
    //res.status(200).send("Kwesi");
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room' , (roomId, userId) => {
        socket.join(roomId);
        //console.log(roomId)
        socket.to(roomId).emit('user-connected', userId);
        //console.log("joined room");
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    })
})

server.listen(3000);