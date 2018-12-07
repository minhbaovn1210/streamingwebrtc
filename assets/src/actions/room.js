
export const loadRoomListAction = (rooms) => dispatch => {
    dispatch({
        type: 'LOAD_ROOM',
        payload: rooms
    })
}

export const notifyNewRoomHasBeenCreatedAction = (newRoom) => dispatch => {
    dispatch({
        type: 'NOTIFY_NEW_ROOM_HAS_BEEN_CREATED',
        payload: newRoom
    })
}
export const createRoomAction = (newRoom) => dispatch => {
    dispatch({
        type: 'CREATE_ROOM',
        payload: newRoom
    })
}

export const joinRoomAction = ({id, peer}) => dispatch => {
    dispatch({
        type: 'JOIN_ROOM',
        payload: {id, peer}
    })
}

export const notifyNewPeerJoinedRoomAction = ({id, peer}) => dispatch => {
    dispatch({
        type: 'NOTIFY_NEW_PEER_JOINED',
        payload: {id, peer}
    })
}

export const notifyUserLeftRoomAction = ({roomID, peerID, removeRoom, newHost}) => dispatch => {
    dispatch({
        type: 'NOTIFY_USER_LEFT_ROOM',
        payload: {roomID, peerID, removeRoom, newHost}
    })
}