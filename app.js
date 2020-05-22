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

let userNamesArray = [];
let userObj = {};

io.on('connection', (socket) => {
    console.log('a user has connected');

    socket.on('typing', (data) => {
        if (data.typing == true) {
            socket.broadcast.emit('display', data);
        }
        else {
            if (data.message != '') {
                console.log(data);
                socket.emit('chat message', data);
                socket.broadcast.emit('display', data);
            }
        }
    })

    socket.on('disconnect', () => {
        console.log('a user has disconnected')
        // tell other users you have left
        io.emit('chat message', { message: `a user has left`, name: '' });
    })

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    })

    socket.on('update user name', (user) => {
        userNamesArray.push(user.name);
        // creates an object where each userName has unique socketId
        userObj[user.name] = socket.id;
        // assigns unique socket.id to each users
        user.socketId = socket.id;
        socket.broadcast.emit('user update', user)
        // socket.emit('userList', userNamesArray);
    })
})

http.listen(port, () => {
    console.log(`Listening Open http://localhost:${port} to view`)
})