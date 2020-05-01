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
        console.log(users);
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