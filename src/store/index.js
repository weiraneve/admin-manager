import {createStore, applyMiddleware} from 'redux'
import rootReducer from './reducer'
 import thunk from 'redux-thunk'

const rootStore = createStore(rootReducer, applyMiddleware(thunk));

export default rootStore