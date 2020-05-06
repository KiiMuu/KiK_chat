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
$(document).ready(() => {
    $('#favorite').on('submit', e => {
        e.preventDefault();

        let id = $('#id').val();
        let clubName = $('#club_name').val();

        $.ajax({
            url: '/clubs',
            type: 'POST',
            data: {
                id,
                clubName
            },
            success: () => {
                console.log(clubName);
            }
        });
    });
});
$(document).ready(() => {
    $('.upload-btn').on('click', () => {
        $('#upload-input').click();
    });

    $('#upload-input').on('change', () => {
        let uploadInput = $('#upload-input');

        if (uploadInput.val() !== '') {
            let formData = new FormData();

            formData.append('upload', uploadInput[0].files[0]);

            $.ajax({
                url: '/uploadFile',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: () => {
                    uploadInput.val('')
                }
            });
        }
    });
});
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

        $(document).on('click', '#accept-friend', function() {
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

        $(document).on('click', '#decline-friend', function() {
            let user_id = $('#user_id').val();
    
            $.ajax({
                url: `/group/${room}`,
                type: 'POST',
                data: {
                    user_id
                },
                success: () => {
                    $(this).parent().eq(1).remove();
                }
            });
    
            $('#reload').load(location.href + ' #reload');
        });
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
                $(this).parent().eq(1).remove();
            }
        });

        $('#reload').load(location.href + ' #reload');
    });

    $('#decline-friend').on('click', () => {
        let user_id = $('#user_id').val();

        $.ajax({
            url: `/group/${room}`,
            type: 'POST',
            data: {
                user_id
            },
            success: () => {
                $(this).parent().eq(1).remove();
            }
        });

        $('#reload').load(location.href + ' #reload');
    });
});