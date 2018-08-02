import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import registerServiceWorker from './registerServiceWorker'
import { createEpicMiddleware } from 'redux-observable'
import { composeWithDevTools } from 'redux-devtools-extension/logOnly'
import { rootEpic } from './epics'

const epicMiddleware = createEpicMiddleware()

const composeEnhancers = composeWithDevTools({})

const store = createStore(reducer, composeEnhancers(applyMiddleware(epicMiddleware)))

epicMiddleware.run(rootEpic)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();