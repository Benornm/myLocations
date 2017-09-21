import React from 'react';
import ListGrid from '../common/listGrid';
import RaisedButton from 'material-ui/RaisedButton';
import AddLocation from './addLocation';
import {Checkbox, DropDownMenu, MenuItem, Snackbar} from "material-ui";
import {groupBy, sortBy, reverse, isEqual, filter, findIndex} from 'lodash';
import uuid from 'uuid';
import {SHOW_ALL, SHOW_FLAT} from '../../redux/constants/constants';
import {isMobile} from "../../index";
import {connect} from 'react-redux';

import {
  addLocation,
  deleteLocation,
  editLocation,
  filterBybCategory,
  setChosenItem,
  setAddMode,
  changeMapLocation
} from '../../redux/actions/locations';

class LocationsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addMode: false,
      snackBarOpen: false,
      snackBarText: '',
      categoryIdFilter: SHOW_ALL,
      sortedData: null,
      isLocationsListGrouped: true,
      listTitle: null,
      categoryName: 'Show All',
      multipleCategories: false
    }
  }

  handleAdd(name) {
    this.openSnackBar(`${name} has been added successfully`);
    this.showAll();
  }

  openSnackBar = (text) => this.setState({snackBarOpen: true, snackBarText: text});

  handleRequestClose = () => this.setState({snackBarOpen: false});

  handleDelete = (location) => {
    this.openSnackBar(`${location.name} has been deleted successfully`);
    this.props.deleteLocation(location.id, location.categoryId);
    this.showAll();
  };

  onEditClick = (location) => {
    this.props.setChosenItem(location, true);
  };

  handleTileClick = (tile) => {
    this.props.changeMapLocation(tile.coordinates);
    //Mobile device vibration.
    navigator.vibrate = navigator.vibrate || navigator.webktiVibrate || navigator.mozVibrate || navigator.msVibrate;
    if (navigator.vibrate) {
      navigator.vibrate(1000);
    }
  };

  handleFilter = (event, index, value) => {
    const {locationsData, flatLocationsList} = this.props;
    let categoryName = 'Show All';

    if (value === SHOW_ALL) {
      return this.setState({
        sortedData: null,
        categoryIdFilter: value,
        isLocationsListGrouped: true
      });
    }
    if (value === SHOW_FLAT) {
      return this.setState({
        sortedData: sortBy(flatLocationsList, (loc) => loc.name),
        categoryIdFilter: value,
        isLocationsListGrouped: false, categoryName
      });
    }
    if (!locationsData[value]) {
      return this.setState({
        sortedData: [],
        categoryIdFilter: value,
        isLocationsListGrouped: true
      });
    }
    return this.setState({
      sortedData: groupBy(locationsData[value], (loc) => loc.categoryId),
      categoryIdFilter: value,
      isLocationsListGrouped: true
    });
  };

  handleSort(type) {
    let categoryName = 'Show All';
    const {sortedData, categoryIdFilter} = this.state;
    const {flatLocationsList, categoriesData} = this.props;
    const data = categoryIdFilter === SHOW_FLAT ?
      sortBy(flatLocationsList, (loc) => loc.name)
      : filter(sortBy(flatLocationsList, (loc) => loc.name), (loc) => loc.categoryId === categoryIdFilter);

    if (categoryIdFilter !== SHOW_FLAT || categoryIdFilter !== SHOW_ALL) {
      const categoryIndex = findIndex(categoriesData, (category) => category.id === categoryIdFilter);
      if (categoryIndex > -1) {
        categoryName = categoriesData[categoryIndex].name;
      }
    }
    switch (type) {
      case 'ASC':
        const sortedByName = sortBy(data, (location) => location.name);
        if (!isEqual(sortedData, sortedByName)) {
          this.setState({sortedData: sortedByName, isLocationsListGrouped: false, categoryName});
        }
        break;
      case 'DSC':
        const reversedArray = reverse(sortBy(data, (location) => location.name));
        if (!isEqual(sortedData, reversedArray)) {
          this.setState({sortedData: reversedArray, isLocationsListGrouped: false, categoryName});
        }
        break;
      default:
        break;
    }
  };

  handleEdit = () => {
    this.showAll();
  };

  showAll() {
    const { categoryIdFilter } = this.state;

    if (categoryIdFilter !== SHOW_ALL) {
      this.handleFilter(null, null, SHOW_ALL);
    }
  }

  _addLocationSection() {
    const {categoriesData, chosenItem} = this.props;
    const {multipleCategories} = this.state;

    return (
      <AddLocation
        categoriesData={categoriesData}
        multipleCategories={multipleCategories}
        onAdd={ (name) => this.handleAdd(name) }
        onEdit={ this.handleEdit }
        chosenItem={chosenItem}/>
    );
  }

  _addLocationButton() {
    const {noCategories} = this.props;
    return (
      <div className="addLocationButtonContainer">
        {noCategories ? '*You have no categories' : ''}
        <RaisedButton
          label="Add Location"
          primary={true}
          disabled={ noCategories }
          onClick={() => this.props.setAddMode(true)}
        />
      </div>
    );
  }

  updateCheck() {
    const {multipleCategories} = this.state;
    this.setState({multipleCategories: !multipleCategories});
  }

  checkBox() {
    const { multipleCategories } = this.state;

    return (
      <div className={isMobile ? "checkBoxContainerMobile" : "checkBoxContainer"}>
        <Checkbox
          label="Add to multiple categories"
          checked={ multipleCategories }
          onCheck={ this.updateCheck.bind(this) }
          style={{fontSize: 12}}
        />
      </div>
    );
  }

  _filterMenu() {
    const {categoriesData} = this.props;
    const {categoryIdFilter} = this.state;

    return (
      <DropDownMenu
        value={categoryIdFilter}
        onChange={this.handleFilter}
        style={{width: 200}}
        maxHeight={200}
        labelStyle={{marginLeft: 10}}
        autoWidth={false}
        selectedMenuItemStyle={{color: '#00bcd4'}}
      >
        <MenuItem value={SHOW_ALL} primaryText="Filter"/>
        <MenuItem value={SHOW_FLAT} primaryText="Show Flat List"/>
        {categoriesData.map((category) => <MenuItem key={uuid()}
                                                    value={category.id}
                                                    primaryText={category.name}/>)}
      </DropDownMenu>
    );
  }

  _sortButtons() {
    const {categoryIdFilter} = this.state;
    const disabled = categoryIdFilter === SHOW_ALL;

    return (
      <div>
        <RaisedButton
          label="ASC"
          primary={true}
          className="sortButton"
          onClick={() => this.handleSort('ASC')}
          disabled={disabled}
        />
        <RaisedButton
          label="DSC"
          primary={true}
          className="sortButton"
          onClick={() => this.handleSort('DSC')}
          disabled={disabled}
        />
      </div>
    );
  }

  _toSortText() {
    const {categoryIdFilter} = this.state;

    if (categoryIdFilter === SHOW_ALL) {
      return (
        <span className="toSortText">
          *To sort by location name , choose spasific category or choose 'Show flat list'
        </span>
      );
    } else {
      return null;
    }
  }

  _listGrid() {
    const { categoryName, isLocationsListGrouped , sortedData } = this.state;
    const {width, padding, cellHeight} = this.props;

    return (
      <ListGrid width={width}
                height={'auto'}
                categoriesData={this.props.categoriesData}
                padding={padding}
                cellHeight={cellHeight}
                onEdit={ this.onEditClick }
                onDelete={ this.handleDelete }
                onTileClick={ this.handleTileClick }
                listTitle={categoryName}
                locationsList={isLocationsListGrouped}
                data={sortedData ? sortedData : this.props.locationsData}/>
    );
  }

  _snackBar() {
    const {snackBarOpen, snackBarText} = this.state;

    return (
      <Snackbar
        open={ snackBarOpen }
        message={ snackBarText }
        autoHideDuration={2000}
        onRequestClose={ this.handleRequestClose }
      />
    );
  }

  render() {
    const {editMode, addMode} = this.props;

    return (
      <div>
        <div className="locationsContainer">
          {
            (addMode || editMode) ?
              this._addLocationSection()
              :
              <div className="addLocationsContainer">

                {this._addLocationButton()}

                {this.checkBox()}

                <div className={isMobile ? "filterAndSortContainerMobile" : "filterAndSortContainer"}>

                  {this._filterMenu()}
                  {this._sortButtons()}

                </div>

                {this._toSortText()}

              </div>

          }
        </div>

        {this._listGrid()}
        {this._snackBar()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    locationsData: groupBy(state.toJS().locationsList.locationsData, (loc) => loc.categoryId),
    flatLocationsList: state.toJS().locationsList.locationsData,
    categoriesData: state.toJS().categories.categoriesData,
    chosenItem: state.toJS().locations.chosenItem,
    editMode: state.toJS().locations.editMode,
    addMode: state.toJS().locations.addMode,
    coordinates: state.toJS().locations.coordinates,
    noCategories: state.toJS().categories.categoriesData.length === 0
  });
};

export default connect(mapStateToProps, {
  addLocation,
  deleteLocation,
  editLocation,
  filterBybCategory,
  setChosenItem,
  setAddMode,
  changeMapLocation
})(LocationsList);