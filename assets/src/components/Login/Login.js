import React,{Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {loginAction, verifyAction} from '../../actions/user';
import { Input, Button } from 'antd';
import socketClient from '../../utils/socketClient';

class Login extends Component {
    state = {
        name: ''
    }
    componentDidMount() {
        //this.props.verify();
    }
    render(){
        // if (this.props.user.token) {
        //     return <Redirect to="/"/>
        // }
        return (
            <React.Fragment>
                <div>Login Page</div>
                Input name:&nbsp;
                <Input 
                    value={this.state.name} 
                    onChange={(e) => this.setState({name: e.target.value})} 
                    size="small" 
                    style={{width: '100px'}}
                />
                &nbsp;<Link to="/home"><Button onClick={() => this.props.login(this.state.name, socketClient.emitRegisterNewUser)}>Click to login</Button></Link>
            </React.Fragment>
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