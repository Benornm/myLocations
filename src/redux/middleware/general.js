import {
  deleteAllFromCategory,
  setChosenItem,
  addNewLocation,
  setAddAndEditMode } from '../actions/locations';
import * as constants from '../constants/actionTypes';

const middleware = ({dispatch}) => next => action => {
  switch(action.type){
    case constants.DELETE_CATEGORY:
      dispatch(deleteAllFromCategory(action.payload.id));
      break;

    case constants.DELETE_LOCATION:
      dispatch(setAddAndEditMode(false, false));
      break;

    case constants.ADD_LOCATION:
      const { location } = action.payload;
      const {name, subtitle , coordinates} = location;

      dispatch(setChosenItem(null, false));
      if(Array.isArray(location.categoryId)){
        location.categoryId.map( (catId) =>
          dispatch(addNewLocation({
            name,
            subtitle ,
            categoryId: catId,
            coordinates
          })));
      } else {
        dispatch(addNewLocation(location));
      }
      break;

    default:
      break;
  }
  return next(action);
};

export default middleware;
