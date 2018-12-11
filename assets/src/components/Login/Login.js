import React,{Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {loginAction, verifyAction} from '../../actions/user';
import { Input, Button } from 'antd';
import socketClient from '../../utils/socketClient';
import './style.css';
import logo from './FPT.png';

class Login extends Component {
    state = {
        name: ''
    }
    componentDidMount() {
        let array = window.location.href.split('/');
        if (array[array.length - 1] != "") {
            this.setState({
                name: array[array.length - 1]
            })
        }
    }
    render(){
        return (
            <React.Fragment>
                <div className="box_login">
                    <img src={logo}/>
                    <h1>Welcome</h1>
                    <Input 
                        value={this.state.name} 
                        onChange={(e) => this.setState({name: e.target.value})} 
                        size="small" 
                        style={{width: '100px'}}
                        className="input_text"
                        placeholder="Your name"
                    />
                    <Link to="/home" className="a-login">
                        <div className="type-1">
                            <div>
                                <button className="btn btn-1" onClick={() => this.props.login(this.state.name, socketClient.emitRegisterNewUser)}>
                                    <span className="txt">Tham gia</span>
                                    <span className="round"><i className="fa fa-chevron-right"></i></span>
                                </button>
                            </div>
                        </div>
                    </Link>
                </div>
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