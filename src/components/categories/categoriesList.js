import React from 'react';
import ListGrid from '../common/listGrid';
import RaisedButton from 'material-ui/RaisedButton';
import AddCategory from './addCategory';
import {Snackbar} from "material-ui";
import {addNewCategory, deleteCategory, editCategory} from '../../redux/actions/categories';
import {isMobile} from "../../index";
import {connect} from 'react-redux';

class CategoriesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addMode: false,
      editMode: false,
      chosenItem: null,
      snackBarOpen:false,
      snackBarText:''
    }
  }

  handleAdd = (name) => {
    this.openSnackBar(`${name} has been added successfully`);
    this.setState({addMode: false});
    this.props.addNewCategory(name);
  };

  handleCancel = () => {
    this.setState({addMode: false , editMode: false});
  };

  openSnackBar(text){
    this.setState({snackBarOpen: true , snackBarText: text});
  };

  handleRequestClose = () => this.setState({ snackBarOpen: false });

  handleDelete = (tile) =>{
    this.openSnackBar(`${tile.name} has been deleted successfully` );
    this.props.deleteCategory(tile.id);
  };

  onEditClick = (tile) => {
    this.setState({editMode: true , chosenItem:tile});
  };

  handleEdit = (name , id) => {
    this.props.editCategory(name , id);
    this.setState({editMode: false , chosenItem:null});
  };

  _addCategoryComp(){
    const { chosenItem } = this.state;

    return (
      <AddCategory
        onAdd={ this.handleAdd }
        onCancel={ this.handleCancel }
        onEdit={ this.handleEdit }
        chosenItem={chosenItem}/>
    );
  }

  _addCategoryButton(){
    return (
      <div className={isMobile ? "addCategoryButtonMobile" :"addCategoryButton"}>
        <RaisedButton
          label="Add Category"
          primary={true}
          className="button"
          onClick={() => this.setState({addMode: true , chosenItem:null})}
        />
      </div>
    );
  }

  _listGrid(){
    const { categoriesData, width , height , padding , cellHeight } = this.props;

    return (
      <ListGrid width={width}
                height={height}
                padding={padding}
                cellHeight={cellHeight}
                listTitle={`Categories List (${categoriesData.length} categories)`}
                onEdit={ this.onEditClick }
                onDelete={  this.handleDelete }
                categoriesList={true}
                data={categoriesData}/>
    );
  }

  _snackbar(){
    const { snackBarOpen, snackBarText  } = this.state;

    return (
      <Snackbar
        open={snackBarOpen}
        message={snackBarText}
        autoHideDuration={2000}
        onRequestClose={ this.handleRequestClose }
      />
    );
  }

  render() {
      const { addMode, editMode  } = this.state;

        return (
          <div>
            <div className="addCategorySection">
              {
                (addMode || editMode) ?
                  this._addCategoryComp()
                  :
                  this._addCategoryButton()
              }
            </div>

            {this._listGrid()}

            {this._snackbar()}
          </div>
        );
    }
}

const mapStateToProps = (state) => ({
  categoriesData: state.toJS().categories.categoriesData,
});

export default connect(mapStateToProps, {
  addNewCategory,
  deleteCategory,
  editCategory
})(CategoriesList);