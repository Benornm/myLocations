import React, {Component} from 'react';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import { CATEGORIES , LOCATIONS } from '../../redux/constants/constants';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import CategoriesIcon from 'material-ui/svg-icons/action/store';
import {history} from '../../index';
const categoriesIcon = <CategoriesIcon />;
const locationIcon = <IconLocationOn />;

class Footer extends Component {
  state = {
    selectedIndex: CATEGORIES,
  };

  select = (index) => {
    this.setState({selectedIndex: index});
  };

  navigate(e, path, index){
    e.preventDefault();
    history.push(`/${path}`);
    this.select(index);
  }

  render() {

    return (
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="Categories"
            icon={categoriesIcon}
            onClick={(e) => this.navigate(e,'categories',CATEGORIES)}
          />
          <BottomNavigationItem
            label="Locations"
            icon={locationIcon}
            onClick={(e) => this.navigate(e,'locations',LOCATIONS)}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

export default Footer;