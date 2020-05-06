$(document).ready(() => {
    let socket = io();

    socket.on('connect', () => {
        let room = 'GlobalRoom';
        let name = $('#name-user').val();
        let img = $('#name-image').val();

        socket.emit('global room', {
            room,
            name,
            img
        });
    });

    socket.on('loggedInUser', function(users) {
        let friends = $('.friend').text();
        let friend = friends.split('@');
        let name = $('#name-user').val();

        let ol = $('<div></div>');
        let arr = [];

        for (let i = 0; i < users.length; i++) {
            if (friend.indexOf(users[i].name) > -1) {
                arr.push(users[i]);
                ol.append(users[i].name);
            }
        }

        $('#numOfFriends').text((`(${arr.length})`));

        $('.onlineFriends').html(ol);
    });
});