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