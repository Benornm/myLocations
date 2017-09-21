import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { isEmpty } from 'lodash';
import './categories.css';


export default class AddCategory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name:null ,
      nameValid: true,
      editMode: false,
      nameChanged: true
    }
  }

  componentWillMount(){
    const { chosenItem } = this.props;

    if(chosenItem && chosenItem.name){
      this.setState({name: chosenItem.name , editMode: true});
    }
  }


  validate = () => {
    const name = this.refs.name.getValue();
    const { chosenItem } = this.props;

    if (!isEmpty(name)){
      if(chosenItem && chosenItem.name === name){
        this.setState({nameValid: false,nameChanged: false});
        return false;
      }
      this.setState({nameValid: true, nameChanged:true });
      return true;
    } else {
      this.setState({nameValid: false  , nameChanged:true});
      return false;
    }
  };

  add = () => {
    const name = this.refs.name.getValue();

    if(this.validate()){
        this.handleAdd(name);
    }
  };

  handleAdd(name){ //after validation
    const { editMode } = this.state;
    const { onAdd, onEdit, chosenItem } = this.props;

    if(editMode){
      onEdit(name ,chosenItem.id );
    } else {
      onAdd(name);
    }
  }

  _categoryNameInput(){
    const { nameValid , name, editMode, nameChanged} = this.state;

    return (
      <TextField
        hintText="Category Name"
        floatingLabelText={editMode ? "Edit category name" : "Category name"}
        errorText={!nameValid ? !nameChanged ? 'Name hasnt changed' : '* Mandatory' : null}
        defaultValue={name}
        ref='name'
        style={{width:'100%'}}
        onChange={ this.validate }
      />
    );
  }

  _buttons(){
    const { editMode } = this.state;
    const { onCancel } = this.props;

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
          onClick={onCancel? () => onCancel() : null}
        />
      </div>
    );
  }

  render() {

    return (
      <div className="addCategoryContainer">
        {this._categoryNameInput()}

        {this._buttons()}
      </div>
    );
  }
}