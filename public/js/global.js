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
                let list = '<img src="http://placehold.it/40" class="uk-border-circle uk-text-left" style="width: 40px; float: left; margin-right: 15px" /><p>' +
                '<a id="val" href="/chat"><h3 style="padding-top: 5px; font-size: 20px">'+'@'+users[i].name+'</h3></a></p>';
                ol.append(list);
            }
        }

        $('#numOfFriends').text((`(${arr.length})`));

        $('.onlineFriends').html(ol);
    });
});