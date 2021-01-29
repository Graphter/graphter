import React from "react";
import { RecoilStateProvider } from "@graphter/recoil-state-provider";
import { registerJsonSchemaValidatorSetup } from "@graphter/validator-jsonschema";
import { Route, Switch, useParams } from "react-router-dom";
import List from "../List/List";
import { ServiceProvider, ConfigProvider } from "@graphter/renderer-react";
import { configService } from "../../services/configService";
import Edit from "../Edit/Edit";
import registerIdUniquenessValidator from "../../validators/registerIdUniquenessValidator";
import { nodeRendererService } from "../../services/nodeRendererService";
import configConfig from '../../models/config'

export default function ManageConfig(){
  const { id } = useParams<{ id: string }>();
  return (
    <RecoilStateProvider instanceId={id} validatorRegistry={[
      registerJsonSchemaValidatorSetup(),
      registerIdUniquenessValidator()
    ]}>
      <ConfigProvider configs={[
        configConfig
      ]}>
        <ServiceProvider serviceRegistry={[
          { id: 'config', service: configService },
          { id: 'node-renderer', service: nodeRendererService }
        ]}>
          <Switch>
            <Route path='/:id'>
              <Edit />
            </Route>
            <Route path='/'>
              <List />
            </Route>
          </Switch>
        </ServiceProvider>
      </ConfigProvider>
    </RecoilStateProvider>
  )
}