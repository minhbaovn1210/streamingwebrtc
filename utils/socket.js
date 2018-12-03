var user = [],
    room = [];
// user have more socket (add socket.name)
// one room have id, host, peers(socketArray)
module.exports = (socket) => {
    socket.on('register_new_user', (name, callback) => {
        socket.name = name;
        user.push(socket)
        socket.broadcast.emit('notify_new_user_connected', {name, id: socket.id})
        callback(name,socket.id)
        console.log("new user has connected, total ", user.length);
    })
    socket.on('load_users', (data, callback) => {
        var result = [];
        for (let i = 0; i < user.length; i++) {
            if (user[i] != socket) {
                result.push({
                    id: user[i].id,
                    name: user[i].name
                })
            }
        }
        callback(result)
    })
    socket.on('load_rooms', (data, callback) => {
        callback(room.map(r => ({
            ...r,
            host: {id: r.host.id,name: r.host.name},
            peers: r.peers.map(peer => ({id: peer.id, name: peer.name}))
        })))
    })
    socket.on('create_room', (id, callback) => {
        room.push({
            id,
            host: socket,
            peers: []
        })
        let data = {
            id,
            host: {id: socket.id,name: socket.name},
            peers: []
        };
        socket.broadcast.emit('notify_new_room_has_been_created', data)
        callback(data)
        console.log('new room has been created, total: ', room.length)
    })
    socket.on('join_room', (roomID, callback) => {
        for (let i = 0; i < room.length; i++) {
            if (room[i].id == roomID) {
                let data = {
                    id: roomID,
                    peer: {
                        id: socket.id,
                        name: socket.name
                    }
                }
                room[i].peers.push(socket)
                callback(data)
                socket.broadcast.emit('notify_new_user_joined_room', data)
                
                room[i].host.emit('new_peer', socket.id)

                break;
            }
        }
    })
    socket.on('peer_connect', (data, callback) => {
          for(let i = 0; i < user.length;i++) {
              if (user[i].id == data.id) {
                  console.log(user[i].name)
                  user[i].emit('peer_connect', data, callback);
                  break;
              }
          }
    })
    socket.on('left_room', (roomID, callback) => {
        let result ={
            roomID,
            peerID: socket.id,
            removeRoom: false,
            newHost: false
        }
        let roomLength = room.length;
        for (let i = 0; i < roomLength; i++) {
            if (room[i].id == roomID) {
                if (room[i].host == socket) {
                    if (room[i].peers.length > 0) {
                        room[i].host = room[i].peers[0];
                        result.newHost = {id: room[i].peers[0].id, name: room[i].peers[0].name};
                        room[i].peers.shift();
                    }
                    else {
                        room[i] = room[roomLength - 1];
                        room.pop();
                        result.removeRoom = true;
                        console.log('a room has been removed, total: ', room.length)
                    }
                }
                else {
                    let peerIndex = room[i].peers.indexOf(socket);
                    if (peerIndex >= 0) {
                        room[i].peers[peerIndex] = room[i].peers[room[i].peers.length - 1];
                        room[i].peers.pop();
                    }
                }
                break;
            }
        }
        socket.broadcast.emit('notify_user_left_room', result);
        socket.emit('notify_user_left_room', result);
    })
    socket.on('disconnect', () => {
        //Remove peer in room
        let result ={
            roomID: '',
            peerID: socket.id,
            removeRoom: false,
            newHost: false
        }
        let roomLength = room.length;
        for (let i = 0; i < roomLength; i++) {
            if (room[i].host == socket) {
                if (room[i].peers.length > 0) {
                    room[i].host = room[i].peers[0];
                    result.newHost = {id: room[i].peers[0].id, name: room[i].peers[0].name};
                    room[i].peers.shift();
                }
                else {
                    room[i] = room[roomLength - 1];
                    room.pop();
                    result.removeRoom = true;
                    console.log('a room has been removed, total: ', room.length)
                }
                break;
            }
            else {
                let peerIndexInRoom = room[i].peers.indexOf(socket);
                if (peerIndexInRoom >= 0) {
                    result.roomID = room[i].id;
                    room[i].peers[peerIndexInRoom] = room[i].peers[room[i].peers.length - 1];
                    room[i].peers.pop();
                    break;
                }
            }
        }
        socket.broadcast.emit('notify_user_left_room', result);
        //Remove peer in user
        let userLength = user.length;
        let peerIndex = user.indexOf(socket);
        if (peerIndex >= 0) {
            user[peerIndex] = user[userLength - 1];
            user.pop();
            userLength--;
            socket.broadcast.emit('notify_user_disconnected', socket.id);
            console.log('a user has logged out, total: ', userLength);
        }
    })
}