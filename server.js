//const { Socket } = require('dgram');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
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
})// this goes to the first page (being the main page /) redirects to getting a uuid

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
}) // this then renders the room and adds to the first page

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);//someone has joined and connected

        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    })
})

server.listen(3030);