const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let onlineUsers = {};

http.listen(3000, () => {
    console.log('server listening to port 3000');
});

io.on('connection', (socket) => {
    console.log('connected: ', socket.id);
    io.to(socket.id).emit('online user', onlineUsers);
    socket.on('user entered', (data) => {
        console.log(data);
        onlineUsers[socket.id] = data;
        io.emit('update users', {
            name: data,
            id: socket.id
        }, `${data} have entered`, 'enter');
    });
    socket.on('disconnect', () => {
        console.log('closed: ', socket.id);
        let userLeft = onlineUsers[socket.id];
        delete onlineUsers[socket.id];
        io.emit('update users', {
            name: userLeft,
            id: socket.id
        }, `${userLeft} has left`, 'left');
        console.log(onlineUsers);
    });
    socket.on('group message', (data) => {
        console.log(data);
        io.emit('new group message', data);
    });
    socket.on('typing', (user) => {
        io.emit('whos typing', user);
    })
    socket.on('group image', (data, file) => {
        console.log(file)
        io.emit('new group image', data, file);
    })
    socket.on('private message', (data) => {
        console.log('private')
        io.to(data.toId).emit('new private message', data)
        io.to(data.fromId).emit('my private message', data)
    })
    socket.on('private image', (data, file) => {
        console.log('private')
        io.to(data.toId).emit('new private image', data, file)
        io.to(data.fromId).emit('my private image', data, file)
    })
});