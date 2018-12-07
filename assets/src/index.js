import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers/index';
import {Provider} from 'react-redux';
import {createLogger} from 'redux-logger';
import * as serviceWorker from './serviceWorker';

const logger = createLogger();
const store = createStore(
    reducers, 
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    // applyMiddleware(thunk, logger)
    applyMiddleware(thunk)
);

const Main = () => (
    <Provider store={store}>
        <App />
    </Provider>  
)

ReactDOM.render(<Main />, document.getElementById('root'));
serviceWorker.unregister();
