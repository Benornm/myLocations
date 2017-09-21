import * as actionTypes from '../constants/actionTypes';

export const addNewCategory = (category) => ({
  type: actionTypes.ADD_NEW_CATEGORY,
  payload: {category},
});

export const deleteCategory = (id) => ({
  type: actionTypes.DELETE_CATEGORY,
  payload: {id},
});

export const editCategory = (name , id) => ({
  type: actionTypes.EDIT_CATEGORY,
  payload: {name , id},
});