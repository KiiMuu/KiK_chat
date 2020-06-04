$(document).ready(() => {
    let socket = io();

    let paramOne = $.deparam(window.location.pathname);
    let newParam = paramOne.split('.');

    let username = newParam[0];
    $('#reciever_name').text('@'+username);

    swap(newParam, 0, 1);

    let paramTwo = newParam[0]+'.'+newParam[1];

    socket.on('connect', () => {
        let params = {
            room1: paramOne,
            room2: paramTwo
        }

        socket.emit('join PM', params);
        socket.on('message display', () => {
            $('#reload').load(location.href + ' #reload');
        });
    });

    socket.on('new message', data => {
        let template = $('#message-template').html();

        let message = Mustache.render(template, {
            text: data.text,
            sender: data.sender
        });

        $('#messages').append(message);
    });

    $('#message_form').on('submit', e => {
        e.preventDefault();

        let msg = $('#msg').val();
        let sender = $('#name-user').val();

        if (msg.trim().length > 0) {
            socket.emit('private message', {
                text: msg,
                sender,
                room: paramOne
            }, () => {
                $('#msg').val('');
            });
        } else {
            alert('Type something');
        }
    });

    $('#send-message').on('click', () => {
        let message = $('#msg').val();

        $.ajax({
            url: '/chat/'+paramOne,
            type: 'POST',
            data: {
                message
            },
            success: () => {
                $('#msg').val('');
            }
        });
    });
});

swap = (input, val_1, val_2) => {
    let temp = input[val_1];
    input[val_1] = input[val_2];
    input[val_2] = temp;
}