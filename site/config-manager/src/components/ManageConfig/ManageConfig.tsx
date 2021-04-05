import React from "react";
import { RecoilStateProvider } from "@graphter/recoil-state-provider";
import { registerJsonSchemaValidatorSetup } from "@graphter/validator-jsonschema";
import { Redirect, Route, Switch } from "react-router-dom";
import List from "../List/List";
import { ConfigProvider } from "@graphter/renderer-react";
import { configService } from "../../services/configService";
import Edit from "../Edit/Edit";
import registerIdUniquenessValidator from "../../validators/registerIdUniquenessValidator";
import { nodeRendererService } from "../../services/nodeRendererService";
import configConfig from '../../models/config'
import { serviceStore } from "@graphter/renderer-react";
import { nodeRendererOptionsConfigService } from "../../services/nodeRendererOptionsConfigService";

serviceStore.register('config', configService)
serviceStore.register('node-renderer', nodeRendererService)
serviceStore.register('node-renderer-options-config', nodeRendererOptionsConfigService)

export default function ManageConfig() {
  return (
    <RecoilStateProvider validatorRegistry={[
      registerJsonSchemaValidatorSetup(),
      registerIdUniquenessValidator()
    ]}>
      <ConfigProvider configs={[
        configConfig
      ]}>
        <Switch>
          <Route path='/config' exact>
            <List/>
          </Route>
          <Route path='/:path+'>
            <Edit/>
          </Route>
          <Route path='*'>
            <Redirect to='/config'/>
          </Route>
        </Switch>
      </ConfigProvider>
    </RecoilStateProvider>
  )
}