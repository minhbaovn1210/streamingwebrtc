import {combineReducers} from 'redux';
import user from './user';
import room from './room';
const reducers = combineReducers({
    user,
    room
})

export default reducers;