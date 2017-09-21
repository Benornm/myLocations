import { combineReducers } from 'redux-immutablejs';
import categories from './categories';
import locations from './locations';
import locationsList from './locationsList';





const rootReducer = combineReducers({
  categories,
  locations,
  locationsList
});

export default rootReducer;