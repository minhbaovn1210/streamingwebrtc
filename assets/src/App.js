import React, {Component} from 'react';
import Home from './containers/Home/Loadable';
import Room from './containers/Room/Loadable';
import Login from './components/Login/Login';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import 'antd/dist/antd.css';

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/home" component={Home} />
                    <Route path="/room/" component={Room} />
                    <Route path="/" component={Login} />
                </Switch>
            </BrowserRouter>
        )
    }
}