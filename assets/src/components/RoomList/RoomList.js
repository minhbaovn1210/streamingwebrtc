import React from 'react';
import css from './RoomList.css';
import {Link} from 'react-router-dom';
import { Table, Divider, Tag } from 'antd';

const columns = [{
  title: 'Room ID',
  dataIndex: 'id',
  key: 'id'
}, {
  title: 'Host',
  dataIndex: 'host.name',
  key: 'host',
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => {
    let urlRoom = "/room/" + record.id;
    return (
      <span>
        <Link to={urlRoom} onClick={record.join}>Join</Link>
      </span>
    )
  },
}];

export default class RoomList extends React.Component {
    render() {
        return(
            <div>
                <h2>ROOM LIST</h2>
                <Table 
                rowKey={record => record.id} columns={columns} 
                dataSource={this.props.roomList} 
                style={{width: '600px'}}/>
            </div>
        )
    }
}