import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Landing from "./components/Landing/Landing";
import ManageData from "./components/Demo/ManageData";
import ManageConfig from "./components/Demo/ManageConfig";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path='/demo/data*'>
          <ManageData />
        </Route>
        <Route path='/demo/config*'>
          <ManageConfig />
        </Route>
        <Route path='/'>
          <Landing />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
