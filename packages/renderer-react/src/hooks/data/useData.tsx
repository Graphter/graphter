import React, {useEffect, useState} from 'react';
import { NodeConfig } from "@graphter/core";
import { isEmpty } from "../../util/id";
import { useTreeDataInitialiser } from "../../providers/state";
import { useService } from "../../providers/service";

interface UseDataResult {
  loading: boolean,
  error: Error | boolean,
  data: any
}

export const useData = (config: NodeConfig, instanceId: string | number): UseDataResult => {
  const [ loading, setLoading ] = useState(true)
  const [ error, setError ] = useState<Error | boolean>(false)
  const [ data, setData ] = useState()
  const treeDataInitialiser = useTreeDataInitialiser()
  const service = useService(config.id)
  useEffect(() => {
    (async () => {
      if (isEmpty(instanceId)) {
        setLoading(false)
      } else {
        try {
          const getResult = await service.get(instanceId);
          setLoading(false)
          if (!getResult.item) {
            setError(new Error(`Couldn't find a '${config.name}' with ID '${instanceId}'`))
            return;
          }
          treeDataInitialiser(config, [ config.id, instanceId ], true, getResult.item)
          setData(getResult.item)
        } catch (err) {
          console.error(err)
          setLoading(false)
          setError(new Error(`There was a problem loading that ${config.name}: ${err.message}`));
          return;
        }
      }
    })()
  }, [ config, instanceId ]);
  return {
    loading,
    error,
    data
  }
}