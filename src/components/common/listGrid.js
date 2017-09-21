import React from 'react';
import { GridList, GridTile } from 'material-ui/GridList';
import uuid from 'uuid';
import './listGrid.css';
import { red500, blue500 } from 'material-ui/styles/colors';
import { DeleteIcon, EditIcon } from '../../assets/svgIcons';
import { findIndex } from 'lodash';

export default class ListGrid extends React.Component {

  _generateGridList(data) {
    const { cellHeight, padding, listTitle , locationsList } = this.props;
    const styles = {
      gridList: {
        width: '80%',
        height: 'auto',
        overflowY: 'auto',
      },
    };

    return (
      <div className="fullWidth">
        {
          locationsList?
            this._generateLocations(data, cellHeight, padding , styles) :
            this._generateCategories(data, cellHeight, padding, listTitle , styles)
        }
      </div>
    );
  }

  _generateLocations(data, cellHeight, padding, styles){
    const { categoriesData } = this.props;

    return (
        Object.keys(data).map( (key , i) => {
          const categoryIndex = findIndex(categoriesData , (category ) => category.id === parseInt(Object.keys(data)[i],10));

          return (
            <span key={uuid()} className='gridListContainer'>
              <p className="categoryHeader">{categoriesData[categoryIndex].name}</p>
              <GridList
                cellHeight={cellHeight || 100}
                cols={1}
                padding={padding || 8}
                style={styles.gridList}
              >
                {data[key].map((tile) => this._generateGridTile(tile))}
              </GridList>
            </span>
          );
        } )
    );
  }

  _generateCategories(data , cellHeight, padding, listTitle, styles){
    return (
      <span key={uuid()} className='gridListContainer'>
          <p className="categoryHeader">{listTitle ? listTitle : 'Show All'}</p>
          <GridList
            cellHeight={cellHeight || 100}
            cols={1}
            padding={padding || 8}
            style={styles.gridList}
          >
            {data.map((tile) => this._generateGridTile(tile))}
          </GridList>
        </span>
    );
  }

  _generateGridTile(tile) {
    const {onTileClick} = this.props;
    return (
      <span key={uuid()} title={`Show ${tile.name} locations`}>
          <GridTile
            className='tile'
            onClick={() => onTileClick ? onTileClick(tile) : null}
            title={tile.name}
            subtitle={tile.subtitle ? this._renderSubtitle(tile) : null}
            actionIcon={ this._icons(tile) }
          >
          <img src={tile.img} alt="Location"/>
        </GridTile>
      </span>
    );
  }

  _icons(tile) {
    const {onEdit, onDelete} = this.props;
    return (
      <div className="row">
        <EditIcon onClick={(event) => {
          onEdit(tile);
          event.stopPropagation();
        }}
                  color={'#fff'}
                  hoverColor={blue500}/>

        <DeleteIcon onClick={(event) => {
          onDelete(tile);
          event.stopPropagation();
        }}
                    color={'#fff'}
                    hoverColor={red500}/>
      </div>
    );
  }

  _renderSubtitle(tile) {
    return (
      <div className="subTitleContainer">
        {tile.subtitle}
      </div>
    );
  }

  _empty(){
    const {locationsList , categoriesList} = this.props;
    let dataType = 'data';
    if(locationsList){
      dataType = 'locations';
    } else if (categoriesList){
      dataType = 'categories';
    }
    return (
      <div className="gridListContainer">
        <div className="empty_font">{`You have no ${dataType}.`}</div>
        <div>{`Press ADD to add new ${dataType} to your list.`}</div>
      </div>
    );
  }

  render() {
    const {data} =this.props;
    const dataLength = Object.keys(data).length;

    return (
      <div className='root'>
        {dataLength > 0 ?
          this._generateGridList(data) :
          this._empty()}
      </div>
    );
  }
}
