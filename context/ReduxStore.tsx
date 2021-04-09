import React from 'react';
import { Provider } from 'react-redux';
import { Children } from '@components/types';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer, rootSaga } from '@lions-mane/web3-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const reducers = combineReducers({
    web3Redux: rootReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducers, composeWithDevTools(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga);

const StoreProvider: React.FC = ({ children }: Children) => <Provider store={store}>{children}</Provider>;

export default StoreProvider;
