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

    removeUser(id) {
        let user = this.getUser(id);

        if (user) {
            this.users = this.users.filter(user => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        let getUser = this.users.filter(userId => userId.id === id)[0];

        return getUser;
    }

    // get all connected users to room
    getUsersList(room) {
        let users = this.users.filter(user => user.room === room);
        let names = users.map(user => user.name);

        return names;
    }
}

module.exports = { Users }