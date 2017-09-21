import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { isEmpty, set, isEqual, pick } from 'lodash';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import uuid from 'uuid';
import './locations.css';
import {
  addLocation,
  deleteLocation,
  editLocation,
  setAddMode,
  setChosenItem,
  setAddAndEditMode} from '../../redux/actions/locations';
import {connect} from 'react-redux';
import {isMobile} from "../../index";
import {Dialog, FlatButton} from "material-ui";


class AddLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode:false,
      id:null,
      categoryId:null,
      name:'' ,
      subtitle:'',
      validations:{
        nameValid: true,
        subtitleValid:true,
        latValid:true,
        lngValid:true,
        categoryIdValid: true,
        notChangedValid: true
      }
    }
  }

  componentWillMount(){
    const { chosenItem, multipleCategories } = this.props;
    if(multipleCategories){
      this.setState({categoryId: []});
    }
    if(chosenItem){
      const {id, name, categoryId, subtitle, coordinates} = chosenItem;
      this.setState({
        editMode: true,
        id,
        name ,
        categoryId,
        subtitle,
        coordinates
      });
    }
  }

  validateField(field){
    let value = null;
    let path = '';

    switch(field){
      case 'name':
        value = this.refs.name.getValue();
        path = 'nameValid';
        break;
      case 'subtitle':
        value = this.refs.subtitle.getValue();
        path = 'subtitleValid';
        break;
      case 'lat':
        value = this.refs.lat.getValue();
        path = 'latValid';
        break;
      case 'lng':
        value = this.refs.lng.getValue();
        path = 'lngValid';
        break;
      default:
        break;
    }

    const validations = {...this.state.validations};
    if (!isEmpty(value)){
      set(validations, path, true);
      this.setState({validations});
      return true;

    } else {
      set(validations, path, false);
      this.setState({validations});
      return false;
    }
  }


  validateAll(){
    const { categoryId } = this.state;
    const name = this.refs.name.getValue();
    const subtitle = this.refs.subtitle.getValue();
    const lat = this.refs.lat.getValue();
    const lng = this.refs.lng.getValue();

    let nameValid = true;
    let subtitleValid = true;
    let latValid = true;
    let lngValid = true;
    let categoryIdValid = true;
    let validForm = true;

    if (isEmpty(name)) {
      nameValid = false;
      validForm= false;
    }
    if (isEmpty(subtitle)) {
      subtitleValid = false;
      validForm= false;
    }
    if (isEmpty(lat)) {
      latValid = false;
      validForm= false;
    }
    if (isEmpty(lng)) {
      lngValid = false;
      validForm= false;
    }
    if (!categoryId) {
      categoryIdValid = false;
      validForm= false;
    }
    if(Array.isArray(categoryId)){
      if(isEmpty(categoryId)){
        categoryIdValid = false;
        validForm= false;
      }
    }
    this.setState({
      validations:
        { nameValid,
          subtitleValid,
          latValid,
          lngValid,
          categoryIdValid
        }});
    return validForm;
  }

  checkIfChanged(newItem, chosenItem){
    if(isEqual(newItem, pick(chosenItem,['name', 'subtitle', 'categoryId', 'coordinates']))){
      this.setState({validations: {...this.state.validations, notChangedValid:false }});
      return false;
    } else {
      this.setState({validations: {...this.state.validations, notChangedValid:true }});
      return true;
    }
  }

  add = () => {
    if(this.validateAll()){
      this.handleAdd();
    }
  };

  handleAdd(){ //after validation
    const name = this.refs.name.getValue();
    const subtitle = this.refs.subtitle.getValue();
    const lat = this.refs.lat.getValue();
    const lng = this.refs.lng.getValue();
    const { editMode, categoryId, id } = this.state;
    const { chosenItem, onAdd, onEdit } = this.props;
    const newItem = {name, subtitle, categoryId, coordinates:{lat, lng}};

    if(editMode){
      if(this.checkIfChanged(newItem, chosenItem)) {
        this.props.setAddAndEditMode(false,false);
        this.props.editLocation({
            id,
            name,
            subtitle,
            oldCategoryId: chosenItem.categoryId,
            newCategoryId: categoryId,
            coordinates: {lat, lng}
          }
        );

        onEdit();
      }
    } else {
      this.props.addLocation({name, subtitle, categoryId , coordinates:{lat, lng}});
      onAdd(name);
    }
  }

  handleChange = (event, index, value) => {
    return this.setState({categoryId: value});
  };

  _nameAndLocation(){
    const {name, subtitle, editMode} = this.state;
    const { nameValid, subtitleValid } = this.state.validations;

    return (
      <div className="nameAndLocationContainer">
        <TextField
          style={{marginRight:10, width:200}}
          hintText={'Location'}
          floatingLabelText={editMode? 'Edit Location' : 'Location'}
          errorText={!nameValid ? '* Mandatory' : null}
          defaultValue={name}
          onChange={() => this.validateField('name')}
          ref={'name'}
          disabled={false}
        />

        <TextField
          style={{width:200}}
          hintText={'Address'}
          floatingLabelText={editMode? 'Edit Address' : 'Address'}
          errorText={!subtitleValid ? '* Mandatory' : null}
          defaultValue={subtitle}
          onChange={() => this.validateField('subtitle')}
          ref={'subtitle'}
          disabled={false}
        />
      </div>
    );
  }

  _selectCategory(){
    const { categoryId } = this.state;
    const { categoryIdValid } = this.state.validations;
    const { categoriesData, multipleCategories } = this.props;

    return (
      <SelectField
        floatingLabelText="Category"
        value={categoryId}
        style={isMobile ? {width:'100%'} : null}
        ref="selectCategory"
        onChange={ this.handleChange }
        maxHeight={200}
        errorText={!categoryIdValid  ? '* Mandatory' : null}
        multiple={multipleCategories}
        className="selectField"
        selectedMenuItemStyle={{color:'#00bcd4'}}
      >
        {categoriesData.map((category) => {
          return <MenuItem key={uuid()}
                           value={category.id}
                           primaryText={category.name}

                           insetChildren={ multipleCategories }
                           checked={multipleCategories?
                                      (categoryId && categoryId.indexOf(category.id) > -1) : null}
          />;
        })}

      </SelectField>
    );
  }

  _coordinates(){
    const { latValid, lngValid } = this.state.validations;
    let {lat, lng} = this.props.coordinates;

    if(!lat || !lng){
      lat = '';
      lng = '';
    }

    return (
      <div className="coordinatesContainer">
        <TextField
          key={uuid()}
          style={{marginRight:10, width:120}}
          hintText={'Latitude'}
          floatingLabelText={null}
          errorText={!latValid ? '* Mandatory' : null}
          defaultValue={lat.toString().substr(0,6)}
          ref={'lat'}
          disabled={true}
        />

        <TextField
          key={uuid()}
          style={{width:120}}
          hintText={'Longitude'}
          floatingLabelText={null}
          errorText={!lngValid ? '* Mandatory' : null}
          defaultValue={lng.toString().substr(0,6)}
          ref={'lng'}
          disabled={true}
        />
      </div>
    );
  }

  _bottomButtons(){
    const { editMode } = this.state;

    return (
      <div className="buttonsContainer">
        <RaisedButton
          label={editMode? "UPDATE" : "Add"}
          primary={true}
          className="button"
          onClick={ this.add }
        />
        <RaisedButton
          label="Cancel"
          secondary={true}
          className="button"
          onClick={() => this.props.setAddAndEditMode(false, false)}
        />
      </div>
    );
  }

  closeDialog = () => {
    this.setState({validations: {...this.state.validations, notChangedValid:true }})
  };

  _dialog(){
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        onClick={this.closeDialog}
      />,
    ];
    return (
      <Dialog
        title="Location didnt changed"
        actions={actions}
        modal={false}
        open={!this.state.validations.notChangedValid}
        onRequestClose={ this.closeDialog }
      >
        To update your location, you have to change at least one of its properties.
      </Dialog>
    );
  }

  render() {
    return (
      <form className="formContainer">
        {this._nameAndLocation()}

        {this._selectCategory()}

        {this._coordinates()}

        {this._bottomButtons()}

        {this._dialog()}
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  coordinates: state.toJS().locations.coordinates,
  categoriesDataFirst: state.toJS().categories.categoriesData[0],
});

export default connect(mapStateToProps, {
  addLocation,
  deleteLocation,
  editLocation,
  setChosenItem,
  setAddAndEditMode,
  setAddMode
})(AddLocation);