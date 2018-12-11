import React from 'react';
import './UserList.css';

export default class UserList extends React.Component {
    render() {
        return(
            <React.Fragment>
                <h2>USER LIST</h2>
                <div className="user-content">
                {this.props.userList.map((user,index) => (
                  <button key={index}>{user.name}</button>
                ))}
                </div>
            </React.Fragment>
        )
    }
}