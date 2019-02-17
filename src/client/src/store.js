import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './reducers';

const inProduction = process.env.NOD_ENV !== 'development';

let middleware;
if (!inProduction) {
  middleware = applyMiddleware(thunk, logger);
} else {
  middleware = applyMiddleware(thunk);
}

export default createStore(reducer, middleware);
