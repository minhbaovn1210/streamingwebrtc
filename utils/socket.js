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
            peers: [],
            sharing: false
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
                break;
            }
        }
    })
    socket.on('broadcast_host_share_stream', (roomID,callback) => {
        for (let i = 0; i < room.length; i++) {
            if (room[i].id == roomID) {
                room[i].sharing = true;
                room[i].peers.forEach(p => {
                    socket.emit('peer_connect', {id: p.id, roomID, type: 'host_create'})
                    p.emit('peer_connect', {id: socket.id, roomID, type: 'client_create'})
                })
                break;
            }
        }
    })
    socket.on('new_peer_get_stream', roomID => {
        for (let i = 0; i < room.length; i++) {
            if (room[i].id == roomID) {
                if (room[i].sharing) {
                    room[i].host.emit('peer_connect', {id: socket.id, roomID, type: 'host_create'})
                    socket.emit('peer_connect', {id: room[i].host.id, roomID, type: 'client_create'})
                }
                break;
            }
        }
    })
    socket.on('peer_connect', (data, callback) => {
        for(let i = 0; i < room.length;i++) {
            if (room[i].id == data.roomID) {
                if (data.type == 'stop') {
                    room[i].sharing = false;
                    room[i].peers.forEach(peer => {
                        peer.emit('peer_connect', data, callback);
                    })
                }
                else if (data.id == room[i].host.id) {
                    data.id = socket.id;
                    room[i].host.emit('peer_connect', data, callback);
                }
                else {
                    for (let y = 0; y < room[i].peers.length; y++) {
                        if (room[i].peers[y].id == data.id) {
                            data.id = room[i].host.id;
                            room[i].peers[y].emit('peer_connect', data, callback);
                            break;
                        }
                    }
                }
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
                    room[i].sharing = false;
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
                        room[i].host.emit('peer_close', socket.id)
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
                room[i].sharing = false;
                room[i].peers.forEach(peer => {
                    peer.emit('peer_connect', {type: 'stop'});
                })
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
                    room[i].host.emit('peer_close', socket.id)
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