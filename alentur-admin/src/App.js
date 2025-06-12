import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import OrganizationForm from './scenes/organizationform/index.jsx';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/organization" component={OrganizationForm} />
        {/* Add more routes as needed */}
      </Switch>
    </Router>
  );
};

export default App;