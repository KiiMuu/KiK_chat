$(document).ready(() => {
    let socket = io();

    let room = $('#groupName').val();
    let sender = $('#sender').val();

    socket.on('connect', () => {
        console.log('Yea!, user connected');

        let params = {
            room,
            name: sender
        }

        socket.emit('join', params, () => {
            console.log('A user has joined');
        });
    });

    socket.on('usersList', users => {
        let ol = $('<ol></ol>');

        for (let i = 0; i < users.length; i++) {
            ol.append('<p><a href="#view-user" id="val" uk-toggle>'+users[i]+'</a></p>');
        }

        $(document).on('click', '#val', function(e) {
            e.preventDefault();
            $('#name').text('@'+$(this).text());
            $('#recieverName').val($(this).text());
            $('#nameLink').attr('href', '/profile/'+$(this).text());
        });

        $('#numValue').text((`(${users.length})`));

        $('#users').html(ol);
    });

    socket.on('newMessage', data => {
        let template = $('#message-template').html();

        let message = Mustache.render(template, {
            text: data.text,
            sender: data.from
        });

        $('#messages').append(message);
    });

    $('#message-form').on('submit', e => {
        e.preventDefault();

        let msg = $('#msg').val();
        socket.emit('createMessage', {
            text: msg,
            room,
            sender
        }, () => {
            $('#msg').val('');
        });
    });
});