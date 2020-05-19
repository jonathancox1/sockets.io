$(document).ready(() => {
    const socket = io();
    $('.chat-form').submit(e => {
        e.preventDefault();
        const msg = $('.chat-input').val();
        socket.emit('chat message', msg)
    })

    socket.on('chat message', (data) => {
        const $newChat = $(`<li class='list-group-item'>${data.message} - ${data.userName}</li>`)
        $('#messages').append($newChat);
    })

    socket.on('user updated', (userData) => {

    })

    $('.userNameForm').submit(e => {
        e.preventDefault();
        const userName = $('#userName').val();
        socket.emit('update user name', userName)


    })



})

