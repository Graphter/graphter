import React from "react";
import { RecoilStateProvider } from "@graphter/recoil-state-provider";
import { registerJsonSchemaValidatorSetup } from "@graphter/validator-jsonschema";
import { useLocation } from "react-router";
import { Route, Switch } from "react-router-dom";
import List from "../List/List";
import { ServiceProvider } from "@graphter/renderer-react";
import { configService } from "../../services/configService";
import Edit from "../Edit/Edit";

export default function ManageConfig(){
  const location = useLocation();
  return (
    <RecoilStateProvider instanceId={''} validatorRegistry={[
      registerJsonSchemaValidatorSetup()
    ]}>
      <ServiceProvider service={configService}>
        <Switch>
          <Route path='/:id'>
            <Edit />
          </Route>
          <Route path='/'>
            <List />
          </Route>
        </Switch>
      </ServiceProvider>
    </RecoilStateProvider>
  )
}