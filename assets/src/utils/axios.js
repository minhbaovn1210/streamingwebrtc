import axios from 'axios';
import {backend_url} from './constants';
export default (endpoint, method = 'GET', body, headers) => {
    return axios({
        method,
        url: `${backend_url}/${endpoint}`,
        data: body,
        headers
    }).catch(err => {
        console.log(err);
    })
}