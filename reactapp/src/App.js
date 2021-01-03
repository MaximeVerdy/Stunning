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

// création du store qui contiendra les états voulus dans les reducers
const store = createStore(combineReducers({token}))

// contrôle des états dans Redux. Permet juste leur affichage dans la console
// store.subscribe(() => console.log('CONSOLE LOG REDUX ----->', store.getState()))

function App() {

  // nommage de l'application
  document.title = 'Stunning'; 

  return (

    // Le Redux store est rendu disponibre dans l'ensemble des composants qui sont wrappés ci dessous
    <Provider store={store}>

      {/* React Router permet la navigation entre les composants */}
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

          </Switch>
        </div>
      </Router>

    </Provider>

  );
}

export default App;
