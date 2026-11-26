import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';
import { createInitialState } from '../reducers/initialState';

export const createGameStore = () => createStore(reducer, createInitialState(), applyMiddleware(thunk));
