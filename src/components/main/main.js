import React from 'react';
import './main.css';
import Footer from '../footer/footer';
import CategoriesList from '../categories/categoriesList';
import Locations from '../locations/locationsList';
import Map from '../map/map';
import AppBar from 'material-ui/AppBar';
import {history} from '../../index';
import {
  Route,
  Switch
} from 'react-router-dom';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state={

    }
  }
    componentDidMount(){
      const appBarHeight = this.appBar.clientHeight;
      const footerHeight = this.footer.clientHeight;
      this.setState({height: window.innerHeight - appBarHeight - footerHeight});
    }

    _topToolbar(){
        return (
          <div ref={ (divElement) => this.appBar = divElement}>
              <AppBar
                title="My Locations"
                showMenuIconButton={false}
                className="topToolBar"
                onClick={() => history.push('/categories')}
              />
          </div>

        );
    }

    _map(){
      const { height } = this.state;

      return (
        <div className="mapContainer">
          <Map height={height}/>
        </div>
      );
    }


    _categoriesAndLocations(){
      const { height } = this.state;

      return (
          <div className="categoriesAndLocationsContainer">
              <Switch>
                <Route path="/categories" component={CategoriesList} width='60%' height={height - 200}/>
                <Route path="/locations" component={Locations} width='60%' height={height - 200}/>
                <Route path="/*" component={CategoriesList} width='60%' height={height - 200}/>

              </Switch>
          </div>
      );
    }

    _footer(){
      return (
        <footer className="footer" ref={ (divElement) => this.footer = divElement}>
            <Footer/>
        </footer>
      );
    }

    render() {
        const { height } = this.state;

        return (
          <div>
            { this._topToolbar() }

              <div className="row" style={{height}}>
                {this._map()}

                {this._categoriesAndLocations()}
              </div>

            {this._footer()}
          </div>
        );
    }
}

export default Main;