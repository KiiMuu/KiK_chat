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
        // show friend request notification without reloading page
        $('#reload').load(location.href + ' #reload');
    });

    $('#add-friend').on('submit', e => {
        e.preventDefault();

        let recieverName = $('#recieverName').val();

        $.ajax({
            url: `/group/${room}`,
            type: 'POST',
            data: {
                recieverName
            },
            success: () => {
                socket.emit('friendRequest', {
                    reciever: recieverName,
                    sender
                }, () => {
                    console.log('Request sent');
                });
            }
        });
    });

    $('#accept-friend').on('click', () => {
        let senderId = $('#senderId').val();
        let senderName = $('#senderName').val();

        $.ajax({
            url: `/group/${room}`,
            type: 'POST',
            data: {
                senderId,
                senderName
            },
            success: () => {
                // if I click accept button, remove the user data from notification
                $(this).parent().eq(1).remove();
            }
        });

        $('#reload').load(location.href + ' #reload');
    });
});