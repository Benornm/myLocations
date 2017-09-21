import Immutable from 'immutable';
import * as actionTypes from '../constants/actionTypes';

const initialState = Immutable.fromJS({
  addMode: false,
  editMode:false,
  snackBarOpen:false,
  chosenItem: null,
  coordinates:{lat: 32.075565, lng: 34.775729},
});

const locations = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_CHOSEN_ITEM: {
      const {chosenItem , editMode} = action.payload;
      return state.set('chosenItem', chosenItem)
                  .set('editMode', editMode)
                  .set('addMode',false)
                  .set('coordinates',chosenItem? chosenItem.coordinates : state.get('coordinates'));
    }

    case actionTypes.SET_ADD_MODE: {
      return state.set('addMode',action.payload.addMode).set('chosenItem',null);
    }

    case actionTypes.SET_ADD_AND_EDIT_MODE: {
      return state.set('addMode',action.payload.addMode).set('editMode',false,action.payload.editMode);
    }

    case actionTypes.CHANGE_MAP_LOCATION: {
      return state.set('coordinates',action.payload.coordinates);
    }

    default:
      return state;
  }
};

export default locations;