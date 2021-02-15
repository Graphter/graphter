import React, {useEffect, useState} from 'react';
import { NodeConfig } from "@graphter/core";
import { isEmpty } from "../../util/id";
import { useTreeDataInitialiser } from "../../providers/state";
import { useService } from "../../providers/service";

interface UseDataResult {
  loading: boolean,
  error?: Error,
  data?: any
}

export const useData = (config: NodeConfig, instanceId: string | number): UseDataResult => {
  const [ result, setResult ] = useState<UseDataResult>({ loading: true })
  const treeDataInitialiser = useTreeDataInitialiser()
  const service = useService(config.id)
  useEffect(() => {
    (async () => {
      if(isEmpty(instanceId)) {
        setResult({ loading: false })
      } else {
        try {
          const getResult = await service.get(instanceId);
          if (!getResult.item) {
            setResult({ loading: false, error: new Error(`Couldn't find a '${config.name}' with ID '${instanceId}'`) })
            return;
          }
          treeDataInitialiser(config, [ config.id, instanceId ], true, getResult.item)
          setResult({ loading: false, data: getResult.item })
        } catch (err) {
          console.error(err)
          setResult({ loading: false, error: new Error(`There was a problem loading that ${config.name}: ${err.message}`) })
          return;
        }
      }
    })()
  }, [ config, instanceId ]);
  return result
}