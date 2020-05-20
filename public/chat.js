$(document).ready(() => {
    let user = {
        name: 'default',
        message: '',
    }

    const socket = io();
    $('.chat-form').submit(e => {
        e.preventDefault();
        // data = {
        //     message: $('.chat-input').val(),
        //     userName: 'default',
        // }
        user.message = $('.chat-input').val();
        socket.emit('chat message', user);
        $('.chat-input').val('');

    })

    socket.on('chat message', (data) => {
        const $newChat = $(`<li class='list-group-item'>${data.message} - <small>${data.name}</small></li>`)
        $('#messages').append($newChat);
    })

    socket.on('user update', (userData) => {
        $('#messages').append(`<li class='list-group-item'>${userData.oldUserName} changed to ${userData.newUserName}</li>`)
    })

    $('.userNameForm').submit(e => {
        e.preventDefault();
        $("#userName").prop('disabled', true);
        $('#userNameButton').toggle();
        const userName = $('#userName').val();
        socket.emit('update user name', userName)
        return user.name = userName


    })



})

