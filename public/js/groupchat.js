$(document).ready(() => {
    let socket = io();

    let room = $('#groupName').val();

    socket.on('connect', () => {
        console.log('Yea!, user connected');

        let params = {
            room
        }

        socket.emit('join', params, () => {
            console.log('A user has joined');
        });
    });

    socket.on('newMessage', data => {
        console.log(data.text);
        console.log(data.room);
    });

    $('#message-form').on('submit', e => {
        e.preventDefault();

        let msg = $('#msg').val();
        socket.emit('createMessage', {
            text: msg,
            room
        }, () => {
            $('#msg').val('');
        });
    });
});