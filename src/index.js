import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { configure } from 'radiks';


const apiServer = 'http://localhost:3001';

const middleware = [ReduxThunk, logger];
let store = createStore(
    reducers,
    {},
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
);
middleware.push(logger);
configure({
    apiServer
});

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Route
                path='/'
                render={props => <App {...props} />}
            />
        </Router>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
registerServiceWorker();