import Immutable from 'immutable';
import * as actionTypes from '../constants/actionTypes';
import {findIndex, remove} from 'lodash';

const initialState = Immutable.fromJS({
  id: 1,
  categoriesData: [],
});

const categories = (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.ADD_NEW_CATEGORY: {
      const newArr = [...state.get('categoriesData')];
      newArr.push({
        name: action.payload.category,
        id: state.get('id'),
        img: 'https://static.businessinsider.com/image/49f08920796c7a16009f86ba/image.jpg'
      });
      return Immutable.fromJS({
        categoriesData: newArr,
        id: (state.get('id') + 1)
      });
    }


    case actionTypes.DELETE_CATEGORY: {
      const { id } = action.payload;
      const copyArr = state.get('categoriesData').toJS();
      const newArr = remove( copyArr , (category) => category.id !== id);
      return Immutable.fromJS({
        categoriesData: newArr,
        id: state.get('id')
      });
    }

    case actionTypes.EDIT_CATEGORY: {
      const {name, id} = action.payload;
      const newArr = state.get('categoriesData').toJS();
      const index = findIndex(newArr, (category) => category.id === id);
      newArr[index].name = name;
      return Immutable.fromJS({
        categoriesData: newArr,
        id: state.get('id')
      });
    }


    default:
      return state;
  }
};

export default categories;