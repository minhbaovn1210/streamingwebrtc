import React from 'react';
import './RoomList.css';
import {Link} from 'react-router-dom';

export default class RoomList extends React.Component {
    render() {
        return(
            <React.Fragment>
                <h2>ROOM LIST</h2>
                <div className="room-content">
                {this.props.roomList.map((room, index) => (
                  <Link key={index} to={'/room/' + room.id} onClick={room.join}>
                  <div className="room-item">
                    <img src="https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.0-0/s180x540/47433841_338675586687850_8379925538927542272_n.png?_nc_cat=109&_nc_oc=AWO7b_5sKPzK3S5bGNKI1Lgmy0L-76IussLZjEQEwNZ9AF5F6wHcxGsd13xgLw&_nc_ht=scontent.fsgn2-4.fna&oh=28dbf222ae5fc04f87bc292a8b3eb69c&oe=5C9848F8"></img>
                    <div>{room.host.name}</div>
                  </div>
                  </Link>
                ))}
                </div>
            </React.Fragment>
        )
    }
}