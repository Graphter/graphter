import { NodeEditRenderer } from "@graphter/renderer-react";
import {
  ErrorPanel,
  registerStringNodeRenderer,
  registerObjectNodeRenderer,
  registerListNodeRenderer
} from "@graphter/renderer-component-library-react";
import { useParams } from "react-router-dom";
import { createDefault } from "@graphter/renderer-react";
import { useState } from "react";
import { useNodeData } from "@graphter/renderer-react";
import { registerIdNodeRenderer } from "../../node-renderers/id";
import { registerDataSelectNodeRenderer } from "../../node-renderers/data-select";
import { registerConditionalNodeRenderer } from "../../node-renderers/conditional";
import { registerNestedNodeRenderer } from "../../node-renderers/nested";
import { createValueInitialiser } from "@graphter/renderer-react";
import { useHistory } from "react-router-dom";
import { pathUtils } from "@graphter/renderer-react";

export default function Edit(){
  const backUri = `/`
  const history = useHistory();
  const params = useParams<{ path: string }>();
  const path = pathUtils.fromUrl(params.path)
  return (
    <>
      <NodeEditRenderer
        path={path}
        errorRenderer={ErrorPanel}
        typeRegistry={[
          registerStringNodeRenderer(),
          registerObjectNodeRenderer(),
          registerListNodeRenderer({
            customItemSelectionBehaviour: (customBehaviour, config, path) => {
              history.push(pathUtils.toUrl(path))
            }
          }),
          {
            type: 'multiline-string',
            name: 'Long text',
            description: 'Manage larger, multi-line plain text',
            initialiseData: createValueInitialiser(''),
            Renderer: ({ config, originalTreeData, committed, globalPath, ErrorDisplayComponent }) => {
              const originalNodeData = pathUtils.getValue(originalTreeData, globalPath.slice(2), createDefault(config, ''))
              const [ touched, setTouched ] = useState(false)
              const [ nodeData, setNodeData ] = useNodeData(path, originalNodeData, committed)
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
          registerIdNodeRenderer(),
          registerDataSelectNodeRenderer(),
          registerConditionalNodeRenderer(),
          registerNestedNodeRenderer()
        ]}
        cancel={() => history.push(backUri)}
        onSaved={() => history.push(backUri)}
      />
    </>
  )
}