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
import Breadcrumb from "../Breadcrumb/Breadcrumb";

export default function Edit(){
  const backUri = `/`
  const history = useHistory();
  const params = useParams<{ path: string }>();
  const path = pathUtils.fromUrl(params.path)
  return (
    <>
      <Breadcrumb path={path} />
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