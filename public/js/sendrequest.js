$(document).ready(() => {
    let socket = io();

    let room = $('#groupName').val();
    let sender = $('#sender').val();

    socket.on('connect', () => {
        let params = {
            sender
        }

        socket.emit('joinRequest', params, () => {
            console.log('joined');
        });
    });

    socket.on('newFriendRequest', friend => {
        console.log(friend);
    });

    $('#add-friend').on('submit', e => {
        e.preventDefault();

        let recieverName = $('#recieverName').val();

        $.ajax({
            url: `group/${room}`,
            type: 'POST',
            data: {
                recieverName
            },
            succes: () => {
                socket.emit('friendRequest', {
                    reciever: recieverName,
                    sender
                }, () => {
                    console.log('Request sent');
                });
            }
        });
    });
});