module.exports = io => {
    io.on('connection', socket => {
        console.log('User connected');

        socket.on('join', (params, cb) => {
            socket.join(params.room);

            cb();
        });

        socket.on('createMessage', (message, cb) => {
            console.log(message);
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room
            });

            cb();
        });
    });
}