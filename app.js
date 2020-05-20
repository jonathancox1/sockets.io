const express = require('express');
const port = process.env.PORT || 3000

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Chat App'
    })
})

// default user name
let userName = 'user1'

io.on('connection', (socket) => {
    console.log('a user has connected');

    socket.on('typing', (data) => {
        console.log('someones typing')
        if (data.typing == true) {
            socket.broadcast.emit('display', data);
        }
        else {
            socket.broadcast.emit('display', data);
        }
    })

    socket.on('disconnect', () => {
        console.log('a user has disconnected')
        // tell other users you have left
        io.emit('chat message', { message: 'a user has left', name: 'xxx' });
    })

    socket.on('chat message', (data) => {
        console.log(data)
        io.emit('chat message', data);
    })

    socket.on('update user name', (newUserName) => {
        socket.broadcast.emit('user update', {
            oldUserName: userName,
            newUserName: newUserName,
        })
        userName = newUserName;
    })

})

http.listen(port, () => {
    console.log(`Listening Open http://localhost:${port} to view`)
})