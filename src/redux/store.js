import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers/root';
import general from './middleware/general';
import Immutable from 'immutable';
import { autoRehydrate } from 'redux-persist-immutable'


const storeEnhancers = compose(
  applyMiddleware(
    // createActionBuffer(REHYDRATE),
    general
  ),
  autoRehydrate()
);

const store = createStore(
  rootReducer,
  Immutable.fromJS({}),
  storeEnhancers
);

export default store;
