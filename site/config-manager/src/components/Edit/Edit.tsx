import { NodeEditRenderer } from "@graphter/renderer-react";
import {
  ErrorPanel,
  registerStringNodeRenderer,
  registerObjectNodeRenderer,
  registerListNodeRenderer
} from "@graphter/renderer-component-library-react";
import { Link, useParams } from "react-router-dom";
import { registerIdNodeRenderer } from "../../node-renderers/id";
import { registerDataSelectNodeRenderer } from "../../node-renderers/data-select";
import { registerConditionalNodeRenderer } from "../../node-renderers/conditional";
import { registerNestedNodeRenderer } from "../../node-renderers/nested";
import { useHistory } from "react-router-dom";
import { pathUtils } from "@graphter/renderer-react";
import { useData, useConfig } from "@graphter/renderer-react";
import { Breadcrumbs } from "@graphter/renderer-component-library-react";
import React from "react";
import { nodeRendererStore } from "@graphter/renderer-react";
import { registerDynamicNodeRenderer } from "../../node-renderers/dynamic/registerDynamicNodeRenderer";

export default function Edit(){
  const backUri = `/`
  const history = useHistory();
  const params = useParams<{ path: string }>();
  const path = pathUtils.fromUrl(params.path)
  const topNodeConfigId = path[0]
  const editingId = path[1]
  const config = useConfig(topNodeConfigId)

  nodeRendererStore.registerAll([
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
    registerNestedNodeRenderer(),
    registerDynamicNodeRenderer({
      configServiceId: 'node-renderer-options-config'
    })
  ])

  const { loading, error, data } = useData(config, editingId)
  if(loading) return (
    <div>Loading...</div>
  )
  if(error){
    return (
      <div>Error: ${error.message}</div>
    )
  }
  return (
    <>
      <Breadcrumbs
        config={config}
        path={path}
        originalTreeData={data}
        AncestorCrumb={({ path, children }) => {
          return (
            <Link
              to={pathUtils.toUrl(path)}
              className='px-2 py-1 border border-gray-200 hover:bg-gray-100 mr-2 rounded text-gray-600 transition-colours duration-200'
            >
              {children}
            </Link>
          )
      }}
        CurrentCrumb={({ children }) => {
        return (
          <span className='px-2 py-1 border border-gray-200 bg-gray-100 mr-2 rounded text-gray-600'>
            {children}
          </span>
        )
      }}
      />
      <NodeEditRenderer
        path={path}
        errorRenderer={ErrorPanel}
        startingData={data}
        cancel={() => history.push(backUri)}
        onSaved={() => history.push(backUri)}
      />
    </>
  )
}