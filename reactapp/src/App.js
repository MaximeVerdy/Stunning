import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

// import des éléments liés à Redux
import {Provider} from 'react-redux'
import {createStore, combineReducers} from 'redux'
import token from './reducers/token'

// import des composants
import Sign from './components/login.js';
import Stats from './components/statistics.js';
import MentionsLegales from './components/legalterms.js';
import Disconnected from './components/disconnected.js';
import NotLogged from './components/notlogged.js';
import Activity from './components/newactivity.js';
import History from './components/history.js';

//style
import './css/mainwrapper.css';


import Nivo from './components/nivo.js';


const store = createStore(combineReducers({token}))

store.subscribe(() => console.log('Changement des états dans Redux ----->', store.getState()))

function App() {

  document.title = 'Stunning'; 

  return (

    <Provider store={store}>

      <Router>
        <div className="main-wrapper">
          <Switch>
            <Route component={Sign} path="/" exact />
            <Route component={Stats} path="/statistiques" exact />
            <Route component={MentionsLegales} path="/mentionslegales" exact />
            <Route component={Disconnected} path="/disconnected" exact />
            <Route component={NotLogged} path="/notlogged" exact />
            <Route component={Activity} path="/activite" exact />
            <Route component={History} path="/historique" exact />

            <Route component={Nivo} path="/nivo" exact />



          </Switch>
        </div>
      </Router>

    </Provider>

  );
}

export default App;
