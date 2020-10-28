import React, { Fragment } from 'react';
import pageConfig from './models/page';
import Header from './components/Header';
import s from './App.pcss'
import Footer from "./components/Footer";
import { Route, BrowserRouter as Router, Switch, Link } from "react-router-dom";
import { ServiceProvider } from "@graphter/renderer-react";
import service from './service';
import ExampleList from "./components/example-list";
import { ExampleEdit } from "./components/example-edit/ExampleEdit"

export default function App(){
  return (
    <Fragment>
        <ServiceProvider service={service}>
          <Router>
            <Header />
            <div className={s.content}>
              <Switch>
                <Route path='/pages'>
                  <ExampleList />
                </Route>
                <Route path='/page/:id'>
                  <ExampleEdit config={pageConfig} listUri='/pages' />
                </Route>
              </Switch>
            </div>
            <Footer />
          </Router>
        </ServiceProvider>
    </Fragment>
  )
}