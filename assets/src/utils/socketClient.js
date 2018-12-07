import socket from 'socket.io-client';
import {
    clientAddIceCandidate, 
    answer,
    hostCreateConnection,
    clientCreateConnection,
    stopStream,
    closePeer
} from './stream';
const io = socket(`${process.env.BACKEND_IP}:${process.env.BACKEND_PORT}`);
// const io = socket('https://scc-live.herokuapp.com/')

const socketClient = {
    onNotifyNewUserConnected: (data, callback) => {
        io.on('notify_new_user_connected', (user) => {
            callback(user)
        });
    },
    onNotifyUserDisconnected: (data, callback) => {
        io.on('notify_user_disconnected', id => {
            callback(id)
        })
    },
    emitRegisterNewUser: (name, callback) => {
        io.emit('register_new_user', name, callback)
    },
    emitLoadUsers: (data, callback) => {
        io.emit('load_users', data, callback)
    },
    emitLoadRooms: (data, callback) => {
        io.emit('load_rooms', data, callback)
    },
    onNotifyNewRoomHasBeenCreated: (data, callback) => {
        io.on('notify_new_room_has_been_created', (newRoom) => {
            callback(newRoom);
        })
    },
    emitCreateRoom: (id, callback) => {
        io.emit('create_room', id, callback)
    },
    onNotifyRoomClosed: (data, callback) => {
        io.on('notify_room_closed', id => {
            callback(id)
        })
    },
    emitJoinRoom: (roomID, callback) => {
        io.emit('join_room', roomID, callback)
    },
    onNotifyNewUserJoinedRoom: (data, callback) => {
        io.on('notify_new_user_joined_room', ({id, peer}) => {
            callback({id,peer})
        });
    },
    emitLeftRoom: (roomID, callback) => {
        io.emit('left_room', roomID, callback)
    },
    onNotifyUserLeftRoom: (data, callback) => {
        io.on('notify_user_left_room', ({
            roomID, peerID, removeRoom, newHost
        }) => {
            callback({
                roomID, peerID, removeRoom, newHost
            })
        })
    },
    emitBroadcastHostShareStream: (roomID) => {
        io.emit('broadcast_host_share_stream', roomID, null);
    },
    emitNewPeerGetStream: (roomID) => {
        io.emit('new_peer_get_stream', roomID);
    },
    emitToPeer: (data, callback) => {
        io.emit('peer_connect', data, callback)
    },
    onPeerLeftMyRoom: () => {
        io.on('peer_close', (userID) => {
            closePeer(userID)
        })
    },
    onListenPeer: () => {
        io.on('peer_connect', (data, callback) => {
            switch(data.type) {
                case 'host_create':
                    hostCreateConnection(data.id, data.roomID)
                    break;
                case 'client_create':
                    clientCreateConnection(data.id, data.roomID)
                    break;
                case 'add':
                    clientAddIceCandidate(data.id, data.candidate)
                    break;
                case 'offer':
                    answer(data.description, data.id, callback)
                    break;
                case 'stop':
                    stopStream()
                    break;
                default:
                    return;
            }
        })
    }
}

export default socketClient;