//import axios from '../utils/axios';

export const loadUserListAction = (users) => (dispatch) => {
    dispatch({
        type: 'LOAD_USER_LIST',
        payload: users
    })
}
export const newUserAction = (user) => dispatch => {
    dispatch({
        type: 'NEW_USER',
        payload: user
    })
}
export const notifyUserDisconnectedAction = (id) => dispatch => {
    dispatch({
        type: 'NOTIFY_USER_DISCONNECTED',
        payload: id
    })
}
export const loginAction = (name, emitRegisterNewUser) => (dispatch) => {  
    emitRegisterNewUser(name, function(name, id) {
        dispatch({
            type: 'LOGIN',
            payload: {name, id}
        })
    });
}

export const logoutAction = () => dispatch => {
    dispatch({
        type: 'LOGOUT'
    })
}

export const verifyAction = () => dispatch => {
    // const token = localStorage.getItem("token");
    // axios('user/verifytoken', 'GET', null, {
    //     "Authorization": "Bearer " + token
    // }).then(res => {
    //     // eslint-disable-next-line
    //     const data = res.data.data;
    //     dispatch({
    //         type: 'VERIFY',
    //         payload: token
    //     })
    // }).catch(err => {console.log('Wrong token!')})
    
}