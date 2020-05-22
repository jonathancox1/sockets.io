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
        console.log(data);
        if (data.typing == true) {
            socket.broadcast.emit('display', data);
        }
        else {
            if (data.message != '') {
                socket.emit('chat message', data);
                socket.broadcast.emit('display', data);
            }
        }
    })

    socket.on('disconnect', () => {
        console.log('a user has disconnected')
        io.emit('chat message', { message: `someone has left the chat` });
        userNamesArray = userNamesArray.filter(user => {
            return user != userObj[socket.id];
        })
        console.log(userNamesArray)
        io.emit('userList', userNamesArray);


        // tell other users you have left
    })

    socket.on('chat message', (data) => {
        io.emit('chat message', data);
    })

    socket.on('update user name', (user) => {
        console.log(user);
        userNamesArray.push(user.name);
        // creates an object where each userName has unique socketId
        userObj[socket.id] = user.name;
        // assigns unique socket.id to each users
        let id = socket.id;
        user.socketId = id;
        socket.broadcast.emit('user update', user)
        // socket.emit('userList', userNamesArray);
        console.log(userNamesArray, userObj, user);
        io.emit('usersList', userNamesArray);
    })
})

http.listen(port, () => {
    console.log(`Listening Open http://localhost:${port} to view`)
})