import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {verifyAction, 
    loadUserListAction, 
    newUserAction,
    notifyUserDisconnectedAction
} from '../../actions/user';
import {
    loadRoomListAction,
    createRoomAction,
    notifyNewRoomHasBeenCreatedAction,
    joinRoomAction,
    notifyUserLeftRoomAction,
    notifyNewPeerJoinedRoomAction
} from '../../actions/room';
import {Button} from 'antd';
import socketClient from '../../utils/socketClient';
import UserList from '../../components/UserList/UserList';
import RoomList from '../../components/RoomList/RoomList';
import uuidv1 from 'uuid/v1';
// import {clientConnect} from '../../utils/stream';
class Home extends Component {
    constructor() {
        super()
        this.generateRoomID = uuidv1();
    }
    componentDidMount() {
        //this.props.verify();
        socketClient.onNotifyNewUserConnected(null, this.props.newUser);
        socketClient.emitLoadUsers(null, this.props.loadUserList);
        socketClient.emitLoadRooms(null, this.props.loadRoomList);
        socketClient.onNotifyNewRoomHasBeenCreated(null, this.props.notifyNewRoomHasBeenCreated);
        socketClient.onNotifyUserDisconnected(null, this.props.notifyUserDisconnected);
        socketClient.onNotifyUserLeftRoom(null, this.props.notifyUserLeftRoom);
        socketClient.onNotifyNewUserJoinedRoom(null, this.props.notifyNewPeerJoinedRoom);
    }
    render() {
        // if (!this.props.user.token) {
        //     return <Redirect to="/login"/>
        // }
        const urlRoom = "/room/" + this.generateRoomID + "/host";
        const userID = this.props.user.id;
        const roomListWithAction = this.props.room.roomList.map(r => ({
            ...r,
            join: () => {
                    socketClient.emitJoinRoom(r.id, this.props.joinRoom)
                    //clientConnect(userID, r.id)
                }
        }))
        return(
            <React.Fragment>
                <h1>HOME</h1>
                <Link to={urlRoom} onClick={() => socketClient.emitCreateRoom(this.generateRoomID, this.props.createRoom)}>
                    <Button>Create Room</Button>
                </Link>
                <hr/>
                <RoomList roomList={roomListWithAction}/>
                <UserList userList={this.props.user.userList}/>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        room: state.room
    }
}
const mapDispatchToProps = dispatch => {
    return {
        verify: () => {
            dispatch(verifyAction())
        },
        loadUserList: (users) => {
            dispatch(loadUserListAction(users))
        },
        newUser: (user) => {
            dispatch(newUserAction(user))
        },
        notifyUserDisconnected: (id) => {
            dispatch(notifyUserDisconnectedAction(id))
        },
        loadRoomList: (rooms) => {
            dispatch(loadRoomListAction(rooms))
        },
        createRoom: (newRoom) => {
            dispatch(createRoomAction(newRoom))
        },
        notifyNewRoomHasBeenCreated: (newRoom) => {
            dispatch(notifyNewRoomHasBeenCreatedAction(newRoom))
        },
        joinRoom: (id, peer) => {
            dispatch(joinRoomAction(id, peer))
        },
        notifyUserLeftRoom: ({roomID, peerID, removeRoom, newHost}) => {
            dispatch(notifyUserLeftRoomAction({roomID, peerID, removeRoom, newHost}))
        },
        notifyNewPeerJoinedRoom: (id, peer) => {
            dispatch(notifyNewPeerJoinedRoomAction(id, peer))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);