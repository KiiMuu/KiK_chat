class Global {
    constructor() {
        this.globalRoom = [];
    }

    enterRoom(id, name, room, img) {
        let roomName = {
            id,
            name,
            room,
            img
        }
        this.globalRoom.push(roomName);

        return roomName;
    }

    removeUser(id) {
        let user = this.getUser(id);

        if (user) {
            this.users = this.globalRoom.filter(user => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        let getUser = this.globalRoom.filter(userId => userId.id === id)[0];

        return getUser;
    }

    // get all connected users to room
    getRoomList(room) {
        let roomName = this.globalRoom.filter(user => user.room === room);
        let names = roomName.map(user => {
            return {
                name: user.name,
                img: user.img
            }
        });

        return names;
    }
}

module.exports = { Global }