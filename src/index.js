import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import store from './redux/store';
import Main from './components/main/main';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';
import { Router } from 'react-router';
import createHistory from 'history/createBrowserHistory'

// PERSIST STATE TO LOCAL STORAGE
import { persistStore } from 'redux-persist-immutable';
import { asyncLocalStorage } from "redux-persist/storages";

class App extends React.Component {

  state = {
    isReady: false
  };


  componentDidMount(){
    persistStore(store, {
      storage: asyncLocalStorage,
      whitelist: ['locationsList', 'categories'],
      blacklist:['locations']
    } ,
      () => {
        this.setState({isReady: true})
      });
  }

    render() {
    const {isReady} = this.state;

      if(!isReady){
        return <h1>Loading...</h1>
      }
      return (
          <Main/>
      );
    }
}

export const isMobile = document.body.clientWidth < 500;
export const history = createHistory();

ReactDOM.render(
  <Provider store={ store }>
    <MuiThemeProvider>
      <Router history={history}>

        <App/>
      </Router>
    </MuiThemeProvider>


  </Provider>,
  document.getElementById('root'));
registerServiceWorker();

export default App;
