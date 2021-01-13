import { NodeEditRenderer } from "@graphter/renderer-react";
import configConfig from '../../models/config'
import {
  ErrorPanel,
  registerStringNodeRenderer,
  registerObjectNodeRenderer,
  registerListNodeRenderer
} from "@graphter/renderer-component-library-react";
import { useParams, useHistory } from "react-router-dom";
import { createDefault } from "@graphter/renderer-react";
import { useNodeValidation } from "@graphter/renderer-react";
import { useState } from "react";
import { useNodeData } from "@graphter/renderer-react";
import { registerIdNodeRenderer } from "../../node-renderers/id";

export default function Edit(){
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const backUri = `/demo/config`
  return (
    <>
      <NodeEditRenderer
        config={configConfig}
        editingId={id}
        errorRenderer={ErrorPanel}
        typeRegistry={[
          registerStringNodeRenderer(),
          registerObjectNodeRenderer(),
          registerListNodeRenderer(),
          {
            type: 'multiline-string',
            Renderer: ({ config, originalNodeData, committed, path, ErrorDisplayComponent }) => {
              const isNew = typeof originalNodeData === 'undefined'
              if(isNew) originalNodeData = createDefault(config, '')
              const [ touched, setTouched ] = useState(false)
              const [ nodeData, setNodeData ] = useNodeData(path, config, originalNodeData, committed)
              const validationResults = useNodeValidation(path)
              const htmlId = path.join('-')
              return (
                <div>
                  <label htmlFor={htmlId}>{config.name}</label>
                  {config.description && <p>{config.description}</p>}
                  <textarea id={htmlId} value={nodeData} onChange={(e) => {
                    if(!touched) setTouched(true)
                    setNodeData && setNodeData(e.currentTarget.value);
                  }}/>
                </div>
              );
            }
          },
          registerIdNodeRenderer()
        ]}
        cancel={() => history.push(backUri)}
        onSaved={() => history.push(backUri)}
      />
    </>
  )
}