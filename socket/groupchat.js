module.exports = (io, Users) => {
    const users = new Users();

    io.on('connection', socket => {
        console.log('User connected');

        socket.on('join', (params, cb) => {
            socket.join(params.room);

            users.addUserData(socket.id, params.name, params.room);
            
            io.to(params.room).emit('usersList', users.getUsersList(params.room));

            cb();
        });

        socket.on('createMessage', (message, cb) => {
            console.log(message);
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.sender
            });

            cb();
        });

        socket.on('disconnect', () => {
            let user = users.removeUser(socket.id);

            if (user) {
                io.to(user.room).emit('usersList', users.getUsersList(user.room));
            }
        });
    });
}