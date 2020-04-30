module.exports = io => {
    io.on('connection', (socket) => {
        // console.log('User connected');
        socket.on('createMessage', message => {
            console.log(message);
        });
    });
}