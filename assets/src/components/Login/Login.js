import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginAction, verifyAction } from '../../actions/user';
import { Input, Button } from 'antd';
import socketClient from '../../utils/socketClient';
import './style.css';

class Login extends Component {
    state = {
        name: ''
    }
    componentDidMount() {

    }

    onChange = (e) => {
        this.setState({ name: e.target.value })
    }

    render() {
        return (
            <React.Fragment>
                <div className="box_login">
                    <h1>Login Page</h1>
                    <Input
                        value={this.state.name}
                        onChange={this.onChange}
                        size="small"
                        style={{ width: '100px' }}
                        className="input_text"
                    />
                    <Link to="/home">
                        <Button onClick={() => this.props.login(this.state.name, socketClient.emitRegisterNewUser)}>Click to login</Button>
                    </Link>
                </div>
            </React.Fragment >
        )
    }
}

const mapStateToProps = state => ({
    user: state.user
})
const mapDispatchToProps = dispatch => {
    return {
        login: (name, emitRegisterNewUser) => {
            dispatch(loginAction(name, emitRegisterNewUser))
        },
        verify: () => {
            dispatch(verifyAction())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);