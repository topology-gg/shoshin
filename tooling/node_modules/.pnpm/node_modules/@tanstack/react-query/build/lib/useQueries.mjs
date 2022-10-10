import * as React from 'react';
import { useSyncExternalStore } from './useSyncExternalStore.mjs';
import { QueriesObserver, notifyManager } from '@tanstack/query-core';
import { useQueryClient } from './QueryClientProvider.mjs';
import { useIsRestoring } from './isRestoring.mjs';
import { useQueryErrorResetBoundary } from './QueryErrorResetBoundary.mjs';
import { ensurePreventErrorBoundaryRetry, useClearResetErrorBoundary, getHasError } from './errorBoundaryUtils.mjs';

// - `context` is omitted as it is passed as a root-level option to `useQueries` instead.

function useQueries({
  queries,
  context
}) {
  const queryClient = useQueryClient({
    context
  });
  const isRestoring = useIsRestoring();
  const defaultedQueries = React.useMemo(() => queries.map(options => {
    const defaultedOptions = queryClient.defaultQueryOptions(options); // Make sure the results are already in fetching state before subscribing or updating options

    defaultedOptions._optimisticResults = isRestoring ? 'isRestoring' : 'optimistic';
    return defaultedOptions;
  }), [queries, queryClient, isRestoring]);
  const [observer] = React.useState(() => new QueriesObserver(queryClient, defaultedQueries));
  const result = observer.getOptimisticResult(defaultedQueries);
  useSyncExternalStore(React.useCallback(onStoreChange => isRestoring ? () => undefined : observer.subscribe(notifyManager.batchCalls(onStoreChange)), [observer, isRestoring]), () => observer.getCurrentResult(), () => observer.getCurrentResult());
  React.useEffect(() => {
    // Do not notify on updates because of changes in the options because
    // these changes should already be reflected in the optimistic result.
    observer.setQueries(defaultedQueries, {
      listeners: false
    });
  }, [defaultedQueries, observer]);
  const errorResetBoundary = useQueryErrorResetBoundary();
  defaultedQueries.forEach(query => {
    ensurePreventErrorBoundaryRetry(query, errorResetBoundary);
  });
  useClearResetErrorBoundary(errorResetBoundary);
  const firstSingleResultWhichShouldThrow = result.find((singleResult, index) => {
    var _defaultedQueries$ind, _defaultedQueries$ind2;

    return getHasError({
      result: singleResult,
      errorResetBoundary,
      useErrorBoundary: (_defaultedQueries$ind = (_defaultedQueries$ind2 = defaultedQueries[index]) == null ? void 0 : _defaultedQueries$ind2.useErrorBoundary) != null ? _defaultedQueries$ind : false,
      query: observer.getQueries()[index]
    });
  });

  if (firstSingleResultWhichShouldThrow != null && firstSingleResultWhichShouldThrow.error) {
    throw firstSingleResultWhichShouldThrow.error;
  }

  return result;
}

export { useQueries };
//# sourceMappingURL=useQueries.mjs.map
