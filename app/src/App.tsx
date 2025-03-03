import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Marketplace from './components/Marketplace';
import UserBalance from './components/UserBalance';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/balance" component={UserBalance} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;