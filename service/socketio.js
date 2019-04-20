const verifyKeyToken = require('./token').verifyKeyToken

module.exports = (io) => {
    let onlineUsers = {};

    io.use((socket, next) => {
        let token = socket.handshake.query.token
        verifyKeyToken(token)
        .then((user) => {
            socket.username = user.username
            next()
        })
        .catch(err => {
            next(err)
        })
    })

    io.on('connection', (socket) => {
        socket.join(socket.username)
        console.log('connected: ', socket.username);
        io.to(socket.username).emit('online user', onlineUsers);
        socket.on('user entered', (data) => {
            console.log(data);
            onlineUsers[socket.username] = data;
            io.emit('update users', {
                name: data,
                // id: socket.id
            }, `${data} have entered`, 'enter');
        });
        socket.on('disconnect', () => {
            console.log('closed: ', socket.username);
            let userLeft = onlineUsers[socket.username];
            delete onlineUsers[socket.username];
            io.emit('update users', {
                name: userLeft,
                // id: socket.id
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
            io.to(data.toName).emit('new private message', data)
            io.to(data.fromName).emit('my private message', data)
        })
        socket.on('private image', (data, file) => {
            console.log('private')
            io.to(data.toName).emit('new private image', data, file)
            io.to(data.fromName).emit('my private image', data, file)
        })
    });
}