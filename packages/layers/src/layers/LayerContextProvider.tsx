import { useEditor } from '@craftjs/core';
import { wrapConnectorHooks } from '@craftjs/utils';
import React, { useMemo, useContext, useRef, useEffect } from 'react';

import { LayerContext } from './LayerContext';
import { LayerNode } from './LayerNode';

import { LayerManagerContext } from '../manager';

export const LayerContextProvider: React.FC<Omit<
  LayerContext,
  'connectors'
>> = ({ id, depth }) => {
  const { store } = useContext(LayerManagerContext);
  const storeRef = useRef(store);
  storeRef.current = store;

  const connectorsUsage = useMemo(
    () => store.handlers.createConnectorsUsage(),
    [store]
  );

  const connectors = useMemo(
    () => wrapConnectorHooks(connectorsUsage.connectors),
    [connectorsUsage]
  );

  useEffect(() => {
    return () => {
      connectorsUsage.cleanup();
    };
  }, [connectorsUsage]);

  const { exists } = useEditor((state) => ({
    exists: !!state.nodes[id],
  }));

  if (!exists) {
    return null;
  }

  return (
    <LayerContext.Provider value={{ id, depth, connectors }}>
      <LayerNode />
    </LayerContext.Provider>
  );
};
