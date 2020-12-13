import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import Sign from './components/signUpSignIn.js';


function App() {

  document.title = 'Stunning'; 

  return (

      <Router>
        <Switch>
          <Route component={Sign} path="/" exact />


        </Switch>
      </Router>
    

  );
}

export default App;
