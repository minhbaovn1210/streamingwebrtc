const initState = {
    name: null,
    id: null,
    userList: []
}
export default (state = initState, action) => {
    switch(action.type) {
        case 'LOAD_USER_LIST':
            return {
                ...state,
                userList: action.payload
            }
        case 'NEW_USER':
            return {
                ...state,
                userList: state.userList.indexOf(action.payload) == -1 ? state.userList.concat([action.payload]) : state.userList
            }
        case 'NOTIFY_USER_DISCONNECTED':
            return {
                ...state,
                userList: state.userList.filter(u => u.id != action.payload)
            }
        case 'LOGIN':
            return {
                ...state,
                name: action.payload.name,
                id: action.payload.id
            }
        case 'LOGOUT':
            return {
                name: null,
                id: null,
                userList: []
            }
        case 'VERIFY':
            return {
                token: action.payload
            }
        default:
            return state;
    }
}