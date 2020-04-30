$(document).ready(() => {
    let socket = io();
    // socket.on('connect', () => {
    //     console.log('Yea!, user connected');
    // });

    $('#message-form').on('submit', (e) => {
        e.preventDefault();

        let msg = $('#msg').val();
        socket.emit('createMessage', {
            text: msg
        });
    });
});