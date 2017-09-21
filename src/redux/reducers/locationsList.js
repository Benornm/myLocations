import Immutable from 'immutable';
import * as actionTypes from '../constants/actionTypes';
import { findIndex, remove } from 'lodash';

const initialState = Immutable.fromJS({
  id: 1,
  locationsData: [],
});

const locationsList = (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.ADD_NEW_LOCATION: {
      const newLocations = [...state.get('locationsData').toJS()];

      newLocations.push({
        ...action.payload.location,
        id: state.get('id'),
        img: 'https://static.businessinsider.com/image/49f08920796c7a16009f86ba/image.jpg'
      });
      return Immutable.fromJS({
        locationsData: newLocations,
        id: (state.get('id') + 1),
      });
    }


    case actionTypes.DELETE_LOCATION: {
      const {id} = action.payload;
      const newLocations = [...state.get('locationsData').toJS()];
      remove(newLocations, (location) => location.id === id);
      return Immutable.fromJS({
        locationsData: newLocations,
        id: state.get('id')
      });
    }


    case actionTypes.DELETE_ALL_FROM_CATEGORY: {
      const {categoryId} = action.payload;
      const newLocations = [...state.get('locationsData').toJS()];
      remove(newLocations, (location) => location.categoryId === categoryId);
      return Immutable.fromJS({
        locationsData: newLocations,
        id: state.get('id')
      });
    }

    case actionTypes.EDIT_LOCATION:
      const {name, subtitle, oldCategoryId, newCategoryId, coordinates} = action.payload.location;
      const newLocations = [...state.get('locationsData').toJS()];
      const index = findIndex(newLocations, (location) => location.categoryId === oldCategoryId);

      newLocations[index].name = name;
      newLocations[index].categoryId = newCategoryId;
      newLocations[index].subtitle = subtitle;
      newLocations[index].coordinates = coordinates;
      return Immutable.fromJS({
        locationsData: newLocations,
        id: state.get('id')
      });


    default:
      return state;
  }
};

export default locationsList;