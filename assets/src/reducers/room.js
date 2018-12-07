const initState = {
    currentRoom: '',
    roomList: []
}

export default (state = initState, action) => {
    switch(action.type) {
        case 'LOAD_ROOM':
            return {
                currentRoom: '',
                roomList: action.payload
            }
        case 'CREATE_ROOM':
            return {
                currentRoom: action.payload.id,
                roomList: state.roomList.indexOf(action.payload) == -1 ? state.roomList.concat([action.payload]) : state.roomList
            }
        case 'NOTIFY_NEW_ROOM_HAS_BEEN_CREATED':
            return {
                ...state,
                roomList: state.roomList.indexOf(action.payload) == -1 ? state.roomList.concat([action.payload]) : state.roomList
            }
        case 'JOIN_ROOM':
            const newRoomListJoinRoom = state.roomList.map(room => {
                if (room.id == action.payload.id) {
                    return {
                        ...room,
                        peers: room.peers.indexOf(action.payload.peer) == -1 ? room.peers.concat([action.payload.peer]) : room.peers
                    }
                }
                return room
            })
            return {
                ...state,
                currentRoom: action.payload.id,
                roomList: newRoomListJoinRoom
            }
        case 'NOTIFY_NEW_PEER_JOINED':
            const newRoomListNotifyJoinRoom = state.roomList.map(room => {
                if (room.id == action.payload.id) {
                    return {
                        ...room,
                        peers: room.peers.indexOf(action.payload.peer) == -1 ? room.peers.concat([action.payload.peer]) : room.peers
                    }
                }
                return room
            })
            return {
                ...state,
                roomList: newRoomListNotifyJoinRoom
            }
        case 'NOTIFY_USER_LEFT_ROOM':
            const {roomID, peerID, removeRoom, newHost} = action.payload;
            if (removeRoom == true) {
                return {
                    ...state,
                    roomList: state.roomList.filter(r => r.id != roomID)
                }
            }
            else {
                const newRoomListNotifyUserLeftRoom = state.roomList.map(r => {
                    if (r.id == roomID) {
                        if (newHost != false) {
                            r.peers.shift()
                        }
                        return {
                            ...r,
                            peers: newHost != false ? r.peers : r.peers.filter(peer => peer.id != peerID),
                            host: newHost != false ? newHost : r.host
                        }
                    }
                    return {
                        ...r
                    }
                })
                return {
                    ...state,
                    roomList: newRoomListNotifyUserLeftRoom
                }
            }
        default:
            return state;
    }
}