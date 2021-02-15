import { NodeEditRenderer } from "@graphter/renderer-react";
import {
  ErrorPanel,
  registerStringNodeRenderer,
  registerObjectNodeRenderer,
  registerListNodeRenderer
} from "@graphter/renderer-component-library-react";
import { useParams } from "react-router-dom";
import { registerIdNodeRenderer } from "../../node-renderers/id";
import { registerDataSelectNodeRenderer } from "../../node-renderers/data-select";
import { registerConditionalNodeRenderer } from "../../node-renderers/conditional";
import { registerNestedNodeRenderer } from "../../node-renderers/nested";
import { useHistory } from "react-router-dom";
import { pathUtils } from "@graphter/renderer-react";
import { useData, useConfig } from "@graphter/renderer-react";

export default function Edit(){
  const backUri = `/`
  const history = useHistory();
  const params = useParams<{ path: string }>();
  const path = pathUtils.fromUrl(params.path)
  const topNodeConfigId = path[0]
  const editingId = path[1]
  const topNodeConfig = useConfig(topNodeConfigId)

  const { loading, error, data } = useData(topNodeConfig, editingId)
  if(loading) return (
    <div>Loading...</div>
  )
  if(error){
    return (
      <div>Error: ${error}</div>
    )
  }
  return (
    <>
      {/*<Breadcrumb path={path} />*/}
      <NodeEditRenderer
        path={path}
        errorRenderer={ErrorPanel}
        startingData={data}
        typeRegistry={[
          registerStringNodeRenderer(),
          registerObjectNodeRenderer(),
          registerListNodeRenderer({
            customItemSelectionBehaviour: (customBehaviour, config, path) => {
              history.push(pathUtils.toUrl(path))
            }
          }),
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