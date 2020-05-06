module.exports = (io, Global, _) => {
    const clients = new Global();

    io.on('connection', socket => {
        socket.on('global room', global => {
            socket.join(global.room);

            clients.enterRoom(socket.id, global.name, global.room, global.img);

            let nameProp = clients.getRoomList(global.room);
            
            // uniqBy to remove duplicate
            const arr = _.uniqBy(nameProp, 'name');
            
            io.to(global.room).emit('loggedInUser', arr);
        });
    });
}