(function($){
    $.deparam = $.deparam || function(uri) {
        if (uri === undefined) 
            uri = window.location.pathname;
        
        let val1 = window.location.pathname;
        let val2 = val1.split('/');
        let val3 = val2.pop();

        return val3;
    }
})(jQuery);
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
        let name = $('#name-user').val().toLowerCase();

        let ol = $('<div></div>');
        let arr = [];

        for (let i = 0; i < users.length; i++) {
            if (friend.indexOf(users[i].name) > -1) {
                arr.push(users[i]);

                let userName = users[i].name.toLowerCase();

                let list = '<img src="https://placehold.it/40" class="uk-border-circle uk-text-left" style="width: 40px; float: left; margin-right: 15px;" /><a href="/chat/'+userName.replace(/ /g, "-")+'.'+name.replace(/ /g, "-")+'"><h3 style="padding-top: 5px; font-size: 20px; color: #1e87f0;">'+'@'+users[i].name+'</h3></a>'
                
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
        }
    });
});

swap = (input, val_1, val_2) => {
    let temp = input[val_1];
    input[val_1] = input[val_2];
    input[val_2] = temp;
}
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