import React, {Component} from 'react';
import {connect} from 'react-redux';
import {verifyAction} from '../../actions/user';
import socketClient from '../../utils/socketClient';
import {Redirect} from 'react-router-dom';
import {Icon, Checkbox, Input} from 'antd';
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
        screen: false,
        isShowUserList: false,
        EXTENSION_ID: 'deifcdeanbcgmdahmihammgpkdeddboi'
    }
    componentDidMount() {
        socketClient.onListenPeer();
        socketClient.emitNewPeerGetStream(this.props.room.currentRoom);
        socketClient.onPeerLeftMyRoom();
    }
    onChangeChooseScreen = (e) => {
        this.setState(pre => ({
            screen: !pre.screen
        }))
    }
    onChangeChooseCamera = (e) => {
        this.setState(pre => ({
            video: !pre.video
        }))
    }
    render() {
        const {name, id} = this.props.user;
        if (!name) {
            return <Redirect to={{pathname:"/"}}/>
        }
        const {room} = this.props;
        const currentRoom = (room.roomList.filter(r => r.id == room.currentRoom))[0] || null;
        const {video, screen, isShowUserList, EXTENSION_ID} = this.state;
        return(
            <div className="room">
                <h1>Live</h1>
                <div>
                {!window.location.href.includes("/host") &&
                <a href={"/?name=" + name} 
                    onClick={() => {
                        stopStream()
                        socketClient.emitLeftRoom(currentRoom.id, null);
                    }}
                >
                <Icon className="left-icon" type="left-square" theme="filled"/>
                </a>}
                {window.location.href.includes("/host") &&
                <React.Fragment>
                <a href={"/?name=" + name} 
                    onClick={() => {
                        stopStream()
                        hostStopStream(currentRoom.id)
                        socketClient.emitLeftRoom(currentRoom.id, null);
                    }}
                >
                <Icon className="left-icon" type="left-square" theme="filled" />
                </a>
                <form className="room-form">
                    <div className="checkbox">
                        <Checkbox checked={this.state.video} onChange={this.onChangeChooseCamera}>Camera</Checkbox><br/>
                        <Checkbox checked={this.state.screen} onChange={this.onChangeChooseScreen}>Screen</Checkbox>
                    </div>
                    <div className="camera-button">
                        <Icon type="video-camera" theme="filled" 
                            onClick={() => hostGetStream(video, screen, EXTENSION_ID)}
                        />
                        <Icon type="caret-right" 
                        
                            onClick={() => shareStream(currentRoom.id)}
                        />
                        <Icon type="close" 
                            onClick={() => {
                                stopStream();
                                hostStopStream(currentRoom.id);
                            }}
                        />
                    </div>
                    {
                        window.chrome.runtime && 
                        <div className="chrome-extension">
                        <Input 
                            value={EXTENSION_ID}
                            onChange={(e) => this.setState({EXTENSION_ID: e.target.value})} 
                            placeholder={'Extension ID'}
                        /><br />
                        <a target="_blank" href="https://drive.google.com/file/d/1RRbAtmcspVSuzn4cX3ZwAdeKQTO7T0VX/view?usp=sharing">Click to download Extension</a>
                        </div>
                    }
                </form>
                </React.Fragment>}
                </div>
                <div className="my-video">
                    <video id="myVideo" className="subScreen" autoPlay></video>
                    <video id="myScreen" className="fullScreen" autoPlay></video>
                </div>
                <div>
                    <Icon type="team" className="icon-list-user"
                        onMouseOver={() => {this.setState({isShowUserList: true})}}
                        onMouseOut={() => {this.setState({isShowUserList: false})}}
                    />
                    <div className="user-in-room" style={{display: isShowUserList ? 'block' : 'none'}}>
                        {currentRoom.host.id == id && 
                            <button className="my-account" key={id}>{name} (me)</button>
                        }
                        {currentRoom.host.id != id && 
                            <React.Fragment>
                            <button className="my-account" key={id}>{name} (me)</button>
                            <button key={currentRoom.host.id}>{currentRoom.host.name} (host)</button>
                            </React.Fragment>
                        }
                        {currentRoom && currentRoom.peers.map(c => {
                            if (c.name != name) {
                                return (
                                    <button key={c.id}>{c.name}</button>
                                )}
                            }
                        )}
                    </div>
                </div>
            </div>
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