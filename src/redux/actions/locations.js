import * as actionTypes from '../constants/actionTypes';

export const addLocation = (location) => ({
  type: actionTypes.ADD_LOCATION,
  payload: {location},
});

export const addNewLocation = (location) => ({
  type: actionTypes.ADD_NEW_LOCATION,
  payload: {location},
});

export const deleteLocation = (id, categoryId) => ({
  type: actionTypes.DELETE_LOCATION,
  payload: {id, categoryId},
});

export const deleteAllFromCategory = (categoryId) => ({
  type: actionTypes.DELETE_ALL_FROM_CATEGORY,
  payload: { categoryId },
});

export const editLocation = (location , id) => ({
  type: actionTypes.EDIT_LOCATION,
  payload: {location , id},
});

export const filterBybCategory = (categoryId) => ({
  type: actionTypes.FILTER_BY_CATEGORY,
  payload: {categoryId},
});

export const setChosenItem = (chosenItem, editMode) => ({
  type: actionTypes.SET_CHOSEN_ITEM,
  payload: {chosenItem, editMode},
});

export const setAddAndEditMode = (addMode, editMode) => ({
  type: actionTypes.SET_ADD_AND_EDIT_MODE,
  payload: {addMode, editMode},
});

export const setAddMode = (addMode) => ({
  type: actionTypes.SET_ADD_MODE,
  payload: {addMode},
});

export const changeMapLocation = (coordinates) => ({
  type: actionTypes.CHANGE_MAP_LOCATION,
  payload: {coordinates},
});

