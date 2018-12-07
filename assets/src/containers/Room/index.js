import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {verifyAction} from '../../actions/user';
import socketClient from '../../utils/socketClient';
import {Button} from 'antd';
import {
    hostGetStream, 
    stopStream,
    shareStream,
    hostStopStream
} from '../../utils/stream';
import './Room.css';
class Room extends Component {
    state = {
        video: true,
        screen: false
    }
    componentDidMount() {
        socketClient.onListenPeer();
        socketClient.emitNewPeerGetStream(this.props.room.currentRoom);
        socketClient.onPeerLeftMyRoom();
    }
    onChangeScreen = (e) => {
        switch(e.target.value) {
            case 'video':
                this.setState({
                    video: true,
                    screen: false
                })
                break;
            case 'screen':
                this.setState({
                    video: false,
                    screen: true
                })
                break;
            case 'both':
                this.setState({
                    video: true,
                    screen: true
                })
                break;
            default:
                this.setState({
                    video: false,
                    screen: false
                })
        }
    }
    render() {
        const {room} = this.props;
        const currentRoom = (room.roomList.filter(r => r.id == room.currentRoom))[0] || null;
        const {video, screen} = this.state;
        return(
            <React.Fragment>
                <div>ROOM</div>
                <div>
                {!window.location.href.includes("/host") &&
                <Link to="/home" 
                    onClick={() => {
                        stopStream()
                        socketClient.emitLeftRoom(currentRoom.id, null);
                    }}
                >
                <Button>Back to Home</Button>
                </Link>}
                {window.location.href.includes("/host") &&
                <React.Fragment>
                <Link to="/home" 
                    onClick={() => {
                        stopStream()
                        hostStopStream(currentRoom.id)
                        socketClient.emitLeftRoom(currentRoom.id, null);
                    }}
                >
                <Button>Back to Home</Button>
                </Link>
                <form>
                    <input onChange={this.onChangeScreen} 
                        type="radio" name="getScreen" value="video" 
                        checked={video == true && screen == false}/> Video
                    <input onChange={this.onChangeScreen} 
                        type="radio" name="getScreen" value="screen"
                        checked={video == false && screen == true}/> Screen
                    <input onChange={this.onChangeScreen} 
                        type="radio" name="getScreen" value="both"
                        checked={video == true && screen == true}/> Both
                    <Button 
                        onClick={() => hostGetStream(video, screen)}
                    >Get Stream</Button>
                    <Button
                        onClick={() => shareStream(currentRoom.id)}
                    >Share to all users</Button>
                    <Button
                        onClick={() => {
                            stopStream();
                            hostStopStream(currentRoom.id);
                        }}
                    >Stop Stream
                    </Button>
                </form>
                </React.Fragment>}
                </div>
                <div className="my-video">
                    <video id="myVideo" className="subScreen" autoPlay></video>
                    <video id="myScreen" className="fullScreen" autoPlay></video>
                </div>
                <ul>
                    <li><b>{currentRoom != null ? currentRoom.host.name : ''}</b></li>
                    {currentRoom != null && currentRoom.peers.length > 0 && currentRoom.peers.map(c => (
                        <li key={c.id}>{c.name}</li>
                    ))}
                </ul>
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
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Room);