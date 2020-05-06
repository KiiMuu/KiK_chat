module.exports = (io, Global, _) => {
    const clients = new Global();

    io.on('connection', socket => {
        socket.on('global room', global => {
            socket.join(global.room);

            clients.enterRoom(socket.id, global.name, global.room, global.img);

            const nameProp = clients.getRoomList(global.room);
            
            // uniqBy to remove duplicate
            const arr = _.uniqBy(nameProp, 'name');
            
            io.to(global.room).emit('loggedInUser', arr);
        });

        socket.on('disconnect', () => {
            let user = clients.removeUser(socket.id);

            if (user) {
                const userData = clients.getRoomList(user.room);            
                const arr = _.uniqBy(userData, 'name');
                const removeData = _.remove(arr, {'name': user.name})
                io.to(user.room).emit('loggedInUser', arr);
            }
        });
    });
}