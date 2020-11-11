import React from 'react';
import s from './ExampleEdit.pcss';
import { useParams, useHistory } from "react-router-dom";
import querystring from 'query-string';
import { useLocation } from "react-router";
import {
  ValidationResultsProvider,
  ValidationSummary,
  NodeEditRenderer
} from "@graphter/renderer-react";
import {
  ErrorPanel,
  registerStringNodeRenderer,
  registerObjectNodeRenderer,
  registerListNodeRenderer
} from "@graphter/renderer-component-library-react";
import {
  NodeDataProvider,
  useRecoilNodeData,
  useRecoilArrayNodeData,
  NodeValidationProvider,
  useRecoilNodeValidation
} from "@graphter/renderer-react";
import { RecoilRoot } from "recoil";
import { registerJsonSchemaValidatorSetup } from "@graphter/validator-jsonschema";

export function ExampleEdit({config, listUri}) {
  const {id} = useParams();
  const history = useHistory();
  const location = useLocation();
  const {page, size} = querystring.parse(location.search);
  const backUri = `${listUri}${!listUri.endsWith('?') && '?'}page=${page}&size=${size}`
  const editingId = parseInt(id)
  return (
    <div className={s.exampleEdit}>
      <NodeValidationProvider
        instanceId={editingId}
        nodeValidationHook={useRecoilNodeValidation}
        validatorRegistry={[
          registerJsonSchemaValidatorSetup()
        ]}
      >
        <RecoilRoot>
          <NodeDataProvider
            instanceId={editingId}
            nodeDataHook={useRecoilNodeData}
            arrayNodeDataHook={useRecoilArrayNodeData}
            config={config}
          >
            <NodeEditRenderer
              config={config}
              editingId={editingId}
              errorRenderer={ErrorPanel}
              typeRegistry={[
                registerStringNodeRenderer(),
                registerObjectNodeRenderer(),
                registerListNodeRenderer(),
                {
                  type: 'multiline-string',
                  renderer: ({propData, setPropDataValue, propertyConfig, validationResults}) => {
                    return (
                      <div>
                        <label htmlFor={propertyConfig.id}>{propertyConfig.name}</label>
                        {propertyConfig.description && <p>{propertyConfig.description}</p>}
                        <textarea id={propertyConfig.id} value={propData} onChange={(e) => {
                          setPropDataValue(e.currentTarget.value);
                        }}/>
                      </div>
                    );
                  }
                }
              ]}
              cancel={() => history.push(backUri)}
              onSaved={() => history.push(backUri)}
            />
          </NodeDataProvider>
        </RecoilRoot>
      </NodeValidationProvider>
    </div>
  )
}