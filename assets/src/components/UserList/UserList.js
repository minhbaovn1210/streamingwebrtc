import React from 'react';
import css from './UserList.css';

import { Table, Divider, Tag } from 'antd';

const columns = [{
  title: 'Session ID',
  dataIndex: 'id',
  key: 'id'
}, {
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="javascript:;">To Do</a>
    </span>
  ),
}];

export default class UserList extends React.Component {
    render() {
        return(
            <div>
                <h2>USER LIST</h2>
                <Table rowKey={record => record.id} columns={columns} dataSource={this.props.userList} style={{width: '600px'}}/>
            </div>
        )
    }
}