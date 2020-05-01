class Users {
    constructor() {
        this.users = [];
    }

    addUserData(id, name, room) {
        let users = {
            id,
            name,
            room
        }
        this.users.push(users);

        return users;
    }

    // get all connected users to room
    getUsersList(room) {
        let users = this.users.filter(user => user.room === room);
        let names = users.map(user => user.name);

        return names;
    }
}

module.exports = { Users }