$(document).ready(() => {
    let user = {
        name: 'default',
        message: '',
        typing: false,
        socketId: undefined,
    }

    let timeout = undefined;
    const socket = io();

    $('.chat-form').submit(e => {
        e.preventDefault();
    })

    // listen for typing
    $('.chat-input').keypress(function (e) {
        var keycode = (e.keyCode ? e.keyCode : e.which)
        if (keycode != 13) {
            user.typing = true
            user.message = keycode
            socket.emit('typing', user);
        } else {
            if ($('.chat-input').val() == '') {
            } else {
                user.typing = false
                user.message = $('.chat-input').val();
                socket.emit('typing', user);
                $('.chat-input').val('');
            }

        }
    });

    socket.on('display', (data) => {
        if (data.typing == true) {
            if ($('.typing').length) {
            } else {
                const $someonesTyping = $(`<li class='list-group-item typing'>${data.name} is typing...</li>`)
                $('#messages').append($someonesTyping);
            }
        } else {
            $('.typing').remove();
            const $newChat = $(`<li class='list-group-item'>${data.message} - <small>${data.name}</small></li>`)
            $('#messages').append($newChat);
        }
    })

    socket.on('chat message', (data) => {
        const $newChat = $(`<li class='list-group-item'>${data.message} - <small>${data.name}</small></li>`)
        $('#messages').append($newChat);
    })

    socket.on('user update', (data) => {
        $('#messages').append(`<li class='list-group-item'>${data.name} has joined</li>`)
    })

    $('.userNameForm').submit(e => {
        e.preventDefault();
        $("#userName").prop('disabled', true);
        $('#userNameButton').toggle();
        $('#chat-button').prop('disabled', false);
        $('#chat-message').prop('disabled', false);
        user.name = $('#userName').val();
        socket.emit('update user name', user)
    })

    socket.on('usersList', (data) => {
        $('#users').empty();
        data.forEach(element => {
            $('#users').append(`<li class="list-group-item bg-light text-right" id="${element}">${element}  🌐</li>`);
        });
    })
})